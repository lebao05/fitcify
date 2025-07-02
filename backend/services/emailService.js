const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "webservicee99@gmail.com",
    pass: "rlrp fkfp gskg hlty",
  },
});

const mailOptions = {
  from: "webservicee99@gmail.com",
};

const sendMail = (email, text,subject) => {
  mailOptions.to = email;
  mailOptions.html = text;
  mailOptions.subject = subject || "No Subject";
  try {
    transporter.sendMail(mailOptions);
  } catch (err) {
    next(err);
  }
};
module.exports = { sendMail };