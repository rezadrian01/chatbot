import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import { action as sendPromptAction } from "./components/ChatArea";
import { action as chatbotAction } from "./pages/Chatbot";
import { action as sentimentAction } from "./pages/SentimentAnalysis";

import Chatbot from "./pages/Chatbot";
import Index from "./pages/Index";
import Layout from "./components/Layouts/Index";
import SentimentAnalysis from "./pages/SentimentAnalysis";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Index />
        },
        {
          path: "/chatbot",
          element: <Chatbot />,
          action: chatbotAction,
        },
        {
          path: "/sentiment-analysis",
          element: <SentimentAnalysis />,
          action: sentimentAction
        }
      ]
    }
  ]);

  return <RouterProvider router={router} />;
}
