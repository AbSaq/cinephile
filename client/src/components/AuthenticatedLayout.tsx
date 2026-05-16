import { Sidebar } from "./Sidebar.tsx";
import { Outlet } from "@tanstack/react-router";
import { Route } from "../routes/_authenticated/route.tsx";

export function AuthenticatedLayout() {
  const { user } = Route.useRouteContext();

  return (
    <div className="app-layout">
      <Sidebar user={user} />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
