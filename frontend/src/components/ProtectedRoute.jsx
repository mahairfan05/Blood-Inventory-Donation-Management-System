import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ roles }) {
  const { session, profile, loading, signOut } = useAuth();
  const location = useLocation();

  if (loading) return <div className="p-8 text-slate-500">Loading...</div>;
  if (!session) return <Navigate to="/login" replace state={{ from: location }} />;

  if (!profile)
    return (
      <div className="p-8">
        <p className="text-red-600">No profile found for this account. Contact an administrator.</p>
        <button onClick={signOut} className="mt-4 rounded-lg border px-4 py-2">Log out</button>
      </div>
    );

  if (roles && !roles.includes(profile.role))
    return <div className="p-8 text-red-600">You do not have access to this page.</div>;

  return <Outlet />;
}