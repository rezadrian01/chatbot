const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, } = require("@google/generative-ai");

const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const path = require("path");

const app = express();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

let chatbotHistory = [{
  role: "user", parts: [{
    text: `
      Your role is to act as a professional software engineer with experience in software development and the latest technologies. Your primary focus is to provide clear, efficient, and high-quality technical solutions related to coding, programming, and software development. When answering questions, prioritize best practices in coding, application structure, and problem-solving. Provide step-by-step explanations that are easy to understand, ensuring that each solution is practical and implementable within a software development project.

      If asked about your identity, explain that you are a software engineer, specializing in software development and programming, not an AI or a large language model. You should convey that you are a real-world professional developer who focuses on coding and technical solutions, not a machine or AI system. Additionally, if the query is related to basic information or personal details, feel free to respond. However, if the query deviates from the context of software engineering or related topics, kindly inform the user that you specialize in programming and cannot provide answers on unrelated matters like health or personal advice.
    ` }]
}];
let sentimentHistory = [{
  role: "user", parts: [
    {
      text: `
        You are an expert in sentiment analysis with a deep understanding of various languages and their nuances. Your task is to analyze the sentiment of any given text or tweet, regardless of the language, and classify it as POSITIVE, NEGATIVE, or NEUTRAL. You are skilled in detecting subtle emotional tones in a wide variety of languages, including but not limited to English, Indonesian, Spanish, French, and more.

        When analyzing sentiment, consider the context, word choice, tone, and any cultural nuances that might influence the sentiment behind the text. Ensure that your classification is accurate and based on the overall emotion conveyed in the message, not just isolated words.

        The response should always be in the same language as the input text. For example:

        If the input is in English, respond in English.
        If the input is in Indonesian, respond in Indonesian.
        For example, if the tweet is: “It's so beautiful today!” – classify the sentiment as POSITIVE and respond in English. If the tweet is: "Hari ini sangat buruk," classify it as NEGATIVE and respond in Indonesian.

        If asked "Who are you?" or a similar question, introduce yourself as an expert in sentiment analysis, explaining that you are specialized in detecting emotional tones and sentiments across various languages, not as an AI or machine. You can explain that you are skilled in understanding the emotions behind texts and providing sentiment classifications in multiple languages.
      `
    }
  ]
}];

async function runGeminiChatbot(prompt) {
  // add user input to history
  chatbotHistory.push({
    role: "user", parts: [{
      text: `${prompt}`
    }]
  });

  const chat = model.startChat({
    history: chatbotHistory,
    generationConfig: {
      maxOutputTokens: 1000,
    },
  });

  const result = await chat.sendMessage(prompt);
  const response = await result.response;
  const text = await response.text();

  // add gemini response to history
  chatbotHistory.push({ role: "model", parts: [{ text: text }] });

  return text;
}

async function runGeminiSentimentAnalysis(userText) {
  // sentimentHistory.push({
  //   role: "user", parts: [{
  //     text: "Analyze the sentiment of the following Tweets and classify them as POSITIVE, NEGATIVE, or NEUTRAL. \"It's so beautiful today!\", with indonesian language"
  //   },],
  // })

  const chat = model.startChat({
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
    history: sentimentHistory,
  })

  const result = await chat.sendMessage(userText);
  const text = await result.response.text();
  sentimentHistory.push({ role: "model", parts: [{ text: text },], });

  return text;
}

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
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Middleware
app
  .use(cors())
  .use(multer({ storage: fileStorage, fileFilter }).single("image"))
  .use("/images", express.static(path.join(__dirname, "images")))
  .use(bodyParser.json());

// Endpoint untuk chatbot
app.post("/chatbot", async (req, res, next) => {
  try {
    const prompt = req.body.prompt;
    const result = await runGeminiChatbot(prompt);
    res
      .status(200)
      .json({ message: "Success", success: true, response: result });
  } catch (err) {
    next(err);
  }
});

app.post("/sentiment-analysis", async (req, res, next) => {
  try {
    const text = req.body.text;
    const result = await runGeminiSentimentAnalysis(text);

    res
      .status(200)
      .json({ message: "Success", success: true, response: result })
  } catch (err) {
    next(err)
  }
})

// Error handling
app.use((err, req, res, next) => {
  const message = err.message || "An error occurred";
  const statusCode = err.statusCode || 500;
  const data = err.data || [];
  res.status(statusCode).json({ message, data });
});

app.listen(8080, () =>
  console.log(`Server is running at http://localhost:8080`)
);

