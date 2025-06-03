import React, { useEffect, useRef, useState } from "react";
import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from "@mysten/dapp-kit";
import { myTheme } from "./myTheme";
import "@mysten/dapp-kit/dist/index.css";

import { getFullnodeUrl } from "@mysten/sui/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HintProvider } from "./pages/dashboard/HintContext";
import Dashboard from "./pages/Dashboard";

const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl("testnet") },
});

const queryClient = new QueryClient();

function DashboardWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider autoConnect theme={myTheme}>
          <HintProvider>
            <Dashboard />
          </HintProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

export default DashboardWrapper;
