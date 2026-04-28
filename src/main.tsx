import "@/index.css";
import AppProvider from "@/providers";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <>
        <App />
        <Toaster position="top-right" richColors closeButton />
      </>
    </AppProvider>
  </StrictMode>,
);
