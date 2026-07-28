const nodemailer = require("nodemailer");
const fs = require("fs");

async function sendEmail(report) {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

await transporter.verify();
console.log("📧 SMTP connection verified");

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: "🛡 New FraudWatch Report Received",
    text: `
New FraudWatch Report

Reference: ${report.reportId}

Category: ${report.category}

Name: ${report.name}

Email: ${report.email}

Phone: ${report.phone}

Target: ${report.target}

Description:

${report.description}

Submitted:
${report.submitted}
`
  });

}


async function sendTelegram(report) {

  const message = `
🛡 FraudWatch New Report

Reference:
${report.reportId}

Submitted:
${report.submitted}

Category:
${report.category}

Name:
${report.name || "Not provided"}

Email:
${report.email || "Not provided"}

Phone:
${report.phone || "Not provided"}

Target:
${report.target || "Not provided"}

Description:
${report.description || "Not provided"}

Evidence:
${
  report.files && report.files.length
    ? report.files.map(file => file.originalname).join("\n")
    : "No files uploaded"
}
`;

  const url =
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: message
    })
  });

}

module.exports = {
  sendEmail,
  sendTelegram
};
