// ── DOM-level translation engine ────────────────────────────────────
//
// 1. Recursively scans the DOM tree for every Text node + translatable
//    attributes (placeholder, aria-label, title, alt).
// 2. Deduplicates and batches all unique strings into a single JSON object.
// 3. Sends the batch to /api/ai/translate for one-shot Gemini translation.
// 4. Maps translated values back to the original DOM nodes without
//    destroying event listeners or React-managed state.
// 5. Caches every result in localStorage so repeat phrases are instant.

const CACHE_KEY = "sanctuary_translations";
const MIN_LENGTH = 2;
const BATCH_CHUNK_SIZE = 40;

const SKIP_TAGS = new Set([
  "SCRIPT", "STYLE", "CODE", "PRE", "NOSCRIPT",
  "SVG", "PATH", "CIRCLE", "RECT", "LINE",
  "POLYGON", "POLYLINE", "ELLIPSE", "DEFS", "CLIPPATH",
]);

const TRANSLATABLE_ATTRS = ["placeholder", "aria-label", "title", "alt"];

// WeakMaps preserve the English original for each DOM node across re-scans.
// When React re-renders and creates new nodes, old entries are GC'd naturally.
const nodeOriginals = new WeakMap<Text, string>();
const attrOriginals = new WeakMap<Element, Record<string, string>>();

interface TextEntry  { node: Text;    original: string }
interface AttrEntry  { element: Element; attr: string; original: string }
interface ScanResult { texts: TextEntry[]; attrs: AttrEntry[] }

// ── Cache helpers ───────────────────────────────────────────────────

function readCache(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
  } catch { return {}; }
}

function writeCache(cache: Record<string, string>) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); }
  catch { /* quota exceeded */ }
}

function ck(text: string, lang: string) { return `${lang}::${text}`; }

// ── Text classification ─────────────────────────────────────────────

function isTranslatable(raw: string): boolean {
  const t = raw.trim();
  if (t.length < MIN_LENGTH) return false;
  if (/^[\d\s.,!?;:'"()\[\]{}<>@#$%^&*_+=|\\~`\/\-–—…•·]+$/.test(t)) return false;
  if (/^https?:\/\//.test(t)) return false;
  return true;
}

// ── 1. Recursive DOM Scanner ────────────────────────────────────────

export function scanDOM(root: Node): ScanResult {
  const texts: TextEntry[] = [];
  const attrs: AttrEntry[] = [];

  function walk(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const raw = node.textContent || "";
      if (isTranslatable(raw)) {
        if (!nodeOriginals.has(node as Text)) {
          nodeOriginals.set(node as Text, raw);
        }
        texts.push({ node: node as Text, original: nodeOriginals.get(node as Text)! });
      }
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as Element;
    if (SKIP_TAGS.has(el.tagName)) return;

    for (const attr of TRANSLATABLE_ATTRS) {
      const val = el.getAttribute(attr);
      if (val && isTranslatable(val)) {
        if (!attrOriginals.has(el)) attrOriginals.set(el, {});
        const map = attrOriginals.get(el)!;
        if (!(attr in map)) map[attr] = val;
        attrs.push({ element: el, attr, original: map[attr] });
      }
    }

    for (let i = 0; i < node.childNodes.length; i++) {
      walk(node.childNodes[i]);
    }
  }

  walk(root);
  return { texts, attrs };
}

// ── 2. Batch API call ───────────────────────────────────────────────

async function fetchBatch(
  batch: Record<string, string>,
  targetLanguage: string
): Promise<Record<string, string>> {
  try {
    const res = await fetch("/api/ai/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ batch, targetLanguage }),
    });
    if (!res.ok) return {};
    const data = await res.json();
    return data.translated || {};
  } catch {
    return {};
  }
}

// ── 3. Core: scan → batch → replace ────────────────────────────────

export async function translateDOM(
  root: Node,
  targetLanguage: string
): Promise<void> {
  if (targetLanguage === "en") {
    restoreOriginals(root);
    return;
  }

  const { texts, attrs } = scanDOM(root);
  const cache = readCache();

  // Collect every unique string that isn't already cached
  const uncached = new Map<string, string>();
  let idx = 0;

  for (const { original } of texts) {
    const t = original.trim();
    if (!cache[ck(t, targetLanguage)] && !uncached.has(t)) {
      uncached.set(t, `t${idx++}`);
    }
  }
  for (const { original } of attrs) {
    const t = original.trim();
    if (!cache[ck(t, targetLanguage)] && !uncached.has(t)) {
      uncached.set(t, `t${idx++}`);
    }
  }

  // Send uncached strings to Gemini in chunks
  if (uncached.size > 0) {
    const entries = Array.from(uncached.entries());
    const chunks: Record<string, string>[] = [];

    for (let i = 0; i < entries.length; i += BATCH_CHUNK_SIZE) {
      const chunk: Record<string, string> = {};
      for (const [text, key] of entries.slice(i, i + BATCH_CHUNK_SIZE)) {
        chunk[key] = text;
      }
      chunks.push(chunk);
    }

    const results = await Promise.all(
      chunks.map((c) => fetchBatch(c, targetLanguage))
    );

    // Merge translations into cache
    const updated = readCache();
    for (let ci = 0; ci < chunks.length; ci++) {
      for (const [key, original] of Object.entries(chunks[ci])) {
        if (results[ci][key]) {
          updated[ck(original, targetLanguage)] = results[ci][key];
        }
      }
    }
    writeCache(updated);
  }

  // 4. Apply translations back to the DOM (preserves listeners & styles)
  const final = readCache();

  for (const { node, original } of texts) {
    const translated = final[ck(original.trim(), targetLanguage)];
    if (translated) {
      const leading  = original.match(/^\s*/)?.[0] || "";
      const trailing = original.match(/\s*$/)?.[0] || "";
      node.textContent = leading + translated + trailing;
    }
  }

  for (const { element, attr, original } of attrs) {
    const translated = final[ck(original.trim(), targetLanguage)];
    if (translated) {
      element.setAttribute(attr, translated);
    }
  }
}

// ── 5. Restore English originals ────────────────────────────────────

function restoreOriginals(root: Node) {
  const { texts, attrs } = scanDOM(root);

  for (const { node, original } of texts) {
    if (node.textContent !== original) node.textContent = original;
  }
  for (const { element, attr, original } of attrs) {
    if (element.getAttribute(attr) !== original) {
      element.setAttribute(attr, original);
    }
  }
}
