import { useState, useEffect, useRef } from "react";

// ─── LIVE CALENDAR DATA (from Google Calendar API) ───────────────────────────
const LIVE_CALENDAR_EVENTS = [
  {
    id: "289if6eikpg9hljmmj672rf459",
    summary: "Bio 121",
    start: "2026-03-28T00:00:00",
    end: "2026-03-28T01:00:00",
    type: "class"
  },
  {
    id: "36t3v0f3dfvpm2q2loibejc986",
    summary: "CIS exam",
    start: "2026-03-28T01:00:00",
    end: "2026-03-28T03:00:00",
    type: "exam"
  }
];

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const MENTORS = [
  { id:1, name:"Dr. Sarah Chen", title:"Clinical Psychologist", specialty:"Anxiety & Academic Stress", avatar:"SC", avail:"Mon, Wed, Fri", next:"Tomorrow 2:00 PM", focus:["anxiety","motivation","assignments"] },
  { id:2, name:"James Okafor",   title:"Youth Counsellor",      specialty:"Motivation & Life Direction", avatar:"JO", avail:"Tue, Thu, Sat", next:"Thursday 11:00 AM", focus:["motivation","lost","anhedonia"] },
  { id:3, name:"Dr. Priya Mehta",title:"Psychiatrist",           specialty:"Depression & Sleep",          avatar:"PM", avail:"Mon–Fri",      next:"Today 4:30 PM",      focus:["sleep","anhedonia","motivation"] },
  { id:4, name:"Lisa Thornton",  title:"Mindfulness Coach",      specialty:"Stress & Burnout",            avatar:"LT", avail:"Wed, Fri, Sun",next:"Friday 10:00 AM",    focus:["anxiety","financial","social"] },
];

const TRACKER_TYPES = {
  "High school student": ["Assignment due","Exam / test","Presentation","School event","Parent meeting","Doctor / dentist","Personal goal","Other"],
  "University student":  ["Assignment due","Exam / assessment","Project submission","Dissertation milestone","Internship deadline","Appointment","Personal goal","Other"],
  "Working full-time":   ["Work deadline","Meeting / presentation","Performance review","Bill / payment due","Medical appointment","Personal goal","Other"],
  "Working part-time":   ["Work shift","Assignment deadline","Bill due","Medical appointment","Personal goal","Other"],
  "Gap year":            ["Application deadline","Interview","Travel plan","Course deadline","Medical appointment","Personal goal","Other"],
};

const AFFIRMATIONS = [
  "You are doing better than you think.",
  "Progress, not perfection.",
  "One step at a time is still moving forward.",
  "It's okay to rest. Rest is productive.",
  "You've gotten through hard days before. You'll get through this one too.",
  "Your feelings are valid. And they will pass.",
  "Small wins count. Notice them.",
];

const COPING_TOOLS = [
  { name:"4-7-8 Breathing",       desc:"Inhale 4 sec, hold 7, exhale 8. Calms your nervous system in under 2 minutes.", tag:"Anxiety"   },
  { name:"5-4-3-2-1 Grounding",   desc:"Name 5 things you see, 4 touch, 3 hear, 2 smell, 1 taste. Anchors you to now.",  tag:"Overwhelm" },
  { name:"Body scan",             desc:"Close your eyes, scan head to toe. Notice tension without judgment.",             tag:"Stress"    },
  { name:"One-sentence journal",  desc:"Write one honest sentence about how you're feeling. No more needed.",             tag:"Low mood"  },
  { name:"Cold water reset",      desc:"Splash cold water on your face. Activates your dive reflex — instant calm.",      tag:"Panic"     },
  { name:"Move for 5 minutes",    desc:"Walk, stretch, or shake your hands. Physical movement breaks a mental loop.",     tag:"Stuck"     },
];

const DAILY_SCHEDULE = [
  {time:"7:30 AM",dot:"#7F77DD",title:"Wake up — no snooze",    detail:"Open blinds first. No phone for 10 min. Start with a glass of water."},
  {time:"7:45 AM",dot:"var(--teal)",title:"Morning movement",        detail:"10-min walk or stretch. No gym needed. Just move before the day begins."},
  {time:"8:00 AM",dot:"#c9956a",title:"Nourishing breakfast",    detail:"Eat before any screen. Food first, phone second."},
  {time:"9:00 AM",dot:"#378ADD",title:"Deep focus — 90 min",     detail:"Phone away. Hardest task first. Pomodoro: 25 on, 5 off."},
  {time:"10:45 AM",dot:"#888780",title:"Mindful break",          detail:"15 min outside if possible. No scrolling."},
  {time:"12:30 PM",dot:"#c9956a",title:"Lunch with presence",    detail:"Eat with someone 3× a week. Social connection is medicine."},
  {time:"2:00 PM",dot:"#378ADD",title:"Second work block",       detail:"Lighter tasks. Set one win for the afternoon and finish it."},
  {time:"5:00 PM",dot:"var(--teal)",title:"Movement — 30 min",       detail:"Walk, run, gym. Exercise is the most evidence-backed mood tool."},
  {time:"7:00 PM",dot:"#c9956a",title:"Dinner and wind-down",    detail:"Cook something simple. Eat slowly. Begin lowering the pace."},
  {time:"8:30 PM",dot:"#7F77DD",title:"Gentle evening",          detail:"No more work. Reading, journaling, or a calm show."},
  {time:"9:30 PM",dot:"#7F77DD",title:"Phone out of bedroom",    detail:"Charge it outside. This one habit adds ~40 min of sleep quality."},
  {time:"10:30 PM",dot:"#7F77DD",title:"Lights out",             detail:"Aim for 8 hours. Sleep is the foundation of everything."},
];

const FREE_TIME_SUGGESTIONS = {
  busy: {
    label: "You have a heavy day",
    color: "#e07a5f",
    bg: "rgba(224,122,95,.08)",
    border: "rgba(224,122,95,.2)",
    tagColor: "#c0604a",
    suggestions: [
      { icon:"🌿", title:"Take a proper break", desc:"Step outside for 15 minutes. Don't check your phone. Your brain needs white space between tasks." },
      { icon:"🎵", title:"Listen to something you love", desc:"20 minutes of music you enjoy lowers cortisol. Put on a playlist and do nothing else." },
      { icon:"😴", title:"Protect your sleep tonight", desc:"With a heavy schedule, sleep is non-negotiable. Set a hard wind-down at 9:30pm tonight." },
      { icon:"🧘", title:"5-minute breathing reset", desc:"Try 4-7-8 breathing between your sessions. Even one round noticeably lowers stress." },
      { icon:"📵", title:"Phone-free meal",         desc:"Eat at least one meal today without your phone. It resets your nervous system more than you think." },
    ]
  },
  moderate: {
    label: "You have a balanced day",
    color: "#BA7517",
    bg: "rgba(186,117,23,.07)",
    border: "rgba(186,117,23,.2)",
    tagColor: "#8B6020",
    suggestions: [
      { icon:"📖", title:"Read something for pleasure", desc:"30 minutes of reading (not a screen) — fiction, a magazine, anything you enjoy." },
      { icon:"🚶", title:"Take a longer walk",        desc:"Walk somewhere new for 30 minutes. New environments reset your mood more effectively than familiar routes." },
      { icon:"👋", title:"Reach out to a friend",     desc:"Text or call one person you haven't spoken to in a while. Connection is cumulative." },
      { icon:"🎯", title:"Work on a personal goal",   desc:"Use your energy on something that matters to you personally — not just obligations." },
    ]
  },
  free: {
    label: "You have a light day",
    color: "var(--teal)",
    bg: "rgba(29,158,117,.07)",
    border: "rgba(29,158,117,.2)",
    tagColor: "var(--teal2)",
    suggestions: [
      { icon:"🧠", title:"Learn something new",      desc:"Take an online class, watch a lecture, or read a chapter on a topic you're curious about." },
      { icon:"🏋️", title:"Exercise properly today", desc:"Light days are perfect for a longer workout. Build the habit while you have the energy." },
      { icon:"✍️", title:"Journal or reflect",      desc:"Write about where you are and where you want to go. Clarity compounds over time." },
      { icon:"📋", title:"Plan the week ahead",     desc:"Spend 30 minutes organising your upcoming week. Future-you will thank you." },
      { icon:"🎨", title:"Do something creative",   desc:"Draw, cook something new, play music — creative activity is strongly linked to better mental health." },
    ]
  }
};

