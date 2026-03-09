import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = [
  "/login",
  "/two-factor",
  "/forgot-password",
  "/reset-password",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("cmf_token")?.value;
  const isPublic = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));

  // Root redirect
  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(token ? "/dashboard" : "/login", request.url)
    );
  }

  // Auth check for protected routes
  if (!isPublic && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Already authenticated → redirect away from login
  if (isPublic && token && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
