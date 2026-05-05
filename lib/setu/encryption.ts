// lib/setu/encryption.ts
// Server-only — never import from Client Components

/**
 * Encrypts an IBAN using AES-256-GCM via the Web Crypto API.
 * The key is derived from SUPABASE_SERVICE_ROLE_KEY via PBKDF2.
 */
export async function encryptIban(iban: string): Promise<{
  encrypted: string
  lastFour: string
}> {
  const cleaned = iban.replace(/\s/g, '').toUpperCase()
  const lastFour = cleaned.slice(-4)

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(process.env.SUPABASE_SERVICE_ROLE_KEY!.slice(0, 32)),
    'PBKDF2',
    false,
    ['deriveKey']
  )

  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: new TextEncoder().encode('punt-saf-iban'), iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )

  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(cleaned))

  const combined = new Uint8Array(iv.length + encrypted.byteLength)
  combined.set(iv)
  combined.set(new Uint8Array(encrypted), iv.length)

  return {
    encrypted: btoa(String.fromCharCode(...combined)),
    lastFour,
  }
}

/**
 * Returns a masked IBAN for display: IE**5678
 * Never returns the full IBAN.
 */
export async function decryptIbanMasked(encryptedB64: string, lastFour: string): Promise<string> {
  if (!encryptedB64) return 'IBAN unavailable'
  return `IE**${lastFour}`
}
