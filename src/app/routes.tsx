import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import { NewTradePage } from "../features/trades/pages/NewTradePage";
import { DashboardPage } from "../features/dashboard/pages/DashboardPage";
import { JournalPage } from "../features/journal/pages/JournalPage";
import { AnalyticsPage } from "../features/analytics/pages/AnalyticsPage";
import { SettingsPage } from "../features/settings/pages/SettingsPage";

// Router instantiation with operational routes active
export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "journal",
        element: <JournalPage />,
      },
      {
        path: "analytics",
        element: <AnalyticsPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "trade/new",
        element: <NewTradePage />,
      },
    ],
  },
]);