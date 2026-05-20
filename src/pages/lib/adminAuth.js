import { supabase } from "./supabase";

function parseAdminEmails() {
  const emails = [
    import.meta.env.ADMIN_EMAILS,
    import.meta.env.ADMIN_EMAIL,
    import.meta.env.PUBLIC_ADMIN_EMAILS,
    import.meta.env.PUBLIC_ADMIN_EMAIL,
  ]
    .filter(Boolean)
    .flatMap((value) => value.split(","))
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return new Set(emails);
}

function userHasAdminRole(user) {
  return (
    user?.app_metadata?.role === "admin" ||
    user?.app_metadata?.rol === "admin" ||
    user?.user_metadata?.role === "admin" ||
    user?.user_metadata?.rol === "admin"
  );
}

export async function getAdminSession(cookies) {
  const token = cookies.get("sb-access-token")?.value;

  if (!token) {
    return { isAuthenticated: false, isAdmin: false, token: null, user: null };
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return { isAuthenticated: false, isAdmin: false, token: null, user: null };
  }

  const adminEmails = parseAdminEmails();
  const isAdmin =
    userHasAdminRole(user) || adminEmails.has((user.email ?? "").toLowerCase());

  return { isAuthenticated: true, isAdmin, token, user };
}
