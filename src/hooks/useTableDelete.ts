import { useState } from 'react'
import { supabase } from '../lib/supabase'

export interface ConfirmDeleteOptions {
  table: string
  id: string | number
  onSuccess?: () => void | Promise<void>
}

export function useTableDelete() {
  const [pendingDeleteId, setPendingDeleteId] = useState<string | number | null>(null)
  const [deletingId, setDeletingId] = useState<string | number | null>(null)
  const [error, setError] = useState<string | null>(null)

  function requestDelete(id: string | number) {
    setError(null)
    setPendingDeleteId(id)
  }

  function cancelDelete() {
    setPendingDeleteId(null)
  }

  async function confirmDelete({ table, id, onSuccess }: ConfirmDeleteOptions) {
    setDeletingId(id)
    setError(null)

    try {
      const { error } = await supabase.from(table).delete().eq('id', id)

      if (error) {
        setError(error.message)
        setDeletingId(null)
        return false
      }

      setPendingDeleteId(null)
      setDeletingId(null)
      await onSuccess?.()
      return true
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unexpected delete error.')
      setDeletingId(null)
      return false
    }
  }

  return {
    pendingDeleteId,
    deletingId,
    error,
    requestDelete,
    cancelDelete,
    confirmDelete,
  }
}
