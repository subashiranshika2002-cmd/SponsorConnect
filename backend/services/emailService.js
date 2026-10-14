const nodemailer = require("nodemailer");

async function sendProposalEmail({ company, organizer, request, file }) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    throw new Error("Email sender is not configured");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
    disableFileAccess: true,
    disableUrlAccess: true
  });

  const result = await transporter.sendMail({
    from: {
      name: "SponsorConnect",
      address: process.env.EMAIL_USER
    },

    // Recipient comes from the company record in MongoDB.
    to: company.email,

    subject: `Sponsorship request: ${request.eventName}`,

    text: [
      `Hello ${company.name},`,
      "",
      "A new sponsorship request was submitted through SponsorConnect.",
      "",
      `Request ID: ${request._id}`,
      `Organizer: ${organizer.full_name}`,
      `Event: ${request.eventName}`,
      `Date: ${request.eventDate.toISOString().slice(0, 10)}`,
      `Location: ${request.location}`,
      `Expected audience: ${request.expectedAudience}`,
      "",
      "Event description:",
      request.description,
      "",
      "Requested support:",
      request.requestedSupport,
      "",
      "Benefits for your company:",
      request.sponsorBenefits,
      "",
      "Please review this request in SponsorConnect using your company account.",
      "",
      "SponsorConnect"
    ].join("\n"),

    attachments: file
      ? [
          {
            filename: "proposal.pdf",
            content: file.buffer,
            contentType: "application/pdf"
          }
        ]
      : []
  });

  const accepted = result.accepted || [];

  if (
    !accepted.some(
      (address) =>
        String(address).toLowerCase() === company.email.toLowerCase()
    )
  ) {
    throw new Error("The email recipient was not accepted");
  }
}

module.exports = { sendProposalEmail };