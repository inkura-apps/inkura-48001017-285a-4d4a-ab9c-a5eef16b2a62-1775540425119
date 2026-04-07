export function required(value: unknown, label = 'This field'): string | null {
  if (typeof value === 'boolean') {
    return value ? null : label + ' is required.'
  }

  if (value === null || value === undefined) {
    return label + ' is required.'
  }

  if (typeof value === 'string' && value.trim() === '') {
    return label + ' is required.'
  }

  return null
}

export function minLength(value: unknown, minimum: number, label = 'This field'): string | null {
  if (typeof value !== 'string') return label + ' must be text.'
  return value.trim().length >= minimum ? null : label + ' must be at least ' + minimum + ' characters.'
}

export function maxLength(value: unknown, maximum: number, label = 'This field'): string | null {
  if (typeof value !== 'string') return label + ' must be text.'
  return value.trim().length <= maximum ? null : label + ' must be at most ' + maximum + ' characters.'
}

export function isEmail(value: unknown, label = 'Email'): string | null {
  if (typeof value !== 'string') return label + ' must be a valid email address.'
  const emailPattern = /^[^s@]+@[^s@]+.[^s@]+$/
  return emailPattern.test(value.trim()) ? null : label + ' must be a valid email address.'
}

export function isNumber(value: unknown, label = 'This field'): string | null {
  if (value === '' || value === null || value === undefined) return null
  const numericValue = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(numericValue) ? null : label + ' must be a number.'
}

export function min(value: unknown, minimum: number, label = 'This field'): string | null {
  if (value === '' || value === null || value === undefined) return null
  const numericValue = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(numericValue)) return label + ' must be a number.'
  return numericValue >= minimum ? null : label + ' must be at least ' + minimum + '.'
}

export function max(value: unknown, maximum: number, label = 'This field'): string | null {
  if (value === '' || value === null || value === undefined) return null
  const numericValue = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(numericValue)) return label + ' must be a number.'
  return numericValue <= maximum ? null : label + ' must be at most ' + maximum + '.'
}
