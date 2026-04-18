interface ValidationResult {
  errors: Record<string, string>
  isValid: boolean
}

const EMAIL_RE = /^\S+@\S+\.\S+$/

export const validateRegistration = (data: Record<string, string>): ValidationResult => {
  const errors: Record<string, string> = {}

  if (!data.name || data.name.trim().length < 2)
    errors.name = 'Name must be at least 2 characters'

  if (!data.email || !EMAIL_RE.test(data.email))
    errors.email = 'Please enter a valid email'

  if (!data.password || data.password.length < 6)
    errors.password = 'Password must be at least 6 characters'

  if (data.password !== data.confirmPassword)
    errors.confirmPassword = 'Passwords do not match'

  return { errors, isValid: Object.keys(errors).length === 0 }
}

export const validateLogin = (data: Record<string, string>): ValidationResult => {
  const errors: Record<string, string> = {}

  if (!data.email || !EMAIL_RE.test(data.email))
    errors.email = 'Please enter a valid email'

  if (!data.password)
    errors.password = 'Password is required'

  return { errors, isValid: Object.keys(errors).length === 0 }
}
