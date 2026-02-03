import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post("/upload", async (req, res) => {
  try {
    const base64Image = req.body.image.split(";base64,").pop();

    await transporter.sendMail({
      from: `"Valentine Bot 💖" <${process.env.EMAIL_USER}>`,
      to: "aakashghutke06@gmail.com",
      subject: "💘 Valentine Selfie Captured!",
      html: "<h2>Someone said YES 😍</h2>",
      attachments: [{
        filename: "selfie.png",
        content: base64Image,
        encoding: "base64"
      }]
    });

    res.send({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false });
  }
});

app.listen(3000, () =>
  console.log("Server running on port 3000")
);
