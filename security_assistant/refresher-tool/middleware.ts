import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/access", "/api/access", "/manifest.webmanifest", "/favicon.ico"];

export function middleware(request: NextRequest) {
  const configuredKey = process.env.REFRESHER_ACCESS_KEY;

  if (!configuredKey) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") && pathname !== "/api/access" ||
    PUBLIC_PATHS.includes(pathname)
  ) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get("sa_gate")?.value;
  if (cookie === configuredKey) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/access";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
