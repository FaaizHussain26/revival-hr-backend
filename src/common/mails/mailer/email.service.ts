import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

interface Email {
  subject: string;
  toEmail: string;
  data: string;
}
@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendDynamicEmail(email: Email) {
    try {
      if (!email.toEmail) {
        throw new Error('No recipient email provided');
      }

      await this.mailerService.sendMail({
        to: email.toEmail,
        subject: email.subject,
        html: email.data,
      });
      console.log('Email sent successfully');
    } catch (err) {
      console.error('Error sending email:', err);
    }
  }
  @OnEvent('forgot.password')
  async handleForgotPasswordEvent(record: any) {
    await this.sendDynamicEmail({
      subject: 'Reset Password Link : Forgot Password',
      toEmail: record.email,
      data: `<b>Dear ${record.email}</b> <br/> <p>Your Reset password link is <b> ${record.link} </b> you can now reset your password</p>`,
    });
  }
}
