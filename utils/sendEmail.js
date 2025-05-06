import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN, SENDER_EMAIL } = process.env;

const REDIRECT_URI = "https://developers.google.com/oauthplayground";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendEmail = async ({ to, subject, text }) => {
  try {
    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

    const rawMessage = Buffer.from(
      `From: "Student Council" <${SENDER_EMAIL}>\r\n` +
        `To: ${to}\r\n` +
        `Subject: ${subject}\r\n\r\n` +
        `${text}`
    )
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const response = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: rawMessage,
      },
    });

    console.log("Email sent successfully:", response.data.id);
  } catch (err) {
    console.error("Failed to send email:", err.message);
  }
};

export default sendEmail;
