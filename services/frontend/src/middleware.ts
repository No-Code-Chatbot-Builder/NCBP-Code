import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, host } = req.nextUrl;

  const { cookies } = req;
  const isLoggedIn = cookies.get("userLoggedIn");

  const protectedRoutes = pathname.startsWith("/dashboard");
  if (protectedRoutes && !isLoggedIn) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (
    (pathname === "/" || pathname === "/site") &&
    host === process.env.NEXT_PUBLIC_DOMAIN
  ) {
    return NextResponse.rewrite(new URL("/site", req.url));
  }

  return NextResponse.next();
}
