import sendEmail from "../utils/sendEmail.js";

export const sendEmailController = async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    const response = await sendEmail({
      to,
      subject,
      text,
    });

    res.status(200).json({ message: "Email sent successfully", response });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
};
