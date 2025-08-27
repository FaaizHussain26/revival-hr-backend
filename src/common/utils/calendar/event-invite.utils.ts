export interface CalendarInviteOptions {
  uid?: string;
  dtstamp?: string;
  start: string;
  end: string;
  summary: string;
  description?: string;
  location?: string;
  organizer: { name: string; email: string };
  attendees?: Array<{ name: string; email: string }>;
  method?: "REQUEST" | "PUBLISH" | "CANCEL";
  sequence?: 0 | 1;
}

export function generateICS(options: CalendarInviteOptions): string {
  const {
    uid = `${Date.now()}@revivalhr.com`,
    dtstamp,
    start,
    end,
    summary,
    description = "",
    location = "",
    organizer,
    attendees = [],
    method ,
    sequence,
    } = options;

  const attendeeLines = attendees 
    .map(
      (attendee) =>
        `ATTENDEE;CN=${attendee.name};RSVP=TRUE:mailto:${attendee.email}`
    )
    .join("\n");

  return `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//RevivalHR//EN
METHOD:${method}
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${dtstamp}
DTSTART:${start}
DTEND:${end}
SUMMARY:${summary}
DESCRIPTION:${description}
LOCATION:${location}
ORGANIZER;CN=${organizer.name}:mailto:${organizer.email}
${attendeeLines}
SEQUENCE:${sequence}
STATUS:CONFIRMED
TRANSP:OPAQUE
END:VEVENT
END:VCALENDAR
  `.trim();
}
