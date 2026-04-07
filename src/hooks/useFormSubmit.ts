import { supabase } from '../lib/supabase'

export interface SubmitFormOptions {
  table: string
  action: 'insert' | 'update'
  values: Record<string, unknown>
  recordId?: string | number | null
}

export interface SubmitFormResult {
  data: unknown
  error: string | null
}

async function runSubmit({ table, action, values, recordId }: SubmitFormOptions): Promise<SubmitFormResult> {
  try {
    if (action === 'insert') {
      const { data, error } = await supabase.from(table).insert([values]).select().single()
      if (error) return { data: null, error: error.message }
      return { data, error: null }
    }

    if (!recordId) {
      return { data: null, error: 'recordId is required for update actions.' }
    }

    const { data, error } = await supabase.from(table).update(values).eq('id', recordId).select().single()
    if (error) return { data: null, error: error.message }
    return { data, error: null }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unexpected form submission error.',
    }
  }
}

export function useFormSubmit() {
  return {
    submitForm: runSubmit,
  }
}

export { runSubmit as submitForm }
