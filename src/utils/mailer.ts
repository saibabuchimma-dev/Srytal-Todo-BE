import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendMail(to: string, subject: string, html: string) {
  return transporter.sendMail({
    from: `"SRYTAL" <${process.env.MAIL_FROM}>`,
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
