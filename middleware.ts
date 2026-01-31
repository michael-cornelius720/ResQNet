import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // const host = req.headers.get("host") || "";
  const url = req.nextUrl.clone();

  // // Ignore Next.js internal files
  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/api") ||
    url.pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // let subdomain = "";

  // // For localhost development
  // if (host.includes("localhost")) {
  //   subdomain = url.searchParams.get("sub") || "";
  // } 
  // // For production domain
  // else {
  //   subdomain = host.split(".")[0];
  // }

  // // Prevent rewrite loop
  // if (
  //   url.pathname.startsWith("/user") ||
  //   url.pathname.startsWith("/hospital") ||
  //   url.pathname.startsWith("/police") ||
  //   url.pathname.startsWith("/login") ||
  //   url.pathname.startsWith("/signup") ||
  //   url.pathname.startsWith("/..") 
  // ) {
  //   return NextResponse.next();
  // }

  // // Rewrite based on subdomain
  // switch (subdomain) {
  //   case "user":
  //     url.pathname = `/user${url.pathname}`;
  //     break;

  //   case "hospital":
  //     url.pathname = `/hospital${url.pathname}`;
  //     break;

  //   case "police":
  //     url.pathname = `/police${url.pathname}`;
  //     break;

  //   case "login":
  //     url.pathname = `/login${url.pathname}`;
  //     break;

  //   case "signup":
  //     url.pathname = `/signup${url.pathname}`;
  //     break;

  //     case "sos":
  //     url.pathname = `/sos${url.pathname}`;
  //     break;

  //   default:
  //     // Root domain → landing page
  //     url.pathname = "../";
  //     break;
  // }

  return NextResponse.next();
}

/**
 * Apply middleware to all routes except static files
 */
export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
