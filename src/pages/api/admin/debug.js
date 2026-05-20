import { getAdminSession, userHasAdminRole } from "../../../lib/auth";

export const prerender = false;

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function GET({ cookies }) {
  const admin = await getAdminSession(cookies);

  if (!admin.isAuthenticated) {
    return json(
      {
        isAuthenticated: false,
        isAdmin: false,
        error: admin.error,
        checks: {
          hasAccessTokenCookie: Boolean(cookies.get("sb-access-token")?.value),
          adminEmailsConfigured: admin.adminEmailsCount > 0,
          adminEmailsCount: admin.adminEmailsCount,
        },
      },
      401,
    );
  }

  return json({
    isAuthenticated: true,
    isAdmin: admin.isAdmin,
    adminReason: admin.adminReason,
    user: {
      id: admin.user.id,
      email: admin.user.email,
      app_metadata: admin.user.app_metadata,
      user_metadata: admin.user.user_metadata,
    },
    checks: {
      hasAccessTokenCookie: true,
      adminEmailsConfigured: admin.adminEmailsCount > 0,
      adminEmailsCount: admin.adminEmailsCount,
      hasAdminRole: userHasAdminRole(admin.user),
      emailMatchedAdminEnv: admin.adminReason === "email-env",
    },
  });
}
