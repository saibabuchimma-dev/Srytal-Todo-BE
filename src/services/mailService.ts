import { sendMail } from "@/utils/mailer";

export class MailService {
  async sendWelcomeEmployeeEmail(email: string, subject: string, html: string) {
    try {
      await sendMail(email, subject, html);
      console.log(`✅ Welcome email sent to ${email}`);
    } catch (error) {
      console.error("Email sending failed:", error);
    }
  }

  async send(email: string, subject: string, html: string) {
    try {
      await sendMail(email, subject, html);
      console.log(`✅ Email sent to ${email}`);
    } catch (error) {
      console.error("Email sending failed:", error);
    }
  }
}
