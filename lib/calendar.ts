export interface CalendarEvent {
  summary: string;
  start: string;
  end: string;
}

const CALENDAR_API =
  "https://www.googleapis.com/calendar/v3/calendars/primary/events";

/**
 * Fetch events from the user's primary Google Calendar
 * for the next 24 hours. Returns a simplified array; on
 * any auth or network error it returns [] and logs the issue.
 */
export async function getCalendarEvents(
  accessToken: string,
): Promise<CalendarEvent[]> {
  try {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const params = new URLSearchParams({
      timeMin: now.toISOString(),
      timeMax: tomorrow.toISOString(),
      singleEvents: "true",
      orderBy: "startTime",
      maxResults: "50",
    });

    const res = await fetch(`${CALENDAR_API}?${params}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      console.error(
        `Google Calendar API error: ${res.status} ${res.statusText}`,
      );
      return [];
    }

    const data = await res.json();

    return (data.items ?? []).map(
      (item: {
        summary?: string;
        start?: { dateTime?: string; date?: string };
        end?: { dateTime?: string; date?: string };
      }) => ({
        summary: item.summary ?? "(No title)",
        start: item.start?.dateTime ?? item.start?.date ?? "",
        end: item.end?.dateTime ?? item.end?.date ?? "",
      }),
    );
  } catch (err) {
    console.error("Failed to fetch calendar events:", err);
    return [];
  }
}
