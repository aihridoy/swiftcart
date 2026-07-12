import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  const isAdminRoute = pathname.startsWith("/dashboard");
  const isUserDashboardRoute = pathname.startsWith("/user-dashboard");

  if (isAdminRoute) {
    if (!isLoggedIn) {
      return Response.redirect(new URL("/login", req.nextUrl));
    }
    if (role !== "admin") {
      return Response.redirect(new URL("/", req.nextUrl));
    }
  }

  if (isUserDashboardRoute && !isLoggedIn) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/user-dashboard/:path*"],
};