// ─── CSS INJECTION ────────────────────────────────────────────────────────────
const injectCss = () => {
  if (document.getElementById("mp-styles")) return;
  const el = document.createElement("style");
  el.id = "mp-styles";
  el.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
    :root{
      --navy:#0d1b2a;--navy2:#142335;--navy3:#1c3148;
      --teal:#1d9e75;--teal2:#157a5b;--teal-light:#e1f5ee;
      --cream:#f5f0e8;--cream2:#ece6d8;
      --warm:#e8c98a;--coral:#e07a5f;
      --text-light:#f0ebe0;--text-muted:#8baab8;--text-dark:#1a2a38;
      --border:rgba(255,255,255,0.08);--border-light:rgba(26,42,56,0.1);
      --radius:16px;--radius-sm:10px;
    }
    *{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
    body{font-family:'DM Sans',sans-serif;background:var(--navy);color:var(--text-light);overflow-x:hidden}
    h1,h2,h3,h4{font-family:'DM Serif Display',serif;font-weight:400}
    input,textarea,select,button{font-family:'DM Sans',sans-serif}
    @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideIn{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}
    @keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}
    @keyframes shimmer{0%{opacity:.5}50%{opacity:1}100%{opacity:.5}}
    .fade-up{animation:fadeUp .6s ease both}.slide-in{animation:slideIn .35s ease both}
    .shimmer{animation:shimmer 2s ease infinite}
    a{text-decoration:none;color:inherit}
    input[type=date]::-webkit-calendar-picker-indicator{opacity:.6;cursor:pointer}
  `;
  document.head.appendChild(el);
};

// ─── CALENDAR ANALYSIS ────────────────────────────────────────────────────────
function analyzeCalendar(events) {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const todayEvents = events.filter(e => {
    const d = (e.start?.dateTime || e.start?.date || e.start || "").split("T")[0];
    return d === todayStr;
  });

  // Calculate total busy hours today
  let totalHours = 0;
  todayEvents.forEach(e => {
    const start = new Date(e.start?.dateTime || e.start?.date || e.start);
    const end = new Date(e.end?.dateTime || e.end?.date || e.end);
    totalHours += (end - start) / 3600000;
  });

  // Check for late-night events (after 10pm)
  const lateNight = todayEvents.some(e => {
    const h = new Date(e.start?.dateTime || e.start).getHours();
    return h >= 22 || h < 5;
  });

  // Check for exam/high-stress events
  const hasExam = todayEvents.some(e =>
    (e.summary || "").toLowerCase().match(/exam|test|quiz|assessment|deadline|submission/)
  );

  let level = "free";
  if (totalHours >= 4 || hasExam) level = "busy";
  else if (totalHours >= 1.5) level = "moderate";

  return { todayEvents, totalHours, lateNight, hasExam, level };
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const daysUntil = (dateStr) => {
  if (!dateStr) return { label:"No date", color:"var(--text-muted)" };
  const diff = new Date(dateStr) - new Date();
  const d = Math.ceil(diff / 86400000);
  if (d < 0) return { label:"Overdue",    color:"var(--coral)" };
  if (d === 0) return { label:"Today!",   color:"var(--coral)" };
  if (d === 1) return { label:"Tomorrow", color:"var(--warm)" };
  if (d <= 7)  return { label:`In ${d} days`, color:"var(--warm)" };
  return { label:`In ${d} days`, color:"var(--teal)" };
};

function SectionTag({ children, light }) {
  return <div style={{fontSize:".72rem",fontWeight:600,letterSpacing:".12em",textTransform:"uppercase",color:light?"rgba(240,235,224,.5)":"var(--teal)",marginBottom:".6rem"}}>{children}</div>;
}

function Label({ children, sub }) {
  return (
    <div style={{marginBottom:".7rem"}}>
      <div style={{fontSize:".88rem",fontWeight:600,color:"var(--text-light)"}}>{children}</div>
      {sub && <div style={{fontSize:".78rem",color:"var(--text-muted)",marginTop:".15rem"}}>{sub}</div>}
    </div>
  );
}

function Chip({ label, selected, onClick, danger }) {
  return (
    <span onClick={onClick} style={{display:"inline-block",padding:".4rem .9rem",borderRadius:20,border:`1.5px solid ${selected?(danger?"var(--coral)":"var(--teal)"):"var(--border)"}`,background:selected?(danger?"rgba(224,122,95,.1)":"var(--teal)"):"var(--navy3)",color:selected?(danger?"var(--coral)":"#fff"):"var(--text-muted)",cursor:"pointer",transition:"all .15s",userSelect:"none",margin:"0 .3rem .4rem 0",fontSize:".82rem",fontWeight:500}}>
      {label}
    </span>
  );
}

function TInput({ style={}, ...p }) {
  return <input style={{width:"100%",padding:".7rem 1rem",border:"1.5px solid var(--border)",borderRadius:10,fontSize:".9rem",background:"var(--navy3)",color:"var(--text-light)",outline:"none",...style}} {...p}/>;
}

// ─── CALENDAR SIGN-IN PANEL ───────────────────────────────────────────────────
function CalendarSignIn({ onConnect }) {
  const [email, setEmail] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState("");

  const connect = () => {
    if (!email.includes("@")) { setError("Please enter a valid email address."); return; }
    setConnecting(true);
    setError("");
    // Simulate OAuth flow — in production this triggers Google OAuth
    setTimeout(() => {
      setConnecting(false);
      onConnect(email);
    }, 1600);
  };

  return (
    <div style={{background:"var(--navy2)",border:"1px solid var(--border)",borderRadius:16,padding:"2rem",maxWidth:440,margin:"0 auto"}}>
      <div style={{display:"flex",alignItems:"center",gap:".75rem",marginBottom:"1.25rem"}}>
        <div style={{width:40,height:40,borderRadius:10,background:"var(--teal-light)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem",flexShrink:0}}>📅</div>
        <div>
          <div style={{fontSize:"1rem",fontWeight:600,color:"var(--text-light)"}}>Connect your Google Calendar</div>
          <div style={{fontSize:".8rem",color:"var(--text-muted)"}}>So we can see your schedule and suggest the right support</div>
        </div>
      </div>
      <div style={{background:"rgba(29,158,117,.05)",border:"1px solid rgba(29,158,117,.15)",borderRadius:10,padding:".85rem 1rem",marginBottom:"1.25rem",fontSize:".82rem",color:"var(--teal2)",lineHeight:1.65}}>
        We read your events to understand your day. We never store or share your calendar data. Each user connects their own account so we understand their personal schedule.
      </div>
      <div style={{marginBottom:".75rem"}}>
        <Label>Your Google email</Label>
        <TInput type="email" placeholder="yourname@gmail.com" value={email} onChange={e=>{setEmail(e.target.value);setError("")}}/>
        {error && <div style={{fontSize:".78rem",color:"var(--coral)",marginTop:".4rem"}}>{error}</div>}
      </div>
      <button onClick={connect} disabled={connecting} style={{width:"100%",padding:".78rem",borderRadius:10,border:"none",background:connecting?"var(--navy3)":"var(--teal)",color:connecting?"var(--text-muted)":"#fff",fontWeight:600,fontSize:".92rem",cursor:connecting?"default":"pointer",transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",gap:".5rem"}}>
        {connecting ? <><span className="shimmer">Connecting to Google Calendar...</span></> : "Connect Google Calendar →"}
      </button>
      <div style={{fontSize:".75rem",color:"var(--text-muted)",textAlign:"center",marginTop:".75rem",lineHeight:1.6}}>
        Your friend using this platform connects their own calendar — their schedule stays private from you and vice versa.
      </div>
    </div>
  );
}

// ─── FREE TIME SUGGESTIONS PANEL ─────────────────────────────────────────────
function FreeTimeSuggestions({ events, connectedEmail }) {
  const analysis = analyzeCalendar(events);
  const suggestion = FREE_TIME_SUGGESTIONS[analysis.level];

  const formatTime = (dt) => {
    if (!dt) return "";
    const d = new Date(dt);
    return d.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",hour12:true});
  };

  return (
    <div className="slide-in">
      {/* Calendar summary */}
      <div style={{background:"rgba(55,138,221,.06)",border:"1px solid rgba(55,138,221,.15)",borderRadius:12,padding:"1rem 1.2rem",marginBottom:"1.25rem"}}>
        <div style={{display:"flex",alignItems:"center",gap:".6rem",marginBottom:".5rem"}}>
          <span style={{fontSize:".95rem"}}>📅</span>
          <span style={{fontSize:".85rem",fontWeight:600,color:"#185FA5"}}>
            {connectedEmail ? `Connected: ${connectedEmail}` : "Your Google Calendar"}
          </span>
        </div>
        {analysis.todayEvents.length === 0 ? (
          <div style={{fontSize:".82rem",color:"var(--text-muted)"}}>No events today — your calendar is clear.</div>
        ) : (
          <div>
            <div style={{fontSize:".82rem",color:"var(--text-muted)",marginBottom:".5rem"}}>Today's schedule ({Math.round(analysis.totalHours*10)/10}h booked):</div>
            {analysis.todayEvents.map((ev,i) => (
              <div key={i} style={{display:"flex",alignItems:"center",gap:".6rem",padding:".35rem 0",borderTop:i>0?"1px solid rgba(55,138,221,.08)":"none"}}>
                <span style={{fontSize:".72rem",fontWeight:600,background:"rgba(55,138,221,.1)",color:"#185FA5",padding:"2px 7px",borderRadius:5,flexShrink:0}}>{ev.type||"event"}</span>
                <span style={{fontSize:".85rem",fontWeight:500,color:"var(--text-light)"}}>{ev.summary}</span>
                <span style={{fontSize:".78rem",color:"var(--text-muted)",marginLeft:"auto",flexShrink:0}}>
                  {formatTime(ev.start?.dateTime||ev.start)} – {formatTime(ev.end?.dateTime||ev.end)}
                </span>
              </div>
            ))}
          </div>
        )}
        {analysis.lateNight && (
          <div style={{marginTop:".6rem",padding:".5rem .75rem",background:"rgba(192,96,74,.08)",border:"1px solid rgba(192,96,74,.2)",borderRadius:8,fontSize:".8rem",color:"var(--coral)"}}>
            ⚠️ Late-night sessions detected. Studying past midnight disrupts sleep and hurts next-day performance. Consider rescheduling if you can.
          </div>
        )}
        {analysis.hasExam && (
          <div style={{marginTop:".6rem",padding:".5rem .75rem",background:"rgba(186,117,23,.07)",border:"1px solid rgba(186,117,23,.2)",borderRadius:8,fontSize:".8rem",color:"#8B6020"}}>
            📝 Exam or deadline today — make sure you've eaten, slept, and taken at least one break before it.
          </div>
        )}
      </div>

      {/* Suggestions based on busyness */}
      <div style={{background:suggestion.bg,border:`1px solid ${suggestion.border}`,borderRadius:12,padding:"1.1rem 1.25rem",marginBottom:"1rem"}}>
        <div style={{display:"flex",alignItems:"center",gap:".6rem",marginBottom:".75rem"}}>
          <span style={{fontSize:".78rem",fontWeight:600,background:suggestion.bg,color:suggestion.tagColor,padding:"3px 9px",borderRadius:5,border:`1px solid ${suggestion.border}`,textTransform:"uppercase",letterSpacing:".06em"}}>{suggestion.label}</span>
        </div>
        <div style={{fontSize:".85rem",color:"var(--text-light)",fontWeight:500,marginBottom:".15rem"}}>
          {analysis.level === "busy"   && "Your day is packed. Here's how to protect your wellbeing:"}
          {analysis.level === "moderate" && "You have some breathing room today. Make good use of it:"}
          {analysis.level === "free"   && "You have a light day. Here's what we suggest for your free time:"}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:".75rem"}}>
        {suggestion.suggestions.map((s,i) => (
          <div key={i} style={{background:"var(--navy3)",border:"1px solid var(--border)",borderRadius:12,padding:"1.1rem"}}>
            <div style={{fontSize:"1.3rem",marginBottom:".5rem"}}>{s.icon}</div>
            <div style={{fontSize:".9rem",fontWeight:600,color:"var(--text-light)",marginBottom:".35rem"}}>{s.title}</div>
            <div style={{fontSize:".8rem",color:"var(--text-muted)",lineHeight:1.65}}>{s.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MOOD CHECK-IN ────────────────────────────────────────────────────────────
const MOODS = [{score:1,emoji:"😔",label:"Very low"},{score:2,emoji:"😞",label:"Low"},{score:3,emoji:"😐",label:"Okay"},{score:4,emoji:"🙂",label:"Pretty good"},{score:5,emoji:"😊",label:"Good"}];

function MoodCheckin({ onComplete }) {
  const [sel, setSel] = useState(null);
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);
  const submit = () => { if (!sel) return; setDone(true); setTimeout(()=>onComplete({score:sel,note}),900); };
  if (done) return (
    <div style={{textAlign:"center",padding:"1.5rem"}}>
      <div style={{fontSize:"2rem",marginBottom:".5rem"}}>✦</div>
      <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.1rem",color:"var(--text-light)",marginBottom:".3rem"}}>Logged. Thank you for checking in.</div>
      <div style={{fontSize:".83rem",color:"var(--text-muted)"}}>Your mood is saved. We track patterns over time.</div>
    </div>
  );
  return (
    <div>
      <div style={{textAlign:"center",marginBottom:"1.2rem"}}>
        <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.15rem",color:"var(--text-light)",marginBottom:".3rem"}}>How are you feeling right now?</div>
        <div style={{fontSize:".82rem",color:"var(--text-muted)"}}>Be honest — there are no wrong answers here.</div>
      </div>
      <div style={{display:"flex",justifyContent:"center",gap:".55rem",marginBottom:"1.2rem",flexWrap:"wrap"}}>
        {MOODS.map(m=>(
          <div key={m.score} onClick={()=>setSel(m.score)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:".28rem",cursor:"pointer",padding:".65rem .75rem",borderRadius:12,border:`2px solid ${sel===m.score?"var(--teal)":"var(--border)"}`,background:sel===m.score?"rgba(29,158,117,.15)":"var(--navy3)",transition:"all .15s",minWidth:58}}>
            <span style={{fontSize:"1.55rem"}}>{m.emoji}</span>
            <span style={{fontSize:".69rem",fontWeight:500,color:sel===m.score?"var(--teal)":"var(--text-muted)"}}>{m.label}</span>
          </div>
        ))}
      </div>
      {sel && <div style={{marginBottom:"1rem",animation:"fadeUp .4s ease both"}}><textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="What's on your mind? (optional)" rows={2} style={{width:"100%",padding:".68rem 1rem",border:"1.5px solid var(--border)",borderRadius:10,fontSize:".85rem",resize:"none",outline:"none",background:"var(--navy3)",color:"var(--text-light)",height:68}}/></div>}
      <button onClick={submit} disabled={!sel} style={{width:"100%",padding:".73rem",borderRadius:10,border:"none",background:sel?"var(--teal)":"var(--navy3)",color:sel?"#fff":"var(--text-muted)",fontWeight:600,fontSize:".9rem",cursor:sel?"pointer":"default",transition:"all .2s"}}>
        Save check-in
      </button>
    </div>
  );
}

// ─── MENTOR SECTION ───────────────────────────────────────────────────────────
function MentorSection({ struggles, onBook, bookedId }) {
  const relevant = MENTORS.filter(m=>struggles.some(s=>m.focus.some(f=>s.toLowerCase().includes(f)))).slice(0,3);
  const shown = relevant.length > 0 ? relevant : MENTORS.slice(0,3);
  return (
    <div className="slide-in" style={{marginTop:"1.1rem"}}>
      <div style={{background:"rgba(192,96,74,.06)",border:"1px solid rgba(192,96,74,.2)",borderRadius:12,padding:"1rem 1.2rem",marginBottom:"1.1rem"}}>
        <div style={{fontSize:".88rem",fontWeight:600,color:"var(--coral)",marginBottom:".3rem"}}>You don't have to go through this alone.</div>
        <div style={{fontSize:".82rem",color:"#a07060",lineHeight:1.7}}>
          Reach out right now if you need immediate support:<br/>
          🇺🇸 US: call or text <strong>988</strong> &nbsp;·&nbsp; 🇬🇧 UK: <strong>116 123</strong> &nbsp;·&nbsp; 🌍 <strong>findahelpline.com</strong>
        </div>
      </div>
      <div style={{fontSize:".85rem",fontWeight:600,color:"var(--text-light)",marginBottom:".75rem"}}>Would you like to speak with a mentor? Book a free session:</div>
      {shown.map(m=>(
        <div key={m.id} style={{background:m.id===bookedId?"rgba(29,158,117,.1)":"var(--navy3)",border:`1.5px solid ${m.id===bookedId?"var(--teal)":"var(--border)"}`,borderRadius:14,padding:"1rem",marginBottom:".6rem",transition:"all .2s"}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:".85rem"}}>
            <div style={{width:40,height:40,borderRadius:"50%",background:"var(--teal-light)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".78rem",fontWeight:700,color:"var(--teal2)",flexShrink:0}}>{m.avatar}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:".5rem",marginBottom:".15rem",flexWrap:"wrap"}}>
                <span style={{fontSize:".88rem",fontWeight:600,color:"var(--text-light)"}}>{m.name}</span>
                {m.id===bookedId&&<span style={{fontSize:".65rem",background:"var(--teal)",color:"#fff",padding:"2px 7px",borderRadius:6,fontWeight:600}}>Booked ✓</span>}
              </div>
              <div style={{fontSize:".77rem",color:"var(--teal2)",marginBottom:".4rem"}}>{m.title} · {m.specialty}</div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:".5rem"}}>
                <div>
                  <span style={{fontSize:".74rem",color:"var(--text-muted)"}}>Next: </span>
                  <span style={{fontSize:".74rem",fontWeight:600,color:"var(--teal2)"}}>{m.next}</span>
                  <span style={{fontSize:".72rem",color:"var(--text-muted)",marginLeft:".4rem"}}>{m.avail}</span>
                </div>
                <button onClick={()=>onBook(m.id===bookedId?null:m.id)} style={{padding:".42rem .9rem",borderRadius:8,fontSize:".78rem",fontWeight:600,cursor:"pointer",border:"none",background:m.id===bookedId?"var(--teal)":"var(--teal-light)",color:m.id===bookedId?"#fff":"var(--teal2)",transition:"all .2s"}}>
                  {m.id===bookedId?"✓ Booked":"Book appointment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── TRACKER ─────────────────────────────────────────────────────────────────
function Tracker({ situation, calendarEvents }) {
  const types = TRACKER_TYPES[situation] || TRACKER_TYPES["Gap year"];
  const [items, setItems] = useState(()=>
    calendarEvents.map(e=>({id:e.id,type:"Calendar event",title:e.summary,date:(e.start?.dateTime||e.start||"").split("T")[0],notes:"",fromCalendar:true}))
  );
  const [adding, setAdding] = useState(false);
  const [f, setF] = useState({type:types[0],title:"",date:"",notes:""});
  const add = ()=>{if(!f.title.trim()||!f.date)return;setItems(p=>[...p,{...f,id:Date.now(),fromCalendar:false}]);setF({type:types[0],title:"",date:"",notes:""});setAdding(false);};
  const sorted = [...items].sort((a,b)=>new Date(a.date)-new Date(b.date));

  return (
    <div>
      <div style={{background:"rgba(55,138,221,.06)",border:"1px solid rgba(55,138,221,.15)",borderRadius:12,padding:".85rem 1.1rem",marginBottom:".9rem",display:"flex",alignItems:"flex-start",gap:".7rem"}}>
        <span style={{fontSize:"1rem",flexShrink:0}}>📅</span>
        <div>
          <div style={{fontSize:".84rem",fontWeight:600,color:"#185FA5",marginBottom:".15rem"}}>Upcoming dates tracker</div>
          <div style={{fontSize:".78rem",color:"var(--text-muted)",lineHeight:1.6}}>
            {calendarEvents.length>0?`${calendarEvents.length} event(s) pulled from Google Calendar. Add anything else important below.`:"Add deadlines, appointments, or anything you don't want to forget. Your roadmap builds around these."}
          </div>
        </div>
      </div>
      {sorted.map(item=>{
        const due=daysUntil(item.date);
        return(
          <div key={item.id} className="slide-in" style={{display:"flex",alignItems:"flex-start",gap:".7rem",background:"var(--navy3)",border:"1px solid var(--border)",borderRadius:10,padding:".7rem .95rem",marginBottom:".45rem"}}>
            {item.fromCalendar&&<span style={{fontSize:".85rem",flexShrink:0}}>📅</span>}
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:".4rem",flexWrap:"wrap",marginBottom:".15rem"}}>
                <span style={{fontSize:".87rem",fontWeight:600,color:"var(--text-light)"}}>{item.title}</span>
                <span style={{fontSize:".67rem",background:"var(--teal-light)",color:"var(--teal2)",padding:"2px 6px",borderRadius:4,fontWeight:500}}>{item.type}</span>
                {item.fromCalendar&&<span style={{fontSize:".65rem",background:"rgba(55,138,221,.1)",color:"#185FA5",padding:"2px 5px",borderRadius:4}}>Google Calendar</span>}
              </div>
              <div style={{display:"flex",gap:".65rem",alignItems:"center"}}>
                <span style={{fontSize:".76rem",color:"var(--text-muted)"}}>{item.date?new Date(item.date+"T12:00:00").toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"}):""}</span>
                <span style={{fontSize:".73rem",fontWeight:600,color:due.color}}>{due.label}</span>
              </div>
              {item.notes&&<div style={{fontSize:".74rem",color:"var(--text-muted)",marginTop:".15rem"}}>{item.notes}</div>}
            </div>
            {!item.fromCalendar&&<button onClick={()=>setItems(p=>p.filter(i=>i.id!==item.id))} style={{background:"none",border:"none",cursor:"pointer",color:"#ccc",fontSize:"1rem",lineHeight:1,padding:"0 .2rem",flexShrink:0}}>×</button>}
          </div>
        );
      })}
      {adding?(
        <div className="slide-in" style={{background:"var(--navy3)",border:"1.5px solid var(--teal)",borderRadius:12,padding:"1.2rem"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:".6rem",marginBottom:".6rem"}}>
            <div>
              <div style={{fontSize:".77rem",fontWeight:600,color:"var(--text-light)",marginBottom:".32rem"}}>Type</div>
              <select value={f.type} onChange={e=>setF(p=>({...p,type:e.target.value}))} style={{width:"100%",padding:".6rem .8rem",border:"1.5px solid var(--border)",borderRadius:8,fontSize:".84rem",background:"var(--navy3)",color:"var(--text-light)",outline:"none"}}>
                {types.map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <div style={{fontSize:".77rem",fontWeight:600,color:"var(--text-light)",marginBottom:".32rem"}}>Date</div>
              <input type="date" value={f.date} onChange={e=>setF(p=>({...p,date:e.target.value}))} style={{width:"100%",padding:".6rem .8rem",border:"1.5px solid var(--border)",borderRadius:8,fontSize:".84rem",background:"var(--navy3)",color:"var(--text-light)",outline:"none"}}/>
            </div>
          </div>
          <div style={{marginBottom:".6rem"}}>
            <div style={{fontSize:".77rem",fontWeight:600,color:"var(--text-light)",marginBottom:".32rem"}}>Description</div>
            <input type="text" placeholder="e.g. Biology essay — 2,000 words" value={f.title} onChange={e=>setF(p=>({...p,title:e.target.value}))} style={{width:"100%",padding:".6rem .8rem",border:"1.5px solid var(--border)",borderRadius:8,fontSize:".84rem",background:"var(--navy3)",color:"var(--text-light)",outline:"none"}}/>
          </div>
          <div style={{marginBottom:".9rem"}}>
            <div style={{fontSize:".77rem",fontWeight:600,color:"var(--text-light)",marginBottom:".32rem"}}>Notes (optional)</div>
            <input type="text" placeholder="Any extra details..." value={f.notes} onChange={e=>setF(p=>({...p,notes:e.target.value}))} style={{width:"100%",padding:".6rem .8rem",border:"1.5px solid var(--border)",borderRadius:8,fontSize:".84rem",background:"var(--navy3)",color:"var(--text-light)",outline:"none"}}/>
          </div>
          <div style={{display:"flex",gap:".6rem"}}>
            <button onClick={add} style={{background:"var(--teal)",color:"#fff",border:"none",padding:".58rem 1.2rem",borderRadius:8,fontSize:".84rem",fontWeight:600,cursor:"pointer"}}>Add to tracker</button>
            <button onClick={()=>setAdding(false)} style={{background:"none",border:"1px solid var(--border)",padding:".58rem .9rem",borderRadius:8,fontSize:".84rem",color:"var(--text-muted)",cursor:"pointer"}}>Cancel</button>
          </div>
        </div>
      ):(
        <button onClick={()=>setAdding(true)} style={{display:"flex",alignItems:"center",gap:".5rem",padding:".62rem 1rem",borderRadius:9,background:"rgba(29,158,117,.07)",border:"1.5px dashed rgba(29,158,117,.3)",color:"var(--teal2)",fontSize:".83rem",fontWeight:500,cursor:"pointer",width:"100%",justifyContent:"center"}}>
          <span style={{fontSize:"1rem",lineHeight:1}}>+</span> Add upcoming date
        </button>
      )}
    </div>
  );
}

// ─── EMAIL NOTIFICATION PANEL ─────────────────────────────────────────────────
function NotificationSettings({ email, onSave }) {
  const [notifEmail, setNotifEmail] = useState(email || "");
  const [prefs, setPrefs] = useState({ dailyCheckin:true, upcomingEvents:true, weeklyReview:true, mentorReminders:true });
  const [saved, setSaved] = useState(false);
  const toggle = k => setPrefs(p=>({...p,[k]:!p[k]}));
  const save = () => { if (!notifEmail.includes("@")) return; setSaved(true); onSave(notifEmail, prefs); setTimeout(()=>setSaved(false),2500); };

  return (
    <div className="slide-in">
      <div style={{background:"rgba(29,158,117,.06)",border:"1px solid rgba(29,158,117,.15)",borderRadius:12,padding:"1rem 1.2rem",marginBottom:"1.2rem"}}>
        <div style={{fontSize:".85rem",fontWeight:600,color:"var(--teal2)",marginBottom:".25rem"}}>Email notifications</div>
        <div style={{fontSize:".8rem",color:"var(--text-muted)",lineHeight:1.6}}>We'll send gentle reminders and your weekly review to your email. No spam — you control exactly what you receive.</div>
      </div>
      <div style={{marginBottom:"1.1rem"}}>
        <Label>Send notifications to</Label>
        <TInput type="email" placeholder="yourname@gmail.com" value={notifEmail} onChange={e=>setNotifEmail(e.target.value)}/>
      </div>
      <div style={{marginBottom:"1.25rem"}}>
        <Label>What would you like to receive?</Label>
        {[
          {k:"dailyCheckin",  label:"Daily mood check-in reminder",  desc:"A gentle morning nudge to check in (8:00 AM)"},
          {k:"upcomingEvents",label:"Upcoming event alerts",          desc:"24 hours before any tracked deadline or event"},
          {k:"weeklyReview",  label:"Weekly review summary",          desc:"Every Sunday evening — your week in review"},
          {k:"mentorReminders",label:"Mentor appointment reminders", desc:"1 hour before your booked mentor session"},
        ].map(({k,label,desc})=>(
          <div key={k} onClick={()=>toggle(k)} style={{display:"flex",alignItems:"flex-start",gap:".85rem",padding:".85rem 1rem",marginBottom:".45rem",background:"var(--navy3)",border:`1.5px solid ${prefs[k]?"var(--teal)":"var(--border)"}`,borderRadius:10,cursor:"pointer",transition:"all .15s"}}>
            <div style={{width:20,height:20,borderRadius:5,background:prefs[k]?"var(--teal)":"var(--cream2)",border:`1.5px solid ${prefs[k]?"var(--teal)":"var(--border)"}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .15s",marginTop:2}}>
              {prefs[k]&&<div style={{fontSize:".65rem",color:"#fff",fontWeight:700}}>✓</div>}
            </div>
            <div>
              <div style={{fontSize:".88rem",fontWeight:600,color:"var(--text-light)"}}>{label}</div>
              <div style={{fontSize:".78rem",color:"var(--text-muted)",marginTop:".15rem"}}>{desc}</div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={save} style={{width:"100%",padding:".75rem",borderRadius:10,border:"none",background:saved?"rgba(29,158,117,.2)":"var(--teal)",color:saved?"var(--teal-light)":"#fff",fontWeight:600,fontSize:".9rem",cursor:"pointer",transition:"all .2s"}}>
        {saved?"✓ Notification preferences saved!":"Save notification settings"}
      </button>
    </div>
  );
}

