import { StrictMode, createElement } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { routeTree } from "./routeTree.gen";
import "./styles.css";

const queryClient = new QueryClient();

const router = createRouter({
    routeTree,
    context: {
          queryClient,
    },
    defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
        router: typeof router;
  }
}

const rootElement = document.getElementById("root")!;

const app = createElement(
    StrictMode,
    null,
    createElement(
          QueryClientProvider,
      { client: queryClient },
          createElement(RouterProvider, { router })
        )
  );

if (rootElement.innerHTML) {
    // Server/prerendered markup already present (SEO pre-render or the SPA
  // fallback serving another route's prerendered index.html). Hydrate so
  // the client router can reconcile to the URL that was actually requested,
  // instead of leaving the mismatched static markup frozen and unrouted.
  hydrateRoot(rootElement, app);
} else {
    const root = createRoot(rootElement);
    root.render(app);
}
