import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    lazy: async () => {
      const { LoginPage } = await import("./components/LoginPage");
      return { Component: LoginPage };
    },
  },
  {
    lazy: async () => {
      const { Layout } = await import("./components/Layout");
      return { Component: Layout };
    },
    children: [
      {
        path: "/dashboard",
        lazy: async () => {
          const { DashboardPage } = await import("./components/DashboardPage");
          return { Component: DashboardPage };
        },
      },
      {
        path: "/reports/:weekId",
        lazy: async () => {
          const { ReportListPage } = await import("./components/ReportListPage");
          return { Component: ReportListPage };
        },
      },
      {
        path: "/reports/:weekId/:day/create",
        lazy: async () => {
          const { ReportCreatePage } = await import("./components/ReportCreatePage");
          return { Component: ReportCreatePage };
        },
      },
      {
        path: "/reports/:weekId/:day/edit",
        lazy: async () => {
          const { ReportCreatePage } = await import("./components/ReportCreatePage");
          return { Component: ReportCreatePage };
        },
      },
    ],
  },
]);
