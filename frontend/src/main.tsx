import { CssBaseline, CssVarsProvider } from "@mui/joy";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./router/app";

import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { http, WagmiProvider } from "wagmi";
import { anvil, sepolia } from "wagmi/chains";

const projectId = import.meta.env.VITE_PUBLIC_PROJECT_ID;
if (!projectId) {
  throw new Error("Project Id is not defined.");
}

const config = getDefaultConfig({
  appName: "Wordle",
  projectId: projectId,
  chains: [sepolia, anvil],
  transports: {
    [anvil.id]: http(import.meta.env.VITE_ANVIL_RPC_URL)
  }
});

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <CssVarsProvider>
            <CssBaseline />
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </CssVarsProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);