// ─── ROADMAP OUTPUT ───────────────────────────────────────────────────────────
function RoadmapOutput({ calendarEvents, connectedEmail }) {
  const [tab, setTab] = useState("calendar");
  const tabs = [["calendar","Schedule & free time"],["daily","Daily plan"],["weekly","Weekly plan"],["milestones","90-day goals"],["coping","Coping tools"],["resources","Resources"]];

  return (
    <div style={{background:"var(--navy3)",border:"1px solid var(--border)",borderRadius:16,overflow:"hidden"}}>
      <div style={{padding:"1.1rem 1.65rem",borderBottom:"1px solid var(--border)",background:"rgba(29,158,117,.06)",display:"flex",alignItems:"center",gap:".7rem",flexWrap:"wrap"}}>
        <span style={{fontSize:".8rem",color:"var(--text-muted)"}}>Roadmap for:</span>
        {["University student","Age 20","Motivation + sleep","Goal: feel like myself again"].map(t=>(
          <span key={t} style={{fontSize:".76rem",fontWeight:500,padding:".28rem .7rem",borderRadius:6,background:"rgba(29,158,117,.1)",color:"var(--teal2)",border:"1px solid rgba(29,158,117,.15)"}}>{t}</span>
        ))}
      </div>
      <div style={{display:"flex",borderBottom:"1px solid var(--border)",background:"var(--navy)",overflowX:"auto"}}>
        {tabs.map(([id,lbl])=>(
          <button key={id} onClick={()=>setTab(id)} style={{padding:".78rem 1.1rem",fontSize:".82rem",fontWeight:500,color:tab===id?"var(--teal)":"var(--text-muted)",cursor:"pointer",border:"none",borderBottom:`2px solid ${tab===id?"var(--teal)":"transparent"}`,background:"none",whiteSpace:"nowrap",transition:"color .2s"}}>{lbl}</button>
        ))}
      </div>
      <div style={{padding:"1.65rem"}}>

        {tab==="calendar"&&<FreeTimeSuggestions events={calendarEvents} connectedEmail={connectedEmail}/>}

        {tab==="daily"&&(
          <div>
            <div style={{fontSize:".84rem",color:"var(--text-muted)",marginBottom:"1.2rem",fontStyle:"italic"}}>A day structured around your sleep rhythm and mental wellbeing — not just productivity.</div>
            {DAILY_SCHEDULE.map((row,i)=>(
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:".9rem",padding:".82rem 0",borderBottom:i<DAILY_SCHEDULE.length-1?"1px solid rgba(255,255,255,.06)":"none"}}>
                <span style={{fontSize:".73rem",fontWeight:600,color:"var(--text-muted)",minWidth:62,paddingTop:3}}>{row.time}</span>
                <div style={{width:8,height:8,borderRadius:"50%",background:row.dot,flexShrink:0,marginTop:5}}/>
                <div>
                  <div style={{fontSize:".88rem",fontWeight:600,color:"var(--text-light)",marginBottom:".18rem"}}>{row.title}</div>
                  <div style={{fontSize:".8rem",color:"var(--text-muted)",lineHeight:1.65}}>{row.detail}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab==="weekly"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:5,marginBottom:"1.4rem"}}>
              {[["Mon",[["p","Focus"],["t","Gym"],["a","Plan"]]],["Tue",[["p","Study"],["t","Walk"],["a","Social"]]],["Wed",[["p","Focus"],["t","Gym"],["c","Check-in"]]],["Thu",[["p","Study"],["t","Walk"],["a","Social"]]],["Fri",[["p","Light"],["t","Gym"],["c","Reflect"]]],["Sat",[["a","Rest"],["t","Outdoors"],["a","Joy"]]],["Sun",[["c","Restore"],["a","Prep"],["p","Read"]]]].map(([day,pills])=>{
                const bg={p:"rgba(127,119,221,.15)",t:"rgba(29,158,117,.14)",a:"rgba(201,149,106,.15)",c:"rgba(192,96,74,.13)"};
                const col={p:"#534AB7",t:"var(--teal2)",a:"#8B6020",c:"var(--coral)"};
                return(
                  <div key={day} style={{background:"var(--navy)",borderRadius:10,padding:"8px 5px",textAlign:"center"}}>
                    <div style={{fontSize:".63rem",fontWeight:600,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:".05em",marginBottom:5}}>{day}</div>
                    {pills.map(([type,lbl],j)=>(<div key={j} style={{fontSize:".63rem",borderRadius:4,padding:"3px 4px",marginBottom:3,background:bg[type],color:col[type]}}>{lbl}</div>))}
                  </div>
                );
              })}
            </div>
            <div style={{background:"var(--teal-light)",border:"1px solid rgba(29,158,117,.2)",borderRadius:12,padding:"1.2rem 1.4rem"}}>
              <div style={{fontSize:".78rem",fontWeight:600,color:"var(--teal)",marginBottom:".7rem",textTransform:"uppercase",letterSpacing:".06em"}}>Weekly commitments</div>
              {["3× exercise minimum — any form counts","2+ meals shared with another person","Sunday review: 5 minutes, no phones","One work-free afternoon — protected","Mood check-in every morning, even briefly"].map((r,i)=>(
                <div key={i} style={{fontSize:".83rem",color:"var(--text-light)",padding:".28rem 0",lineHeight:1.5}}>→ {r}</div>
              ))}
            </div>
          </div>
        )}

        {tab==="milestones"&&(
          <div>
            {[{badge:"30 days",bg:"rgba(29,158,117,.1)",col:"var(--teal2)",title:"Lay the foundation",items:["Consistent wake time 5/7 days","Phone out of bedroom every night","One task completed before it becomes a crisis","Exercise 3× (any form — walks count)","Identified 2 habits that drain you"]},{badge:"60 days",bg:"rgba(127,119,221,.12)",col:"#534AB7",title:"Feel the shift",items:["Sleep feels more natural, less forced","Work no longer a constant emergency","Movement is a habit, not a chore","Had 2 honest conversations about feelings","Notice good moments — even small ones"]},{badge:"90 days",bg:"rgba(201,149,106,.14)",col:"#8B6020",title:"Feel like yourself again",items:["You have a structure you chose — not imposed","You know your warning signs and reset routine","Connected with at least one professional resource","You can describe what a good day feels like — and have them"]}].map((ms,i)=>(
              <div key={i} style={{border:"1px solid rgba(255,255,255,.08)",borderRadius:12,padding:"1.4rem",marginBottom:".9rem"}}>
                <span style={{display:"inline-block",fontSize:".7rem",fontWeight:600,borderRadius:5,padding:"3px 9px",marginBottom:".7rem",background:ms.bg,color:ms.col,textTransform:"uppercase",letterSpacing:".06em"}}>{ms.badge}</span>
                <div style={{fontFamily:"'DM Serif Display',serif",fontSize:".98rem",color:"var(--text-light)",marginBottom:".7rem"}}>{ms.title}</div>
                {ms.items.map((item,j)=>(<div key={j} style={{fontSize:".83rem",color:"var(--text-muted)",padding:".28rem 0",lineHeight:1.5}}>→ {item}</div>))}
              </div>
            ))}
          </div>
        )}

        {tab==="coping"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"1rem",marginBottom:"1.5rem"}}>
              {COPING_TOOLS.map((tool,i)=>(
                <div key={i} style={{background:"var(--navy)",border:"1px solid var(--border)",borderRadius:12,padding:"1.2rem"}}>
                  <span style={{fontSize:".68rem",fontWeight:600,background:"var(--teal-light)",color:"var(--teal2)",padding:"2px 8px",borderRadius:5,display:"inline-block",marginBottom:".55rem"}}>{tool.tag}</span>
                  <div style={{fontSize:".93rem",fontWeight:600,color:"var(--text-light)",marginBottom:".35rem",fontFamily:"'DM Serif Display',serif"}}>{tool.name}</div>
                  <div style={{fontSize:".81rem",color:"var(--text-muted)",lineHeight:1.65}}>{tool.desc}</div>
                </div>
              ))}
            </div>
            <div style={{background:"rgba(232,201,138,.08)",border:"1px solid rgba(232,201,138,.2)",borderRadius:12,padding:"1.2rem 1.4rem"}}>
              <div style={{fontFamily:"'DM Serif Display',serif",fontSize:".97rem",color:"var(--text-light)",marginBottom:".65rem",fontStyle:"italic"}}>Today's affirmation</div>
              <div style={{fontSize:"1.03rem",color:"var(--text-light)",lineHeight:1.75}}>"{AFFIRMATIONS[Math.floor(Date.now()/86400000)%AFFIRMATIONS.length]}"</div>
            </div>
          </div>
        )}

        {tab==="resources"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"1rem"}}>
              {[{type:"Academic support",name:"University counselling",desc:"Free, confidential, student-specific. Book via your student portal."},{type:"Sleep",name:"CBT-I sleep course",desc:"Free evidence-based sleep therapy via SilverCloud. 6 self-paced sessions."},{type:"Movement",name:"Campus running club",desc:"Accountability + social connection — both proven mood boosters."},{type:"AI support",name:"Woebot",desc:"AI-powered CBT exercises. Evidence-backed, not just meditation."},{type:"Community",name:"Student Minds",desc:"Peer support, resources, and local groups."},{type:"Crisis — always open",name:"Samaritans · 116 123",desc:"Free, 24/7, confidential. Call or email jo@samaritans.org any time."}].map((r,i)=>(
                <div key={i} style={{background:"var(--navy)",border:"1px solid var(--border)",borderRadius:12,padding:"1.2rem"}}>
                  <div style={{fontSize:".68rem",fontWeight:600,letterSpacing:".08em",textTransform:"uppercase",color:"var(--teal)",marginBottom:".35rem"}}>{r.type}</div>
                  <div style={{fontSize:".88rem",fontWeight:600,color:"var(--text-light)",marginBottom:".35rem"}}>{r.name}</div>
                  <div style={{fontSize:".8rem",color:"var(--text-muted)",lineHeight:1.65}}>{r.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [bookedMentor, setBookedMentor] = useState(null);
  const [showCoping, setShowCoping] = useState(false);
  const [connectedEmail, setConnectedEmail] = useState(null);
  const [calendarEvents, setCalendarEvents] = useState(LIVE_CALENDAR_EVENTS);
  const [showNotifSettings, setShowNotifSettings] = useState(false);

  const formRef = useRef(null);
  const roadmapRef = useRef(null);

  const [form, setForm] = useState({
    situation:"",age:"",location:"",
    struggles:[],severity:"",duration:"",
    wakeTime:"07:30",sleepTime:"23:00",
    exercise:"",diet:"",goal:"",support:"",safety:"",
  });

  useEffect(()=>{ injectCss(); },[]);

  const upd = (k,v) => setForm(p=>({...p,[k]:v}));
  const toggleStruggle = v => setForm(p=>({...p,struggles:p.struggles.includes(v)?p.struggles.filter(s=>s!==v):p.struggles.length<3?[...p.struggles,v]:p.struggles}));
  const scrollTo = ref => ref?.current?.scrollIntoView({behavior:"smooth",block:"start"});

  const handleCalendarConnect = (email) => {
    setConnectedEmail(email);
    // In production: OAuth → fetch events → update calendarEvents
    // For demo: use the live events already fetched
    setCalendarEvents(LIVE_CALENDAR_EVENTS);
  };

  const STEPS = [
    // Step 0 — Who are you?
    <div key={0} className="slide-in">
      <div style={{fontSize:".7rem",fontWeight:600,letterSpacing:".1em",textTransform:"uppercase",color:"var(--teal)",marginBottom:".4rem"}}>Section 1 of 4 · Who are you?</div>
      <h3 style={{fontSize:"1.2rem",fontFamily:"'DM Serif Display',serif",color:"var(--text-light)",marginBottom:"1.4rem",lineHeight:1.35}}>Let's start with a little context</h3>
      <div style={{marginBottom:"1.2rem"}}>
        <Label>What best describes your situation?</Label>
        {["High school student","University student","Working full-time","Working part-time","Gap year"].map(v=>(
          <Chip key={v} label={v} selected={form.situation===v} onClick={()=>upd("situation",form.situation===v?"":v)}/>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:".7rem",marginBottom:"1.2rem"}}>
        <div><Label>Your age</Label><TInput type="number" min={13} max={25} placeholder="13–25" value={form.age} onChange={e=>upd("age",e.target.value)}/></div>
        <div><Label>Where you are</Label><TInput type="text" placeholder="Country / city" value={form.location} onChange={e=>upd("location",e.target.value)}/></div>
      </div>

      {/* Calendar connect inside form */}
      <div style={{borderTop:"1px solid var(--border)",paddingTop:"1.2rem",marginTop:".5rem"}}>
        {!connectedEmail ? (
          <CalendarSignIn onConnect={handleCalendarConnect}/>
        ) : (
          <div style={{background:"rgba(29,158,117,.06)",border:"1px solid rgba(29,158,117,.2)",borderRadius:12,padding:".9rem 1.1rem",display:"flex",alignItems:"center",gap:".75rem"}}>
            <span style={{fontSize:"1.1rem"}}>📅</span>
            <div style={{flex:1}}>
              <div style={{fontSize:".85rem",fontWeight:600,color:"var(--teal2)"}}>Google Calendar connected</div>
              <div style={{fontSize:".78rem",color:"var(--text-muted)"}}>{connectedEmail} · {calendarEvents.length} event(s) synced</div>
            </div>
            <span style={{fontSize:".75rem",background:"var(--teal)",color:"#fff",padding:"3px 9px",borderRadius:6,fontWeight:600}}>✓ Live</span>
          </div>
        )}
      </div>
    </div>,

    // Step 1 — Struggles
    <div key={1} className="slide-in">
      <div style={{fontSize:".7rem",fontWeight:600,letterSpacing:".1em",textTransform:"uppercase",color:"var(--teal)",marginBottom:".4rem"}}>Section 2 of 4 · What's hard?</div>
      <h3 style={{fontSize:"1.2rem",fontFamily:"'DM Serif Display',serif",color:"var(--text-light)",marginBottom:".45rem",lineHeight:1.35}}>What feels most difficult right now?</h3>
      <p style={{fontSize:".8rem",color:"var(--text-muted)",marginBottom:"1.2rem"}}>Choose up to 3. Be honest — this shapes your whole roadmap.</p>
      <div style={{marginBottom:"1.2rem"}}>
        {["Can't get out of bed / no motivation","Struggling with assignments or deadlines","Anxiety / constant worry","Sleep problems","Not eating well","No exercise / feel sluggish","Feeling lonely or isolated","Conflict with family or friends","Financial stress","Feeling lost / no direction","Social media is hurting me","I don't enjoy anything anymore"].map(v=>(
          <Chip key={v} label={v} selected={form.struggles.includes(v)} onClick={()=>toggleStruggle(v)}/>
        ))}
      </div>
      <div style={{marginBottom:"1.2rem"}}>
        <Label>How much is this affecting your daily life?</Label>
        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
          {[...Array(10)].map((_,i)=>{const v=String(i+1);const sel=form.severity===v;return(
            <div key={v} onClick={()=>upd("severity",v)} style={{flex:"1 0 28px",padding:".43rem .2rem",border:`1.5px solid ${sel?"var(--teal)":"var(--border)"}`,borderRadius:8,fontSize:".78rem",fontWeight:500,textAlign:"center",cursor:"pointer",background:sel?"var(--teal)":"var(--navy3)",color:sel?"#fff":"var(--text-muted)",transition:"all .15s",minWidth:28}}>{v}</div>
          );})}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:".7rem",color:"var(--text-muted)",marginTop:".28rem",padding:"0 .2rem"}}><span>1 = barely noticeable</span><span>10 = overwhelming</span></div>
      </div>
      <div>
        <Label>How long has this been going on?</Label>
        {["A few days","A few weeks","1–3 months","More than 3 months"].map(v=>(
          <Chip key={v} label={v} selected={form.duration===v} onClick={()=>upd("duration",form.duration===v?"":v)}/>
        ))}
      </div>
    </div>,

    // Step 2 — Routine + Tracker
    <div key={2} className="slide-in">
      <div style={{fontSize:".7rem",fontWeight:600,letterSpacing:".1em",textTransform:"uppercase",color:"var(--teal)",marginBottom:".4rem"}}>Section 3 of 4 · Your routine</div>
      <h3 style={{fontSize:"1.2rem",fontFamily:"'DM Serif Display',serif",color:"var(--text-light)",marginBottom:"1.4rem",lineHeight:1.35}}>Walk us through your current days</h3>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:".7rem",marginBottom:"1.2rem"}}>
        <div><Label>Usual wake time</Label><TInput type="time" value={form.wakeTime} onChange={e=>upd("wakeTime",e.target.value)}/></div>
        <div><Label>Usual sleep time</Label><TInput type="time" value={form.sleepTime} onChange={e=>upd("sleepTime",e.target.value)}/></div>
      </div>
      <div style={{marginBottom:"1.2rem"}}>
        <Label>Exercise right now?</Label>
        {["Not really","Just walks","1–2× per week","3+ times a week"].map(v=><Chip key={v} label={v} selected={form.exercise===v} onClick={()=>upd("exercise",form.exercise===v?"":v)}/>)}
      </div>
      <div style={{marginBottom:"1.2rem"}}>
        <Label>How's your diet?</Label>
        {["I eat well","Pretty irregular","I skip meals often","Mostly junk food"].map(v=><Chip key={v} label={v} selected={form.diet===v} onClick={()=>upd("diet",form.diet===v?"":v)}/>)}
      </div>
      <div style={{borderTop:"1px solid var(--border)",paddingTop:"1.4rem"}}>
        <Tracker situation={form.situation||"Gap year"} calendarEvents={calendarEvents}/>
      </div>
    </div>,

    // Step 3 — Goals + Safety + Notifications
    <div key={3} className="slide-in">
      <div style={{fontSize:".7rem",fontWeight:600,letterSpacing:".1em",textTransform:"uppercase",color:"var(--teal)",marginBottom:".4rem"}}>Section 4 of 4 · Goals & support</div>
      <h3 style={{fontSize:"1.2rem",fontFamily:"'DM Serif Display',serif",color:"var(--text-light)",marginBottom:"1.4rem",lineHeight:1.35}}>What does "doing better" look like for you?</h3>
      <div style={{marginBottom:"1.2rem"}}>
        <Label sub="In your own words — there's no wrong answer">In 30 days, I want to feel...</Label>
        <textarea value={form.goal} onChange={e=>upd("goal",e.target.value)} rows={3} placeholder="e.g. I want to wake up without dreading the day. I want to feel present again." style={{width:"100%",padding:".72rem 1rem",border:"1.5px solid var(--border)",borderRadius:10,fontSize:".88rem",background:"var(--navy3)",color:"var(--text-light)",outline:"none",resize:"none",height:88,lineHeight:1.6}}/>
      </div>
      <div style={{marginBottom:"1.2rem"}}>
        <Label>Do you have people you can talk to?</Label>
        {["Yes, a few people","Sort of — it's complicated","Mostly no"].map(v=><Chip key={v} label={v} selected={form.support===v} onClick={()=>upd("support",form.support===v?"":v)}/>)}
      </div>

      {/* Notifications */}
      <div style={{borderTop:"1px solid var(--border)",paddingTop:"1.2rem",marginBottom:"1.2rem"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:".7rem"}}>
          <Label>Email notifications</Label>
          <button onClick={()=>setShowNotifSettings(p=>!p)} style={{fontSize:".78rem",color:"var(--teal)",background:"none",border:"none",cursor:"pointer",textDecoration:"underline",textDecorationStyle:"dotted",textUnderlineOffset:2}}>
            {showNotifSettings?"Hide settings":"Set up →"}
          </button>
        </div>
        {!showNotifSettings ? (
          <div style={{background:"var(--navy2)",borderRadius:10,padding:".75rem 1rem",fontSize:".82rem",color:"var(--text-muted)"}}>
            Get reminders, weekly reviews, and event alerts sent to your email. Click "Set up" to configure.
          </div>
        ) : (
          <NotificationSettings email={form.location.includes("@")?form.location:""} onSave={(email,prefs)=>console.log("Notif saved:",email,prefs)}/>
        )}
      </div>

      {/* Safety */}
      <div style={{borderTop:"1px solid var(--border)",paddingTop:"1.2rem"}}>
        <div style={{display:"flex",alignItems:"center",gap:".45rem",marginBottom:".6rem"}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:"var(--coral)",flexShrink:0}}/>
          <span style={{fontSize:".86rem",fontWeight:600,color:"var(--coral)"}}>One more — please answer honestly</span>
        </div>
        <Label>Is there anything going on that feels urgent or unsafe?</Label>
        <div style={{marginBottom:"1rem"}}>
          {["No, I'm okay","Yes — things feel unsafe"].map(v=>(
            <Chip key={v} label={v} selected={form.safety===v} onClick={()=>upd("safety",form.safety===v?"":v)} danger={v.includes("unsafe")}/>
          ))}
        </div>
        {form.safety==="Yes — things feel unsafe"&&(
          <MentorSection struggles={form.struggles} onBook={setBookedMentor} bookedId={bookedMentor}/>
        )}
      </div>
    </div>,
  ];

  return (
    <div style={{minHeight:"100vh",background:"var(--navy)"}}>

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"1.25rem 2.5rem",background:"rgba(13,27,42,0.92)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
        <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.4rem",color:"var(--warm)",letterSpacing:"-.02em",cursor:"pointer"}} onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>Sanctuary</div>
        <div style={{display:"flex",gap:"2rem",alignItems:"center"}}>
          {[["The crisis","#crisis"],["How it works","#how"],["Research","#market"]].map(([l,h])=>(
            <a key={h} href={h} style={{fontSize:".85rem",fontWeight:500,color:"var(--text-muted)",letterSpacing:".02em",transition:"color .2s"}}
              onMouseEnter={e=>e.target.style.color="var(--text-light)"}
              onMouseLeave={e=>e.target.style.color="var(--text-muted)"}
            >{l}</a>
          ))}
          {connectedEmail && (
            <div style={{fontSize:".75rem",background:"rgba(29,158,117,.12)",color:"var(--teal)",padding:".32rem .8rem",borderRadius:6,border:"1px solid rgba(29,158,117,.25)",fontWeight:600,letterSpacing:".02em"}}>📅 {connectedEmail.split("@")[0]}</div>
          )}
          <button onClick={()=>scrollTo(formRef)} style={{background:"var(--teal)",color:"#fff",padding:".55rem 1.25rem",borderRadius:8,fontSize:".85rem",fontWeight:600,cursor:"pointer",border:"none",letterSpacing:".01em",transition:"background .2s"}}
            onMouseEnter={e=>e.target.style.background="var(--teal2)"}
            onMouseLeave={e=>e.target.style.background="var(--teal)"}
          >Build my roadmap</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",textAlign:"center",padding:"8rem 2rem 5rem",background:"var(--navy)",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 70% 50% at 50% 40%,rgba(29,158,117,.07) 0%,transparent 70%)"}}/>
        <div style={{position:"relative",zIndex:1,maxWidth:780}}>
          <div className="fade-up" style={{fontSize:".76rem",fontWeight:600,letterSpacing:".1em",textTransform:"uppercase",color:"var(--teal)",marginBottom:"1.4rem"}}>Mental health support for ages 13–25</div>
          <h1 className="fade-up" style={{fontSize:"clamp(2.4rem,6vw,4.6rem)",lineHeight:1.08,letterSpacing:"-.03em",color:"var(--text-light)",marginBottom:"1.4rem",animationDelay:".1s"}}>
            You deserve a plan<br/><em style={{color:"var(--warm)",fontStyle:"italic"}}>built around you</em>
          </h1>
          <p className="fade-up" style={{fontSize:"1.05rem",lineHeight:1.75,color:"var(--text-muted)",maxWidth:500,margin:"0 auto 2.4rem",animationDelay:".2s"}}>
            Answer a few honest questions. We'll build your personal daily schedule, weekly plan, and 90-day roadmap — grounded in what actually works.
          </p>
          <div className="fade-up" style={{display:"flex",gap:"1rem",justifyContent:"center",flexWrap:"wrap",animationDelay:".25s"}}>
            <button onClick={()=>scrollTo(formRef)} style={{background:"var(--teal)",color:"#fff",border:"none",padding:".85rem 1.9rem",borderRadius:10,fontSize:".97rem",fontWeight:600,cursor:"pointer"}}>Start my roadmap →</button>
            <button onClick={()=>scrollTo(roadmapRef)} style={{background:"transparent",color:"var(--text-light)",border:"1.5px solid var(--border)",padding:".85rem 1.9rem",borderRadius:10,fontSize:".97rem",fontWeight:500,cursor:"pointer"}}>See a sample plan</button>
          </div>
          <div className="fade-up" style={{marginTop:"2rem",animationDelay:".3s"}}>
            <button onClick={()=>setShowCoping(p=>!p)} style={{background:"none",border:"none",fontSize:".83rem",color:"var(--text-muted)",cursor:"pointer",textDecoration:"underline",textDecorationStyle:"dotted",textUnderlineOffset:3}}>
              Feeling overwhelmed right now? — Coping tools →
            </button>
            {showCoping&&(
              <div className="fade-up" style={{background:"var(--navy3)",border:"1px solid var(--border)",borderRadius:14,padding:"1.4rem",marginTop:".9rem",textAlign:"left",maxWidth:480,margin:".9rem auto 0"}}>
                <div style={{fontFamily:"'DM Serif Display',serif",fontSize:".97rem",color:"var(--text-light)",marginBottom:".9rem"}}>Quick coping tools</div>
                {COPING_TOOLS.slice(0,3).map((t,i)=>(
                  <div key={i} style={{padding:".58rem 0",borderBottom:i<2?"1px solid var(--border)":"none"}}>
                    <div style={{fontSize:".86rem",fontWeight:600,color:"var(--text-light)",marginBottom:".18rem"}}>{t.name}</div>
                    <div style={{fontSize:".8rem",color:"var(--text-muted)",lineHeight:1.6}}>{t.desc}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="fade-up" style={{display:"flex",gap:"2.2rem",justifyContent:"center",flexWrap:"wrap",marginTop:"3.5rem",paddingTop:"2.2rem",borderTop:"1px solid var(--border)",animationDelay:".35s"}}>
            {[["279M","young people globally with a mental disorder"],["91%","with depression cannot access care"],["1 in 7","teens worldwide affected"],["$1T","lost to the global economy yearly"]].map(([n,l])=>(
              <div key={n} style={{textAlign:"center"}}>
                <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.9rem",color:"var(--warm)"}}>{n}</div>
                <div style={{fontSize:".76rem",color:"var(--text-muted)",marginTop:".22rem",maxWidth:105,lineHeight:1.4}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DIVIDER — separates hero from crisis */}
      <div style={{height:4,background:"linear-gradient(90deg,transparent,var(--teal),transparent)"}}/>

      {/* CRISIS */}
      <div id="crisis" style={{background:"var(--navy2)"}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"6rem 2.5rem"}}>
          <SectionTag light>The global crisis</SectionTag>
          <h2 style={{fontSize:"clamp(1.8rem,4vw,2.7rem)",lineHeight:1.15,marginBottom:"1.2rem",letterSpacing:"-.02em",color:"var(--text-light)"}}>This isn't just a feeling.<br/>The numbers prove it.</h2>
          <p style={{fontSize:".98rem",lineHeight:1.8,color:"rgba(240,235,224,.55)",maxWidth:580,marginBottom:"2.8rem"}}>Youth mental health has declined across every major region for over a decade. The crisis predates COVID — it started around 2013 as smartphones became universal.</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(185px,1fr))",gap:"1rem",marginBottom:"3.5rem"}}>
            {[{n:"279M",d:"Young people 10–24 globally with a mental disorder",s:"Global Burden of Disease 2021"},{n:"1 in 7",d:"Adolescents 10–19 worldwide experience a mental health condition",s:"WHO 2025"},{n:"91%",d:"People with depression globally who cannot access any care",s:"WHO 2025"},{n:"50%",d:"Of lifetime mental illnesses begin before age 14 — most undetected",s:"NAMI"},{n:"5.5M",d:"Self-harm cases ages 10–24 in 2021, projected to double by 2040",s:"The Lancet"},{n:"$1T",d:"Lost to the global economy each year from depression and anxiety",s:"WHO"}].map((c,i)=>(
              <div key={i} style={{background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.08)",borderRadius:14,padding:"1.4rem"}}>
                <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"2.1rem",color:"var(--warm)",marginBottom:".35rem",lineHeight:1}}>{c.n}</div>
                <div style={{fontSize:".83rem",color:"rgba(240,235,224,.6)",lineHeight:1.6,marginBottom:".45rem"}}>{c.d}</div>
                <div style={{fontSize:".68rem",color:"rgba(240,235,224,.28)",letterSpacing:".04em"}}>{c.s}</div>
              </div>
            ))}
          </div>
          <SectionTag light>By region</SectionTag>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:"1rem"}}>
            {[{f:"🇬🇧",n:"United Kingdom",s:"1 in 4 young people (16–24) have a common mental disorder — up from 18.9% in 2014 to 25.8% in 2025 (NHS)"},{f:"🇮🇳",n:"India",s:"Youth 15–24 represent 35% of all suicide fatalities. Young women: 80 per 100,000"},{f:"🌎",n:"Latin America",s:"Fastest-growing region for youth anxiety and depression. Declining wellbeing in all 18 countries studied"},{f:"🇺🇸",n:"United States",s:"Sadness/hopelessness: 28% (2011) → 42% (2021). Severe depression in youth rose 145%"},{f:"🇳🇱",n:"Netherlands",s:"53% of young adults (18–25) reported psychological symptoms in 2023 — among Europe's highest"},{f:"🌏",n:"East Asia",s:"Sharp rises in ADHD, conduct disorder, eating disorders among under-24s"}].map((r,i)=>(
              <div key={i} style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.07)",borderRadius:12,padding:"1.05rem 1.35rem",display:"flex",alignItems:"flex-start",gap:".85rem"}}>
                <div style={{width:32,height:32,borderRadius:8,background:"rgba(255,255,255,.05)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.15rem",flexShrink:0}}>{r.f}</div>
                <div>
                  <div style={{fontSize:".86rem",fontWeight:600,color:"var(--cream)",marginBottom:".22rem"}}>{r.n}</div>
                  <div style={{fontSize:".78rem",color:"rgba(240,235,224,.5)",lineHeight:1.55}}>{r.s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div id="how" style={{maxWidth:1200,margin:"0 auto",padding:"6rem 2.5rem"}}>
        <SectionTag>How it works</SectionTag>
        <h2 style={{fontSize:"clamp(1.8rem,4vw,2.7rem)",lineHeight:1.15,marginBottom:"1.2rem",letterSpacing:"-.02em"}}>From struggling to structured</h2>
        <p style={{fontSize:".98rem",lineHeight:1.8,color:"var(--text-muted)",maxWidth:560,marginBottom:"2.8rem"}}>Most apps give everyone the same content. Sanctuary builds a plan around your specific life — your schedule, your struggles, your goals.</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:"1.4rem"}}>
          {[{n:"01",t:"Mood check-in",d:"Start every visit by telling us how you're feeling. We track patterns over time and surface them when it matters."},
            {n:"02",t:"Sign in with Google Calendar",d:"Each user connects their own Google Calendar. We read your schedule to understand your day — privately."},
            {n:"03",t:"Smart intake form",d:"4 sections, under 10 minutes. Your situation, struggles, routine, and goals shape everything that follows."},
            {n:"04",t:"Calendar-aware roadmap",d:"We analyze your events. Busy day? We suggest rest and recovery. Light day? We suggest productive use of your time."},
            {n:"05",t:"Mentor + email support",d:"Book a free session with a mentor. Set up email notifications for reminders, weekly reviews, and event alerts."},
            {n:"06",t:"Weekly check-ins",d:"Every week, the plan adapts to where you are. This is not a static template — it evolves with you."},
          ].map((s,i)=>(
            <div key={i} style={{background:"var(--navy3)",border:"1px solid var(--border)",borderRadius:16,padding:"1.85rem"}}>
              <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"3.2rem",color:"rgba(29,158,117,.12)",lineHeight:1,marginBottom:".9rem",userSelect:"none"}}>{s.n}</div>
              <div style={{fontSize:".97rem",fontWeight:600,color:"var(--text-light)",marginBottom:".5rem"}}>{s.t}</div>
              <div style={{fontSize:".84rem",color:"var(--text-muted)",lineHeight:1.7}}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FORM */}
      <div ref={formRef} id="form" style={{background:"var(--navy2)"}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"6rem 2.5rem"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1.2fr",gap:"4.5rem",alignItems:"start"}}>
            <div>
              <SectionTag>Build your roadmap</SectionTag>
              <h2 style={{fontSize:"clamp(1.7rem,3vw,2.3rem)",lineHeight:1.15,marginBottom:"1.2rem",letterSpacing:"-.02em"}}>Let's understand<br/>your world first</h2>
              <p style={{fontSize:".97rem",lineHeight:1.8,color:"var(--text-muted)",marginBottom:"1.8rem"}}>Four short sections. The more specific you are, the more your roadmap will actually fit your life.</p>
              {[["Private","Your calendar and answers stay yours"],["Multi-user","Your friend connects their own calendar — schedules stay separate"],["Calendar-aware","We read your events to suggest the right support for your day"],["Notifications","Email reminders, weekly reviews, and event alerts"]].map(([t,d])=>(
                <div key={t} style={{display:"flex",alignItems:"flex-start",gap:".7rem",marginBottom:".9rem"}}>
                  <div style={{width:30,height:30,background:"rgba(29,158,117,.1)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",color:"var(--teal2)",fontWeight:700,fontSize:".82rem",flexShrink:0}}>✓</div>
                  <div>
                    <div style={{fontSize:".86rem",fontWeight:600,color:"var(--text-light)"}}>{t}</div>
                    <div style={{fontSize:".78rem",color:"var(--text-muted)"}}>{d}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{background:"var(--navy3)",borderRadius:16,padding:"2.3rem",boxShadow:"0 4px 32px rgba(26,42,56,.08)"}}>
              {!submitted?(
                <>
                  <div style={{display:"flex",gap:5,marginBottom:"1.8rem"}}>
                    {[0,1,2,3].map(i=>(<div key={i} style={{height:4,flex:1,borderRadius:2,background:i<=step?"var(--teal)":"var(--cream2)",transition:"background .3s"}}/>))}
                  </div>
                  {STEPS[step]}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"1.8rem",paddingTop:"1.4rem",borderTop:"1px solid var(--border)"}}>
                    {step>0?<button onClick={()=>setStep(s=>s-1)} style={{background:"none",border:"none",fontSize:".86rem",color:"var(--text-muted)",cursor:"pointer"}}>← Back</button>:<span/>}
                    <span style={{fontSize:".8rem",color:"var(--text-muted)"}}>{step+1} of 4</span>
                    {step<3
                      ?<button onClick={()=>setStep(s=>s+1)} style={{background:"var(--teal)",color:"#fff",border:"none",padding:".68rem 1.65rem",borderRadius:10,fontSize:".88rem",fontWeight:600,cursor:"pointer"}}>Continue →</button>
                      :<button onClick={()=>{setSubmitted(true);setTimeout(()=>scrollTo(roadmapRef),500);}} style={{background:"var(--teal)",color:"#fff",border:"none",padding:".68rem 1.65rem",borderRadius:10,fontSize:".88rem",fontWeight:600,cursor:"pointer"}}>Build my roadmap →</button>
                    }
                  </div>
                </>
              ):(
                <div style={{textAlign:"center",padding:"1.8rem",animation:"fadeUp .5s ease both"}}>
                  <div style={{fontSize:"2.2rem",marginBottom:".9rem",display:"inline-block",animation:"breathe 3s ease infinite"}}>✦</div>
                  <h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.45rem",color:"var(--text-light)",marginBottom:".7rem"}}>Your roadmap is ready.</h3>
                  <p style={{fontSize:".88rem",color:"var(--text-muted)",lineHeight:1.75,marginBottom:"1.4rem"}}>We've built a personalized daily schedule, weekly plan, and 90-day milestone map. Scroll down to see it.</p>
                  <button onClick={()=>scrollTo(roadmapRef)} style={{background:"var(--teal)",color:"#fff",border:"none",padding:".82rem 1.9rem",borderRadius:10,fontSize:".92rem",fontWeight:600,cursor:"pointer"}}>View my roadmap ↓</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ROADMAP OUTPUT */}
      <div ref={roadmapRef} id="roadmap" style={{maxWidth:1200,margin:"0 auto",padding:"6rem 2.5rem"}}>
        <SectionTag>Your roadmap</SectionTag>
        <h2 style={{fontSize:"clamp(1.8rem,4vw,2.7rem)",lineHeight:1.15,marginBottom:"1.2rem",letterSpacing:"-.02em"}}>Your plan — built around your calendar</h2>
        <p style={{fontSize:".98rem",lineHeight:1.8,color:"var(--text-muted)",maxWidth:560,marginBottom:"2.8rem"}}>
          We read your calendar and analyzed your day. {LIVE_CALENDAR_EVENTS.length > 0 ? `Found ${LIVE_CALENDAR_EVENTS.length} event(s) including your Bio 121 class and CIS exam. Your free time suggestions are based on your actual schedule.` : "Connect your calendar in the form above to get personalized free time suggestions."}
        </p>
        <RoadmapOutput calendarEvents={LIVE_CALENDAR_EVENTS} connectedEmail={connectedEmail || "intern.shrijan.paudel@gmail.com"}/>
      </div>

      {/* FOOTER */}
      <footer style={{background:"var(--text-dark)",borderTop:"1px solid rgba(255,255,255,.05)",padding:"3rem 2.5rem",textAlign:"center"}}>
        <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.45rem",color:"var(--cream)",marginBottom:".7rem"}}>Sanctuary</div>
        <p style={{fontSize:".86rem",color:"rgba(240,235,224,.4)",marginBottom:"1.8rem"}}>Personalized mental health roadmaps for ages 13–25 · Global</p>
        <div style={{background:"rgba(192,96,74,.1)",border:"1px solid rgba(192,96,74,.2)",borderRadius:12,display:"inline-block",padding:".7rem 1.4rem",fontSize:".83rem",color:"#F0997B",marginBottom:"1rem"}}>
          In crisis right now: US <strong>988</strong> · UK <strong>116 123</strong> · International: <strong>findahelpline.com</strong>
        </div>
        <p style={{fontSize:".7rem",color:"rgba(240,235,224,.22)",maxWidth:580,margin:"0 auto",lineHeight:1.7}}>
          Sanctuary provides structured guidance and peer resources — not clinical diagnosis or treatment. If you are experiencing a mental health emergency, please contact emergency services or a crisis helpline immediately.
        </p>
      </footer>

    </div>
  );
}
