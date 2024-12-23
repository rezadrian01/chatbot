import { useEffect, useRef, useState } from "react";
import {
  useActionData,
  json,
  Form,
  useSubmit,
  useNavigation,
  useLocation,
} from "react-router-dom";

export default function ChatArea({ promptResponse, setPromptResponse }) {
  // const [promptResponse, setPromptResponse] = useState({
  //   prompts: [],
  //   responses: [],
  // });
  const resultAction = useActionData();
  const submit = useSubmit();
  const navigation = useNavigation();
  const input = useRef();
  const location = useLocation();

  const isChatbot = location.pathname === '/chatbot';

  useEffect(() => {
    if (resultAction) {
      setPromptResponse((prevResponse) => {
        const updatedResponses = [...prevResponse.responses];
        updatedResponses.push(resultAction.response);
        return {
          ...prevResponse,
          responses: updatedResponses,
        };
      });
    }
  }, [resultAction]);

  const submitting = navigation.state === "submitting";

  function handleSubmit(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    // const prompt = Object.fromEntries(fd.entries());
    const prompt = fd.get("prompt");
    setPromptResponse((prevPrompts) => {
      console.log(prevPrompts)
      const updatedPrompts = [...prevPrompts.prompts];
      updatedPrompts.push(prompt);
      return {
        ...prevPrompts,
        prompts: updatedPrompts,
      };
    });
    input.current.value = "";
    submit(fd, { method: "POST", data: 'test' });
    return;
  }

  return (
    <>
      <div className="min-h-[93vh] overflow-y-auto flex flex-col justify-between pb-32 pt-6">
        <ul className="flex flex-col gap-8">
          {promptResponse.prompts &&
            promptResponse.prompts.map((prompt, index) => {
              return (
                <li key={index} className="flex flex-col gap-8">
                  <div className="text-right bg-slate-100 rounded-lg shadow p-6">
                    <p>{prompt}</p>
                  </div>
                  {!promptResponse.responses[index] && submitting && (
                    <p className="animate-pulse font-semibold">Loading...</p>
                  )}
                  {promptResponse.responses[index] && (
                    <div className="text-left bg-slate-100 rounded-lg shadow p-6">
                      <p>{promptResponse.responses[index]}</p>
                    </div>
                  )}
                </li>
              );
            })}
        </ul>
        <Form className="relative" onSubmit={handleSubmit}>
          <div className="fixed bottom-6 right-4 left-4 lg:right-36 lg:left-36 shadow-lg rounded-full">
            <input
              ref={input}
              className="bg-zinc-100 px-3 py-1 rounded-full focus:outline-none w-full"
              placeholder="Input some prompt..."
              type="text"
              name={isChatbot ? "prompt" : "text"}
              id="prompt"
            />
            <button
              disabled={submitting}
              className="absolute disabled:bg-indigo-600 disabled:text-stone-400 right-0 bg-indigo-500 hover:bg-indigo-600 px-3 py-1 rounded-e-full text-slate-50"
              type="submit"
            >
              Send
            </button>
          </div>
        </Form>
      </div>
    </>
  );
}