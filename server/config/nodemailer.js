import nodemailer from "nodemailer";


// Brevo SMTP: smtp-relay.brevo.com, port 587
// Set SMTP_USER, SMTP_PASSWORD, SENDER_EMAIL in .env
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// // Send an email using async/await
// (async () => {
//   const info = await transporter.sendMail({
//     from: '"Maddison Foo Koch" <maddison53@ethereal.email>',
//     to: "bar@example.com, baz@example.com",
//     subject: "Hello ✔",
//     text: "Hello world?", // Plain-text version of the message
//     html: "<b>Hello world?</b>", // HTML version of the message
//   });

//   console.log("Message sent:", info.messageId);
// })();

export default transporter;