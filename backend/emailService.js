import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   service: "Gmail", // You can use other email services like Yahoo, Outlook, etc.
//   auth: {
//     user: process.env.EMAIL_USER, // Your email address
//     pass: process.env.EMAIL_PASS, // Your email password or application-specific password
//   },
// });

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "fikadu026@gmail.com",
    pass: "nqyycjlphccfrzir",
  },
});

export const sendConfirmationEmail = async (to, confirmationCode) => {
  return await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "confirmation code", // Subject line
    text: `Your confirmation code is: ${confirmationCode}`,
    html: `Your confirmation code is: ${confirmationCode}`, // html body
  });

//   return info;
};
