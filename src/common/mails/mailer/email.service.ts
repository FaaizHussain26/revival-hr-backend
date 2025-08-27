import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { Email } from "../email";
import { on } from "events";
import { CreateInterviewDto } from "src/interviews/dto/create-interview.dto";
import { start } from "repl";
import { generateICS } from "src/common/utils/calendar/event-invite.utils";

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendDynamicEmail(email: Email) {
    try {
      if (!email.toEmail) {
        throw new Error("No recipient email provided");
      }

      await this.mailerService.sendMail({
        to: email.toEmail,
        subject: email.subject,
        html: email.data,
        ...(email.alternatives && { alternatives: email.alternatives }),
      });
      console.log("Email sent successfully");
    } catch (err) {
      console.error("Error sending email:", err);
    }
  }

  @OnEvent("forgot.password")
  async handleForgotPasswordEvent(record: any) {
    await this.sendDynamicEmail({
      subject: "Reset Password Link : Forgot Password",
      toEmail: record.email,
      data: `<b>Dear ${record.email}</b> <br/> <p>Your Reset password link is <b> ${record.link} </b> you can now reset your password</p>`,
    });
  }

  @OnEvent("interview.scheduled")
  async handleInterviewScheduledEvent(
    record: any,
    toEmail: string[],
    subject: string,
    body: string
  ) {
    const emailsender = await this.sendDynamicEmail({
      subject: subject,
      toEmail: [...toEmail],
      data: body,
      alternatives: [
        {
          contentType: `text/calendar; charset="utf-8"; method=${record.method}`,
          content: generateICS({
            uid: record.uId,
            dtstamp: this.formatDate(new Date()),
            start: this.formatDate(new Date(record.scheduledAt)),
            end: this.formatDate(
              new Date(
                new Date(record.scheduledAt).getTime() +
                  (record.duration || 60) * 60000
              )
            ),
            summary: subject,
            description: record.description,
            location: record.location,
            organizer: {
              name: "HR Team",
              email: record.fromEmail,
            },
            attendees: [
              { name: record.candidateName, email: record.candidateEmail },
              ...record.interviewer.map((email: string) => ({
                name: "Interviewer",
                email,
              })),
            ],
            method: record.method,
            sequence: record.sequence,
          }),
        },
      ],
    });

    console.log(
      generateICS({
        uid: record.uId,
        dtstamp: this.formatDate(new Date()),
        start: this.formatDate(new Date(record.scheduledAt)),
        end: this.formatDate(
          new Date(
            new Date(record.scheduledAt).getTime() +
              (record.duration || 60) * 60000
          )
        ),
        summary: subject,
        description: record.description,
        location: record.location,
        organizer: {
          name: "HR Team",
          email: record.fromEmail,
        },
        attendees: [
          { name: record.candidateName, email: record.candidateEmail },
          ...record.interviewer.map((email: string) => ({
            name: "Interviewer",
            email,
          })),
        ],
        method: record.method,
      })
    );
    console.log("Email sent to Candidate and Interviewer:", emailsender);
  }

  formatDate(date: Date | string): string {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new Error(`Invalid date provided to formatDate: ${date}`);
    }
    return parsedDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  }
}
