const { supabase } = require("../supabase");

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Authentication required." });

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user)
      return res.status(401).json({ error: "Invalid or expired session." });

    const { data: profile, error: profileError } = await supabase
      .from("profiles").select("id, full_name, role").eq("id", data.user.id).single();
    if (profileError || !profile)
      return res.status(403).json({ error: "No profile found for this account." });

    req.user = { id: data.user.id, email: data.user.email,
                 fullName: profile.full_name, role: profile.role };
    next();
  } catch (e) {
    res.status(500).json({ error: "Authentication failed." });
  }
}

function requireRole(...roles) {
  return (req, res, next) =>
    roles.includes(req.user?.role)
      ? next()
      : res.status(403).json({ error: "You do not have permission." });
}

module.exports = { requireAuth, requireRole };