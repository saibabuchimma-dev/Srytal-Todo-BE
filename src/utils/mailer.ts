import nodemailer from "nodemailer";
import { env } from "@/config/env";

export const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export async function sendMail(to: string, subject: string, html: string) {
  return transporter.sendMail({
    from: env.MAIL_FROM,
    to,
    subject,
    html,
  });
}

export async function verifyMailer() {
  try {
    await transporter.verify();

    console.log("✅ Gmail SMTP Connected Successfully");
  } catch (error) {
    console.error("❌ Gmail SMTP Connection Failed");
    console.error(error);
  }
}
