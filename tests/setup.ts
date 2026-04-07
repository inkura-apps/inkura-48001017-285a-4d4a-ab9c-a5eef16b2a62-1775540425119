import '@testing-library/jest-dom'
import { vi } from 'vitest'

// ── Supabase mock ───────────────────────────────────────────��─────────────────
// All supabase calls are intercepted globally. Individual tests can override
// specific methods via vi.mocked(supabase.from).mockReturnValueOnce(...).

const mockChain: Record<string, unknown> = {}
;([
  'select', 'insert', 'update', 'delete', 'upsert',
  'eq', 'neq', 'gt', 'lt', 'gte', 'lte', 'in', 'not', 'is',
  'order', 'limit', 'range', 'ilike', 'filter',
  'single', 'maybeSingle',
] as const).forEach(method => {
  mockChain[method] = vi.fn().mockReturnValue(mockChain)
})

// Make the chain awaitable — resolves to empty result by default
;(mockChain as any).then = (
  resolve: (v: { data: unknown[]; error: null; count: number }) => unknown,
  reject: (e: unknown) => unknown,
) => Promise.resolve({ data: [], error: null, count: 0 }).then(resolve, reject)

vi.mock('../src/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
      signInWithPassword: vi.fn().mockResolvedValue({ data: {}, error: null }),
      signUp: vi.fn().mockResolvedValue({ data: {}, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
    from: vi.fn().mockReturnValue(mockChain),
  },
}))
