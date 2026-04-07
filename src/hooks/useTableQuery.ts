import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export interface TableQueryOptions {
  table: string
  page: number
  pageSize: number
  sortField?: string | null
  sortDirection?: 'asc' | 'desc' | null
  filters?: Record<string, string>
  search?: string
  searchable?: boolean
  searchFields?: string[]
}

export interface TableQueryResult<T> {
  rows: T[]
  totalCount: number
  loading: boolean
  error: string | null
  refresh: () => void
}

export function useTableQuery<T = Record<string, unknown>>({
  table,
  page,
  pageSize,
  sortField = null,
  sortDirection = null,
  filters = {},
  search = '',
  searchable = false,
  searchFields = [],
}: TableQueryOptions): TableQueryResult<T> {
  const [rows, setRows] = useState<T[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState(0)

  useEffect(() => {
    let active = true

    async function loadRows() {
      setLoading(true)
      setError(null)

      try {
        let query = supabase.from(table).select('*', { count: 'exact' })

        for (const [field, value] of Object.entries(filters)) {
          if (value) {
            query = query.eq(field, value)
          }
        }

        if (searchable && search.trim() && searchFields.length > 0) {
          const pattern = '%' + search.trim() + '%'
          const clauses = searchFields.map(field => field + '.ilike.' + pattern)
          query = query.or(clauses.join(','))
        }

        if (sortField && sortDirection) {
          query = query.order(sortField, { ascending: sortDirection === 'asc' })
        }

        const from = Math.max(0, (page - 1) * pageSize)
        const to = from + pageSize - 1

        const { data, error, count } = await query.range(from, to)

        if (!active) return

        if (error) {
          setError(error.message)
          setRows([])
          setTotalCount(0)
          setLoading(false)
          return
        }

        setRows((data ?? []) as T[])
        setTotalCount(count ?? 0)
        setLoading(false)
      } catch (queryError) {
        if (!active) return
        setError(queryError instanceof Error ? queryError.message : 'Unexpected table query error.')
        setRows([])
        setTotalCount(0)
        setLoading(false)
      }
    }

    loadRows()

    return () => {
      active = false
    }
  }, [table, page, pageSize, sortField, sortDirection, search, searchable, searchFields.join('|'), JSON.stringify(filters), refreshToken])

  return {
    rows,
    totalCount,
    loading,
    error,
    refresh: () => setRefreshToken(value => value + 1),
  }
}
