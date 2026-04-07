import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/hooks/useTableQuery', () => ({
  useTableQuery: vi.fn().mockReturnValue({
    rows: [],
    totalCount: 0,
    loading: true,
    error: null,
    refresh: vi.fn(),
  }),
}))

vi.mock('../../src/hooks/useTableDelete', () => ({
  useTableDelete: vi.fn().mockReturnValue({
    pendingDeleteId: null,
    deletingId: null,
    error: null,
    requestDelete: vi.fn(),
    cancelDelete: vi.fn(),
    confirmDelete: vi.fn(),
  }),
}))

import { useTableQuery } from '../../src/hooks/useTableQuery'
import { ProjectsTable } from '../../src/components/tables/ProjectsTable'

const mockUseTableQuery = vi.mocked(useTableQuery)

describe('ProjectsTable', () => {
  it('shows loading skeleton initially', () => {
    mockUseTableQuery.mockReturnValue({
      rows: [],
      totalCount: 0,
      loading: true,
      error: null,
      refresh: vi.fn(),
    })
    const { container } = render(<ProjectsTable />)
    expect(container.querySelector('[aria-label="Loading table data"]')).toBeInTheDocument()
  })

  it('renders column headers when data is loaded', () => {
    mockUseTableQuery.mockReturnValue({
      rows: [{"id":"row-1","title":"sample-0","status":"sample-1"}],
      totalCount: 1,
      loading: false,
      error: null,
      refresh: vi.fn(),
    })
    render(<ProjectsTable />)
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  it('shows empty state when no rows returned', () => {
    mockUseTableQuery.mockReturnValue({
      rows: [],
      totalCount: 0,
      loading: false,
      error: null,
      refresh: vi.fn(),
    })
    render(<ProjectsTable />)
    expect(screen.getByText('No rows found.')).toBeInTheDocument()
  })

  it('renders without crashing with default props', () => {
    mockUseTableQuery.mockReturnValue({
      rows: [],
      totalCount: 0,
      loading: false,
      error: null,
      refresh: vi.fn(),
    })
    const { container } = render(<ProjectsTable />)
    expect(container.firstChild).toBeTruthy()
  })
})
