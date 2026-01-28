import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
  let transporter;

  const mailUser = process.env.MAIL_USERNAME || process.env.SMTP_USER;
  const mailPass = process.env.MAIL_PASSWORD || process.env.SMTP_PASS;

  if (mailUser && mailPass) {
    if (mailUser.includes('@gmail.com')) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: mailUser,
          pass: mailPass,
        },
      });
    } else {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.ethereal.email',
        port: process.env.SMTP_PORT || 587,
        auth: {
          user: mailUser,
          pass: mailPass,
        },
      });
    }
  } else if (process.env.NODE_ENV !== 'production') {
    const testAccount = await nodemailer.createTestAccount();
    
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, 
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } else {
    throw new Error('SMTP credentials are required in production');
  }

  const mailOptions = {
    from: `${process.env.FROM_NAME || 'Streakly'} <${process.env.SENDER_EMAIL || process.env.FROM_EMAIL || 'noreply@streakly.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  const info = await transporter.sendMail(mailOptions);
};
