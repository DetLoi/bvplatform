import nodemailer from 'nodemailer';

function createGmailTransport() {
  const user = process.env.GMAIL_USER || process.env.EMAIL_USER;
  const pass = process.env.GMAIL_PASS || process.env.EMAIL_PASS;
  if (!user || !pass) {
    console.warn('Gmail SMTP credentials not provided. Emails will be logged to console.');
    return null;
  }
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: { user, pass },
  });
}

function getTransport() {
  const provider = (process.env.EMAIL_PROVIDER || 'gmail').toLowerCase();
  switch (provider) {
    case 'gmail':
    default:
      return createGmailTransport();
  }
}

export async function sendVerificationEmail(to, code) {
  const from = process.env.MAIL_FROM || process.env.GMAIL_USER || 'no-reply@localhost';
  const transport = getTransport();

  const subject = 'Your Breakverse verification code';
  const text = `Your verification code is ${code}. It expires in 10 minutes.`;
  const html = `
    <div style="font-family: Arial, sans-serif;">
      <h2>Verify your Breakverse account</h2>
      <p>Your verification code:</p>
      <div style="font-size: 28px; font-weight: bold; letter-spacing: 6px;">${code}</div>
      <p style="margin-top: 12px; color: #555;">This code expires in 10 minutes.</p>
    </div>
  `;

  if (!transport) {
    console.log('[DEV EMAIL] To:', to);
    console.log('[DEV EMAIL] Subject:', subject);
    console.log('[DEV EMAIL] Text:', text);
    return;
  }

  await transport.sendMail({ from, to, subject, text, html });
}


