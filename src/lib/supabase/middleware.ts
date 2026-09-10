/** 요청마다 Supabase 세션 쿠키를 갱신하는 미들웨어 로직 */

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Refreshes the Supabase session on each request and turns unauthenticated visitors
 * away from /admin.
 *
 * This is an *optimistic* gate in the sense the Next.js auth guide means: it runs on
 * every route including prefetches, so it only establishes that someone is signed
 * in. Whether they may actually read or write is decided in the DAL and again by
 * RLS, close to the data. Checking admin membership here would add a database round
 * trip to every navigation and still wouldn't be the check that counts.
 */
export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!isSupabaseConfigured()) {
    // Without Supabase there are no accounts, so nobody can be an admin. Fail closed.
    if (pathname.startsWith("/admin")) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // getUser(), not getSession() — this validates the token with the auth server and
  // performs the refresh whose new cookies setAll() above writes onto the response.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (pathname.startsWith("/admin") && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Deliberately no /login → /admin redirect here. "Signed in" and "is an admin"
  // differ, and this gate only knows the first: bouncing every signed-in visitor to
  // /admin would put a non-admin in a loop, since /admin sends them straight back.
  // The login page redirects itself once it knows which of the two it's dealing with.

  return response;
}
