import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  const isAdminRoute = pathname.startsWith("/dashboard");

  // These used to render for signed-out visitors and only then bounce to
  // /login from the client, which flashed a broken page and fired a 401.
  const signedInRoutes = [
    "/user-dashboard",
    "/cart",
    "/orders",
    "/wishlist",
    "/edit-product",
    "/profile",
  ];

  const toLogin = () => {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname + req.nextUrl.search);
    return Response.redirect(loginUrl);
  };

  if (isAdminRoute) {
    if (!isLoggedIn) {
      return toLogin();
    }
    if (role !== "admin") {
      return Response.redirect(new URL("/", req.nextUrl));
    }
  }

  if (!isLoggedIn && signedInRoutes.some((route) => pathname.startsWith(route))) {
    return toLogin();
  }
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/user-dashboard/:path*",
    "/cart/:path*",
    "/orders/:path*",
    "/wishlist/:path*",
    "/edit-product/:path*",
    "/profile/:path*",
  ],
};
