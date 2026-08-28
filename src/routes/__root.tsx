import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  ScrollRestoration,
} from "@tanstack/react-router";
import { useEffect } from "react";

import { reportLovableError } from "../lib/lovable-error-reporting";
import { trackingScripts } from "../lib/tracking";
import { useSeo } from "../hooks/useSeo";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9F4F0] px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-serif font-bold text-[#A86558]">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-[#2D2322]">Página não encontrada</h2>
        <p className="mt-2 text-sm text-[#6E5A56]">
          A página que você procura não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-[#A86558] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#8C4E43]"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9F4F0] px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-serif font-semibold tracking-tight text-[#2D2322]">
          Ops, ocorreu um erro ao carregar a página
        </h1>
        <p className="mt-2 text-sm text-[#6E5A56]">
          Tente recarregar ou voltar para a página inicial da clínica.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-[#A86558] px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-[#8C4E43]"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-[#E8D8D0] bg-white px-5 py-2 text-sm font-semibold text-[#2D2322] transition-all hover:bg-[#FDFBF9]"
          >
            Página inicial
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  
  // Chama o hook de SEO para aplicar tags dinamicamente ao mudar de rota
  useSeo();

  // Load tracking scripts on the client once mounted
  useEffect(() => {
    const scripts = trackingScripts();
    if (scripts && scripts.length > 0) {
      scripts.forEach(scriptObj => {
        if (scriptObj.children) {
          const script = document.createElement("script");
          script.innerHTML = scriptObj.children as string;
          document.head.appendChild(script);
        }
      });
    }
  }, []);

  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  );
}

