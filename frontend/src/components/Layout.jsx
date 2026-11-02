import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { profile, role, signOut } = useAuth();

  const links = [
    { to: "/requests", label: "Requests" },
    // add Dashboard "/" and Reports "/reports" here later
    ...(role === "admin" ? [{ to: "/admin/users", label: "Users" }] : []),
  ];

  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium ${
      isActive ? "bg-red-50 text-red-700" : "text-slate-600 hover:bg-slate-100"
    }`;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white print:hidden">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-3">
          <div className="flex items-center gap-6">
            <span className="text-xl font-bold text-red-700">BloodLink</span>
            <nav className="flex gap-1">
              {links.map((l) => (
                <NavLink key={l.to} to={l.to} className={linkClass}>{l.label}</NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-600">
              {profile?.full_name} <span className="text-slate-400">({role})</span>
            </span>
            <button onClick={signOut} className="rounded-lg border border-slate-300 px-3 py-2 hover:bg-slate-50">
              Log out
            </button>
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  );
}