import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)

  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/home'

  const supabase = await createClient()

  // Handle PKCE token_hash flow (used by password reset and email confirmation)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as 'recovery' | 'signup' | 'email',
      token_hash,
    })

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }

    // Token expired or invalid
    return NextResponse.redirect(
      `${origin}/sign-in?message=${encodeURIComponent(
        type === 'recovery'
          ? 'Your password reset link has expired. Please request a new one.'
          : 'Your verification link has expired. Please sign in to request a new one.'
      )}`
    )
  }

  // Handle auth code flow (used by OAuth)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Fallback error
  return NextResponse.redirect(
    `${origin}/sign-in?message=${encodeURIComponent(
      'Something went wrong. Please try again.'
    )}`
  )
}
