import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = [
  "/wishlist",
  "/cart",
  "/orders",
  "/dashboard",
  "/dashboard/add-product",
  "/dashboard/users",
  "/dashboard/orders",
  "/dashboard/products-list",
  "/products/[id]",
  "/edit-product/[id]",
];

// const publicRoutes = [
//   '/login',
//   '/register',
//   '/forgot-password',
//   '/products',
//   '/',
//   '/api',
//   '/api/auth',
// ];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  //   if (publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`)) || !isProtectedRoute) {
  //     return NextResponse.next();
  //   }

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  if (!token && isProtectedRoute) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * 1. /_next (Next.js internals)
     * 2. /static (static files)
     * 3. /favicon.ico, /robots.txt (common files)
     */
    "/((?!_next|static|favicon.ico|robots.txt).*)",
  ],
};
