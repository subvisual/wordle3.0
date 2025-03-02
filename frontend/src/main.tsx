import { CssBaseline, CssVarsProvider } from "@mui/joy";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { App } from "./router/app";

import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiProvider } from "wagmi";
import { anvil, sepolia } from "wagmi/chains";
import { ENV_VARS } from "./config/constants";
import { theme } from "./theme/theme";

const rainbowkitConfig = getDefaultConfig({
  appName: "Wordle",
  projectId: ENV_VARS.PUBLIC_PROJECT_ID,
  chains: [sepolia, anvil]
});

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WagmiProvider config={rainbowkitConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <CssVarsProvider theme={theme} defaultMode="dark">
            <CssBaseline />
            <BrowserRouter>
              <App />
              <ToastContainer />
            </BrowserRouter>
          </CssVarsProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);
