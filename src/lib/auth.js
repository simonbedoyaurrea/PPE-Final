import { supabase } from "./supabase";

const ADMIN_ROLE = "admin";

export function getSessionCookieOptions(maxAge) {
  return {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "lax",
    path: "/",
    maxAge,
  };
}

export function getLogoutCookieOptions() {
  return {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  };
}

export function parseAdminEmails() {
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

export function userHasAdminRole(user) {
  return (
    user?.app_metadata?.role === ADMIN_ROLE ||
    user?.app_metadata?.rol === ADMIN_ROLE ||
    user?.user_metadata?.role === ADMIN_ROLE ||
    user?.user_metadata?.rol === ADMIN_ROLE
  );
}

export async function getAuthSession(cookies) {
  const token = cookies.get("sb-access-token")?.value;

  if (!token) {
    return {
      isAuthenticated: false,
      token: null,
      user: null,
      error: "No existe la cookie sb-access-token",
    };
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return {
      isAuthenticated: false,
      token: null,
      user: null,
      error: error?.message || "Token inválido",
    };
  }

  return {
    isAuthenticated: true,
    token,
    user,
    error: null,
  };
}

export async function getAdminSession(cookies) {
  const session = await getAuthSession(cookies);

  if (!session.isAuthenticated) {
    return {
      ...session,
      isAdmin: false,
      adminReason: "not-authenticated",
      adminEmailsCount: parseAdminEmails().size,
    };
  }

  const adminEmails = parseAdminEmails();
  const userEmail = (session.user.email ?? "").toLowerCase();
  const hasRole = userHasAdminRole(session.user);
  const hasEmail = adminEmails.has(userEmail);
  const isAdmin = hasRole || hasEmail;

  return {
    ...session,
    isAdmin,
    adminReason: hasRole ? "metadata-role" : hasEmail ? "email-env" : "not-admin",
    adminEmailsCount: adminEmails.size,
  };
}
