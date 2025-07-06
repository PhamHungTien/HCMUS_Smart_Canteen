import nodemailer from 'nodemailer';
import { EMAIL_USER, EMAIL_PASS } from '../config.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

export async function sendMail(to, subject, text, html = '') {
  if (!EMAIL_USER || !EMAIL_PASS) return;
  try {
    await transporter.sendMail({ from: EMAIL_USER, to, subject, text, html });
  } catch (err) {
    console.error('Error sending mail', err);
  }
}
