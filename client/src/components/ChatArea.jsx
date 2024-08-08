import { useEffect, useState } from "react";
import {
  useActionData,
  json,
  Form,
  useSubmit,
  useNavigation,
} from "react-router-dom";

export default function ChatArea() {
  //   console.log(import.meta.env.VITE_API_DOMAIN);
  const [responses, setResponses] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const resultAction = useActionData();
  const submit = useSubmit();
  useEffect(() => {
    if (resultAction) {
      setResponses((prevResponse) => {
        const updatedResponses = [...prevResponse];
        updatedResponses.push(resultAction.response);
        return updatedResponses;
      });
    }
  }, [resultAction]);

  const navigation = useNavigation();
  if (navigation.state === "submitting") {
    return <p>Loading...</p>;
  }
  function handleSubmit(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    // const prompt = Object.fromEntries(fd.entries());
    const prompt = fd.get("prompt");
    setPrompts((prevPrompts) => {
      const updatedPrompts = [...prevPrompts];
      updatedPrompts.push(prompt);
      return updatedPrompts;
    });
    submit(fd, { method: "POST" });
    return;
  }

  return (
    <>
      <h1>ChatArea</h1>
      <Form onSubmit={handleSubmit}>
        <label>Prompt</label>
        <input
          className="bg-slate-100 px-3 py-1 rounded-full focus:outline-none"
          placeholder="masukan prompt..."
          type="text"
          name="prompt"
          id="prompt"
        />
        <button
          className="bg-indigo-500 px-3 py-1 rounded text-slate-50"
          type="submit"
        >
          Send
        </button>
      </Form>
      <ul>
        {responses &&
          responses.map((response, index) => {
            return <li key={index}>{response}</li>;
          })}
      </ul>
    </>
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
