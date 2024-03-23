import { NextRequest, NextResponse } from "next/server";
import { useCustomAuth } from "./providers/auth-provider";

export function middleware(req: NextRequest) {
  const { pathname, host } = req.nextUrl;

  const protectedRoutes = pathname.startsWith("/dashboard");
  if (protectedRoutes) {
    return NextResponse.next();
  }

  if (
    (pathname === "/" || pathname === "/site") &&
    host === process.env.NEXT_PUBLIC_DOMAIN
  ) {
    return NextResponse.rewrite(new URL("/site", req.url));
  }

  return NextResponse.next();
}
