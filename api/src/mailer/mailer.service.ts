import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';
@Injectable()
export class MailerService {
  private transporter = createTransport({
    host: 'smtp.gmail',
    port: 465,
    service: 'gmail',
    auth: {
      user: process.env.MAIL_ADDR,
      pass: process.env.MAIL_PASS,
    },
  });

  async sendMail(mail: MailOptions): Promise<{ status: number; message: any }> {
    try {
      const mailResponse = await this.transporter.sendMail(mail);
      return { status: 1, message: mailResponse };
    } catch (err) {
      console.log(`Error Sending Email:${new Error(err)}`);
      return { status: 0, message: 'unable to send email' };
    }
  }
}
