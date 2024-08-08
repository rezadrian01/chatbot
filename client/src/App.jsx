import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainPage from "./pages/Main";
import { action as sendPromptAction } from "./components/ChatArea";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainPage />,
      action: sendPromptAction,
    },
  ]);

  return <RouterProvider router={router} />;
}
