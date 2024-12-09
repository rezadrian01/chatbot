import { useState } from "react";
import ChatArea from "../components/ChatArea";
import Navbar from "../components/Navbar";

export default function Chatbot() {
  const [promptResponse, setPromptResponse] = useState({
    prompts: [],
    responses: [],
  });
  // console.log(promptResponse)
  return (
    <main className="mx-auto w-full lg:w-5/6 bg-stone-50 shadow-lg p-4">
      <ChatArea promptResponse={promptResponse} setPromptResponse={setPromptResponse} />
    </main>
  );
}

export async function action({ request }) {
  const fd = await request.formData();
  const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/chatbot`, {
    method: request.method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt: fd.get("prompt") }),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw json(
      { message: "Failed to send prompt" },
      { status: response.status || 500 }
    );
  }
  return resData;
}
