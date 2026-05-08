export interface PasswordValidation {
  minLength: boolean    // >= 8 characters
  hasUppercase: boolean // at least one A-Z
  hasNumber: boolean    // at least one 0-9
  hasSpecial: boolean   // at least one special character
  isValid: boolean      // all four pass
}

export function validatePassword(password: string): PasswordValidation {
  const minLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)
  return {
    minLength,
    hasUppercase,
    hasNumber,
    hasSpecial,
    isValid: minLength && hasUppercase && hasNumber && hasSpecial,
  }
}

export function getPasswordStrength(validation: PasswordValidation): 'weak' | 'fair' | 'strong' {
  const score = [
    validation.minLength,
    validation.hasUppercase,
    validation.hasNumber,
    validation.hasSpecial,
  ].filter(Boolean).length

  if (score <= 2) return 'weak'
  if (score === 3) return 'fair'
  return 'strong'
}

export const PASSWORD_REQUIREMENTS = [
  { key: 'minLength' as const,   label: 'At least 8 characters' },
  { key: 'hasUppercase' as const, label: 'One uppercase letter' },
  { key: 'hasNumber' as const,    label: 'One number' },
  { key: 'hasSpecial' as const,   label: 'One special character (!@#$…)' },
]
