import { CssBaseline, CssVarsProvider } from "@mui/joy";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./router/app";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CssVarsProvider>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CssVarsProvider>
  </StrictMode>
);
