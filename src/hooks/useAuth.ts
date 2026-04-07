import { supabase } from '../lib/supabase'

export interface AuthError {
  error: string | null
}

export async function login(email: string, password: string): Promise<AuthError> {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  return { error: error?.message ?? null }
}

export async function signup(
  email: string,
  password: string,
  metadata: Record<string, string> = {}
): Promise<AuthError> {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      emailRedirectTo: window.location.origin + '/dashboard',
    },
  })
  return { error: error?.message ?? null }
}

export async function requestPasswordReset(email: string): Promise<AuthError> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/reset-password',
  })
  return { error: error?.message ?? null }
}

export async function updatePassword(newPassword: string): Promise<AuthError> {
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  return { error: error?.message ?? null }
}


