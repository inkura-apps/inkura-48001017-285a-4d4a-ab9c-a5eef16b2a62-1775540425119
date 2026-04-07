import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthContext } from '../contexts/AuthContext'

export interface UserProfile {
  id: string
  display_name: string | null
  role: string
  created_at: string
  updated_at: string
}

export function useUser() {
  const { user, loading: authLoading } = useAuthContext()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setProfile(data)
        setLoading(false)
      })
  }, [user, authLoading])

  const refreshProfile = async () => {
    if (!user) return
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    setProfile(data)
  }

  return { profile, loading: authLoading || loading, error, refreshProfile }
}
