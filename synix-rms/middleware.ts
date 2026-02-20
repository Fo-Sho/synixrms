import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/en/dashboard(.*)",
  "/fr/dashboard(.*)"
]);

const isPublicRoute = createRouteMatcher([
  "/en/sign-in(.*)", 
  "/fr/sign-in(.*)",
  "/en/sign-up(.*)", 
  "/fr/sign-up(.*)",
  "/en",
  "/fr",
  "/"
]);

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;
  
  console.log(`Middleware: ${pathname}`);

  // Handle direct /dashboard access (without locale) - redirect to /en/dashboard
  if (pathname === '/dashboard') {
    const newUrl = new URL('/en/dashboard', req.url);
    console.log(`Redirecting /dashboard to ${newUrl.toString()}`);
    return NextResponse.redirect(newUrl);
  }

  // Handle any /dashboard/* path without locale
  if (pathname.startsWith('/dashboard/')) {
    const newUrl = new URL(`/en${pathname}`, req.url);
    console.log(`Redirecting ${pathname} to ${newUrl.toString()}`);
    return NextResponse.redirect(newUrl);
  }

  const { userId } = await auth();
  console.log(`UserId: ${userId ? 'present' : 'none'}`);

  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Protect dashboard routes
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // Remove all subscription checking from middleware
  // Let individual pages handle their own feature gates
  
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};