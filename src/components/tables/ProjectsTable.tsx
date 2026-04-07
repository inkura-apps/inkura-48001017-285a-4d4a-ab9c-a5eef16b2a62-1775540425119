import { useEffect, useMemo, useState } from 'react'
import { useTableDelete } from '../../hooks/useTableDelete'
import { useTableQuery } from '../../hooks/useTableQuery'

type SortDirection = 'asc' | 'desc' | null

type RowRecord = Record<string, unknown> & {
  id?: string | number
}

type ColumnConfig = {
  field: string
  label: string
  sortable?: boolean
  filterable?: boolean
  filterOptions?: string[]
  format?: 'date' | 'currency'
}

type ActionConfig = {
  label: string
  type: 'link' | 'delete'
  href?: string
  confirm?: boolean
}

const columns: ColumnConfig[] = [
  {
    "field": "title",
    "label": "Title",
    "sortable": true
  },
  {
    "field": "status",
    "label": "Status",
    "sortable": true,
    "filterable": true,
    "filterOptions": [
      "draft",
      "active",
      "completed"
    ]
  }
]
const actions: ActionConfig[] = [
  {
    "label": "Edit",
    "type": "link",
    "href": "/projects/:id/edit"
  },
  {
    "label": "Delete",
    "type": "delete",
    "confirm": true
  }
]
const searchFields = [
  "title"
]
const defaultPageSize = 10
const enablePagination = true
const enableSearch = true

function formatCellValue(value: unknown, format?: 'date' | 'currency') {
  if (value === null || value === undefined || value === '') return '—'

  if (format === 'date') {
    const date = new Date(String(value))
    return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString()
  }

  if (format === 'currency') {
    const numericValue = typeof value === 'number' ? value : Number(value)
    if (!Number.isFinite(numericValue)) return String(value)
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'USD',
    }).format(numericValue)
  }

  return String(value)
}

function buildActionHref(template: string, row: RowRecord) {
  return template.replace(':id', String(row.id ?? ''))
}

export function ProjectsTable() {
  const [page, setPage] = useState(1)
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  const [searchValue, setSearchValue] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>(() => Object.fromEntries(
    columns
      .filter(column => column.filterable)
      .map(column => [column.field, ''])
  ))

  const { rows, totalCount, loading, error, refresh } = useTableQuery<RowRecord>({
    table: "projects",
    page,
    pageSize: defaultPageSize,
    sortField,
    sortDirection,
    filters,
    search: debouncedSearch,
    searchable: enableSearch,
    searchFields,
  })

  const {
    pendingDeleteId,
    deletingId,
    error: deleteError,
    requestDelete,
    cancelDelete,
    confirmDelete,
  } = useTableDelete()

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedSearch(searchValue), 300)
    return () => window.clearTimeout(timeout)
  }, [searchValue])

  const filterSignature = JSON.stringify(filters)

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, filterSignature, sortField, sortDirection])

  const totalPages = enablePagination ? Math.max(1, Math.ceil(totalCount / defaultPageSize)) : 1

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index + 1),
    [totalPages]
  )

  function toggleSort(field: string) {
    if (sortField !== field) {
      setSortField(field)
      setSortDirection('asc')
      return
    }

    if (sortDirection === 'asc') {
      setSortDirection('desc')
      return
    }

    if (sortDirection === 'desc') {
      setSortField(null)
      setSortDirection(null)
      return
    }

    setSortDirection('asc')
  }

  async function handleDelete(id: string | number) {
    await confirmDelete({
      table: "projects",
      id,
      onSuccess: async () => {
        refresh()
      },
    })
  }

  function handleLink(href: string, row: RowRecord) {
    if (typeof window === 'undefined') return
    window.location.href = buildActionHref(href, row)
  }

  return (
    <section className="table-layout">
      <div className="table-toolbar">
        {enableSearch ? (
          <input
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search rows"
            className="table-search-input"
          />
        ) : null}

        
        <div className="table-filters">
          <label className="table-filter-control">
            <span>Status</span>
            <select
              value={filters.status}
              onChange={(event) => setFilters(previous => ({ ...previous, status: event.target.value }))}
            >
              <option value="">All</option>
              <option value="draft">draft</option>
              <option value="active">active</option>
              <option value="completed">completed</option>
            </select>
          </label>
        </div>

      </div>

      {(error || deleteError) ? <p className="table-error">{deleteError ?? error}</p> : null}

      {loading ? (
        <div className="table-skeleton" aria-label="Loading table data">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="table-skeleton-row animate-pulse" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="table-empty-state">
          <p>No rows found.</p>
        </div>
      ) : (
        <>
          <div className="table-shell">
            <table className="data-table">
              <thead>
                <tr>
                  {columns.map(column => (
                    <th key={column.field}>
                      {column.sortable ? (
                        <button
                          type="button"
                          onClick={() => toggleSort(column.field)}
                          className="table-sort-button"
                        >
                          {column.label}
                          {sortField === column.field && sortDirection === 'asc' ? ' ↑' : ''}
                          {sortField === column.field && sortDirection === 'desc' ? ' ↓' : ''}
                        </button>
                      ) : (
                        column.label
                      )}
                    </th>
                  ))}
                  {actions.length > 0 ? <th>Actions</th> : null}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => {
                  const rowId = row.id ?? index
                  return (
                    <tr key={String(rowId)}>
                      {columns.map(column => (
                        <td key={column.field}>{formatCellValue(row[column.field], column.format)}</td>
                      ))}
                      {actions.length > 0 ? (
                        <td>
                          <div className="table-actions">
                            {pendingDeleteId === rowId ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(rowId)}
                                  disabled={deletingId === rowId}
                                  className="table-delete-confirm"
                                >
                                  {deletingId === rowId ? 'Deleting...' : 'Confirm delete'}
                                </button>
                                <button type="button" onClick={cancelDelete} className="table-delete-cancel">
                                  Cancel
                                </button>
                              </>
                            ) : (
                              actions.map(action => {
                                if (action.type === 'link' && action.href) {
                                  return (
                                    <button
                                      key={action.label}
                                      type="button"
                                      onClick={() => handleLink(action.href as string, row)}
                                      className="table-action-link"
                                    >
                                      {action.label}
                                    </button>
                                  )
                                }

                                if (action.type === 'delete') {
                                  return (
                                    <button
                                      key={action.label}
                                      type="button"
                                      onClick={() => requestDelete(rowId)}
                                      className="table-action-delete"
                                    >
                                      {action.label}
                                    </button>
                                  )
                                }

                                return null
                              })
                            )}
                          </div>
                        </td>
                      ) : null}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {enablePagination ? (
            <nav className="table-pagination" aria-label="Table pagination">
              <button type="button" onClick={() => setPage(current => Math.max(1, current - 1))} disabled={page === 1}>
                Previous
              </button>
              {pageNumbers.map(pageNumber => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  aria-current={pageNumber === page ? 'page' : undefined}
                >
                  {pageNumber}
                </button>
              ))}
              <button type="button" onClick={() => setPage(current => Math.min(totalPages, current + 1))} disabled={page === totalPages}>
                Next
              </button>
            </nav>
          ) : null}
        </>
      )}
    </section>
  )
}

export default ProjectsTable
