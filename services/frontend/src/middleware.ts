import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, host } = req.nextUrl;

  const isLoggedIn = req.cookies.get("loggedUser");

  const protectedRoutes = pathname.startsWith("/dashboard/assistants");

  if (isLoggedIn && !protectedRoutes) {
    return NextResponse.redirect(new URL("/dashboard/assistants", req.url));
  }

  if (
    (pathname === "/" || pathname === "/site") &&
    host === process.env.NEXT_PUBLIC_DOMAIN
  ) {
    return NextResponse.rewrite(new URL("/site", req.url));
  }

  return NextResponse.next();
}
