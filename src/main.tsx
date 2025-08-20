import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import localforage from "localforage";

import App from "./App";

import "./index.css"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 24 * 60 * 60 * 1000,
      retry: 0,
    },
  },
});

const persister = createAsyncStoragePersister({
  storage: localforage,
  key: "rqc",
  throttleTime: 1000,
  serialize: (client) => JSON.stringify(client),
  deserialize: (cached) => JSON.parse(cached),
});

if (
  typeof window !== "undefined" &&
  "serviceWorker" in navigator &&
  import.meta.env.MODE !== "test"
) {
  import("virtual:pwa-register").then(({ registerSW }) => {
    registerSW({ immediate: true });
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
      <App />
    </PersistQueryClientProvider>
  </React.StrictMode>
);
