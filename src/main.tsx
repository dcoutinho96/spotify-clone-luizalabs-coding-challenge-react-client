import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import localforage from "localforage";

import "~/i18n";
import "./styles/index.pcss";

import { App } from "~/base";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt: () => Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
    "pwa:install": Event;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 24 * 60 * 60 * 1000,
      retry: 0,
      networkMode: "offlineFirst",
      throwOnError: (_error, query) => {
        return !query.state.data;
      },
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

type PersistOptionsType = NonNullable<
  Parameters<typeof PersistQueryClientProvider>[0]["persistOptions"]
>;

const persistOptions: PersistOptionsType = {
  persister,
};

function PwaInstaller() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleInstall = () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.finally(() => setDeferredPrompt(null));
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("pwa:install", handleInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("pwa:install", handleInstall);
    };
  }, [deferredPrompt]);

  return null;
}

if (
  typeof window !== "undefined" &&
  "serviceWorker" in navigator &&
  import.meta.env.MODE !== "test"
) {
  import("virtual:pwa-register").then(
    (mod: typeof import("virtual:pwa-register")) => {
      const { registerSW } = mod;
      registerSW({
        immediate: true,
      });
    }
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
      <PwaInstaller />
      <App />
    </PersistQueryClientProvider>
  </React.StrictMode>
);
