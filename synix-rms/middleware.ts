import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { FEATURE_GATES, hasRequiredPlan } from "@/libs/feature-gates";
import { getUserPlan } from "@/libs/subscriptions";

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

  // If no user after protect, let Clerk handle redirect
  if (!userId) {
    return NextResponse.next();
  }

  // Skip feature gating for billing page itself
  if (pathname.includes('/billing')) {
    console.log('Skipping feature gate for billing page');
    return NextResponse.next();
  }

  // Extract locale from URL (en or fr) - only for localized paths
  const pathParts = pathname.split('/');
  const locale = pathParts[1];
  
  // Only proceed with feature gating if we have a valid locale
  if (!['en', 'fr'].includes(locale)) {
    return NextResponse.next();
  }

  const routePath = '/' + pathParts.slice(2).join('/');
  console.log(`Extracted locale: ${locale}, Route path: ${routePath}`);

  // Find matching gated route
  const matchedGate = Object.entries(FEATURE_GATES).find(
    ([route]) => routePath.startsWith(route)
  );

  if (!matchedGate) {
    console.log('No feature gate matched');
    return NextResponse.next();
  }

  const [gatedRoute, requiredPlan] = matchedGate;
  console.log(`Feature gate matched: ${gatedRoute} requires ${requiredPlan}`);

  try {
    const userPlan = await getUserPlan(userId);
    console.log(`User plan: ${userPlan}, Required: ${requiredPlan}`);

    if (!hasRequiredPlan(userPlan, requiredPlan)) {
      const billingUrl = new URL(`/${locale}/dashboard/billing`, req.url);
      billingUrl.searchParams.set("upgrade", requiredPlan);
      
      console.log(`Redirecting to: ${billingUrl.toString()}`);
      return NextResponse.redirect(billingUrl);
    }

    console.log('User has required plan, allowing access');
  } catch (error) {
    console.error('Error in middleware:', error);
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};