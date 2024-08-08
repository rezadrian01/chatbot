const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");
dotenv.config();
const path = require("path");

const app = express();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function runGemini(prompt) {
  //   const prompt =
  //     "Tidak ada, jadi ini aku lagi membuat aplikasi chatbot dengan kamu gemini, dan ini lagi proses development";
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = await response.text();
  //   console.log(text);
  return text;
}
// runGemini();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const date = new Date().toISOString().replace(/:/g, "-");
    cb(null, `${date}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, false);
  } else {
    cb(null, true);
  }
};

app
  .use(cors())
  .use(multer({ storage: fileStorage, fileFilter }).single("image"))
  .use("/images", express.static(path.join(__dirname, "images")))
  .use(bodyParser.json());

app.post("/chatbot", async (req, res, next) => {
  try {
    const prompt = req.body.prompt;
    const result = await runGemini(prompt);
    res
      .status(200)
      .json({ message: "Success", success: true, response: result });
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  const message = err.message || "An Error occured";
  const statusCode = err.statusCode || 500;
  const data = err.data || [];
  res.status(statusCode).json({ message, data });
});

app.listen(8080, () =>
  console.log(`Server is running at http://localhost:8080`)
);
