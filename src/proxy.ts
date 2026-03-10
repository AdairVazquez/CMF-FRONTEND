import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PROTECTED_ROUTES } from "@/config/route-permissions";

const PUBLIC_ROUTES = [
  "/login",
  "/two-factor",
  "/forgot-password",
  "/reset-password",
];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("cmf_token")?.value;
  const role = request.cookies.get("cmf_role")?.value ?? "";
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

  // Role-based access control (only when token + role are both present)
  if (token && role) {
    const match = PROTECTED_ROUTES.find((r) => pathname.startsWith(r.prefix));
    if (match && !match.roles.includes(role)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
