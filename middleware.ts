// middleware.ts (project root)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
const COOKIE_NAME = "admin_token";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect /admin routes except the login page itself
  const isAdminPath = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";
  const isAdminPage = pathname === "/admin";

  if (isAdminPath && !isLoginPage) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  // If already logged in, don't allow visiting /admin/login
  if (isLoginPage || isAdminPage) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (token) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/control/products";
      return NextResponse.redirect(url);
      
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin", "/api/admin/:path*", "/api/auth/:path*"],
};