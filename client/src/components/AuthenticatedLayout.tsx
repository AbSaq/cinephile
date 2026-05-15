import { Sidebar } from "./Sidebar.tsx";
import { Outlet } from "@tanstack/react-router";
import { Route } from "../routes/_authenticated.tsx";

export function AuthenticatedLayout() {
  const { user } = Route.useLoaderData();
  return (
    <div className="app-container">
      <Sidebar user={user} />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
