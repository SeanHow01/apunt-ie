import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

const PROTECTED = ['/home', '/lessons', '/calculator', '/fireup', '/settings'];

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // ── Existing app route protection ────────────────────────────────────────
  const isProtected = PROTECTED.some(
    (p) => pathname === p || pathname.startsWith(p + '/'),
  );

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/sign-in';
    return NextResponse.redirect(url);
  }

  // ── SETU route protection ─────────────────────────────────────────────────
  if (pathname.startsWith('/setu')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/sign-in';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    // /setu/admin/* requires staff role
    if (pathname.startsWith('/setu/admin')) {
      try {
        const admin = createAdminClient();
        const { data: staffRow } = await admin
          .from('saf_staff_users')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!staffRow) {
          const url = request.nextUrl.clone();
          url.pathname = '/setu';
          url.searchParams.set('error', 'not_staff');
          return NextResponse.redirect(url);
        }
      } catch {
        const url = request.nextUrl.clone();
        url.pathname = '/setu';
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
