import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath =
    path === "/login" ||
    path === "/signup" ||
    path === "/verifyemail" ||
    path === "/forgot-password";

  const token = request.cookies.get("token")?.value;

  //  If logged in and trying to access public page → redirect to home
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  //  If not logged in and trying to access protected page → redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  //  Otherwise, continue to the requested route
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/", 
    "/profile",
    "/login",
    "/signup",
    "/verifyemail",
    "/forgot-password",
  ],
};
