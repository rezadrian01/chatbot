import React, { useState } from 'react'
import ChatArea from '../components/ChatArea'

export default function SentimentAnalysis() {
    const [promptResponse, setPromptResponse] = useState({
        prompts: [],
        responses: [],
    });
    console.log(promptResponse)
    return (
        <main className="mx-auto w-full lg:w-5/6 bg-stone-50 shadow-lg p-4">
            <ChatArea promptResponse={promptResponse} setPromptResponse={setPromptResponse} />
        </main>
    )
}


export async function action({ request }) {
    const fd = await request.formData();
    const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/sentiment-analysis`, {
        method: request.method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: fd.get("text") }),
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