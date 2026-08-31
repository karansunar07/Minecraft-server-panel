import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import { AdminLayout } from "../layouts/AdminLayout";
import { ServerDashboard } from "../pages/ServerDashboard";
import { FilesPage } from "../pages/FilesPage";
import { SoftwarePage } from "../pages/SoftwarePage";
import { MarketplacePage } from "../pages/MarketplacePage";
import { BackupsPage } from "../pages/BackupsPage";
import { GenericPage } from "../pages/GenericPage";
import { AdminDashboard } from "../pages/AdminDashboard";
import { AuthPage } from "../pages/AuthPage";

export const router = createBrowserRouter([
  { path: "/login", element: <AuthPage /> },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/servers/demo/console" replace /> },
      { path: "servers/:serverId/console", element: <ServerDashboard /> },
      { path: "servers/:serverId/files", element: <FilesPage /> },
      { path: "servers/:serverId/software", element: <SoftwarePage /> },
      { path: "servers/:serverId/marketplace", element: <MarketplacePage /> },
      { path: "servers/:serverId/backups", element: <BackupsPage /> },
      { path: "servers/:serverId/:page", element: <GenericPage /> }
    ]
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: ":page", element: <GenericPage admin /> }
    ]
  }
]);
