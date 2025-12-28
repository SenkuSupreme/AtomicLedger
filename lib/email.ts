
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true', 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async ({ to, subject, html }: { to: string, subject: string, html: string }) => {
  if (!process.env.SMTP_HOST) {
    console.warn('SMTP_HOST not configured. Email not sent:', { to, subject });
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || '"ApexLedger" <noreply@apexledger.com>',
    to,
    subject,
    html,
  });
};
