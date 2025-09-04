export function scheduledInterviewEmailTemplate(
  candidate_name: string,
  location: string,
  scheduledAt: Date
) {
  const subject = `Interview Invitation`;
  const bodyForCandidate = `<b>Dear ${candidate_name}</b><br/><p>Your interview has been scheduled. Please review the details below and ensure you are prepared:</p>
    <ul>
        <li><strong>Date</strong> ${new Date(scheduledAt).toLocaleDateString()}</li>
        <li><strong>Time:</strong> ${new Date(scheduledAt).toLocaleTimeString()}</li>
        <li><strong>Location:</strong> ${location}</li>
    </ul>
      <p>This is an automated message—please do not reply.</p>
    <p>Best regards,<br>
    [HR Team / Revival]</p>`;

  const bodyForInterviewer = `<b>Dear Interviewer</b><br/><p>The interview with ${candidate_name} has been scheduled. Please review the details shared in your calendar.</p>`;

  return { subject, bodyForCandidate, bodyForInterviewer };
}

export function rescheduledInterviewEmailTemplate(
  candidate_name: string,
  location: string,
  scheduledAt: Date
) {
  const subject = `Interview Rescheduled`;
  const bodyForCandidate = `
  <b>Dear ${candidate_name}</b><br/>
  <p>Your interview has been <strong>rescheduled</strong>. Please find the updated details below:</p>
  <ul>
    <li><strong>New Date:</strong> ${new Date(scheduledAt).toLocaleDateString()}</li>
    <li><strong>New Time:</strong> ${new Date(scheduledAt).toLocaleTimeString()}</li>
    <li><strong>Location:</strong> ${location}</li>
  </ul>
  <p>Please make note of the changes and ensure your availability accordingly.</p>
  <p>This is an automated message—please do not reply.</p>
  <p>Best regards,<br>[HR Team / Revival]</p>
`;
  const bodyForInterviewer = `
  <b>Dear Interviewer</b><br/>
  <p>The interview with <strong>${candidate_name}</strong> has been <strong>rescheduled</strong>. Please check your calendar for the updated details.</p>
`;
  return { subject: subject, bodyForCandidate, bodyForInterviewer };
}

export function canceledInterviewEmailTemplate(candidate_name: string) {
  const subject = `Interview Canceled`;

  const bodyForCandidate = `
  <b>Dear ${candidate_name}</b><br/>
  <p>We regret to inform you that your interview has been <strong>canceled</strong>.</p>
  <p>If needed, we will reach out to you with further updates or to reschedule.</p>
  <p>We appreciate your understanding.</p>
  <p>This is an automated message—please do not reply.</p>
  <p>Best regards,<br/>[HR Team / Revival]</p>
  `;

  const bodyForInterviewer = `
  <b>Dear Interviewer</b><br/>
  <p>The interview with <strong>${candidate_name}</strong>, has been <strong>canceled</strong>`;
  return { subject, bodyForCandidate, bodyForInterviewer };
}
