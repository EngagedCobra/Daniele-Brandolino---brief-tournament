
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import "./index.css";
import MainLayout from "./layouts/MainLayout";
import Competition from "./pages/Competition";
import CompetitionGames from "./pages/CompetitionGames";
import CompetitionHistory from "./pages/CompetitionHistory";
import Competitions from "./pages/Competitions";
import HomePage from "./pages/HomePage";
import Team from "./pages/Team";
import Teams from "./pages/Teams";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
  {
    path: "/teams",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Teams />,
      },
      {
        path: "/teams/:id",
        element: <Team />,
      },
    ],
  },
  {
    path: "/competitions",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Competitions />,
      },
      {
        path: "/competitions/:id",
        element: <Competition />,
      },
      {
        path: "/competitions/:id/games",
        element: <CompetitionGames />,
      },
    ],
  },
  {
    path: "/past-competitions",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <CompetitionHistory />,
      }
    ],
  },
]);

const queryClient = new QueryClient();
// This code is only for TypeScript
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import("@tanstack/query-core").QueryClient;
  }
}
// This code is for all users
window.__TANSTACK_QUERY_CLIENT__ = queryClient;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {/*       <TanStackDevtools
        config={{ position: "middle-left" }}
        plugins={[
          {
            name: "TanStack Query",
            render: <ReactQueryDevtoolsPanel />,
            defaultOpen: false,
          },
        ]}
      /> */}
    </QueryClientProvider>
  </StrictMode>,
);
