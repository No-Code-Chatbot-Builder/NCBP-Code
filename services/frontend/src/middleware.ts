import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, host } = req.nextUrl;

  if (
    (pathname === "/" || pathname === "/site") &&
    host === process.env.NEXT_PUBLIC_DOMAIN
  ) {
    return NextResponse.rewrite(new URL("/site", req.url));
  }

  return NextResponse.next();
}
