import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('../../src/hooks/useFormSubmit', () => ({
  useFormSubmit: () => ({
    submitForm: vi.fn().mockResolvedValue({ data: null, error: null }),
  }),
}))

import { CreateProject } from '../../src/components/forms/CreateProject'

describe('CreateProject', () => {
  it('renders all form fields', () => {
    render(<CreateProject />)
    expect(screen.getByLabelText('Project Title')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
    expect(screen.getByLabelText('Status')).toBeInTheDocument()
  })

  it('submit button is enabled initially', () => {
    render(<CreateProject />)
    expect(screen.getByRole('button', { name: /create project/i })).not.toBeDisabled()
  })

  it('shows validation errors for required fields on empty submit', async () => {
    render(<CreateProject />)
    fireEvent.click(screen.getByRole('button', { name: /create project/i }))
    await screen.findByText('Project Title is required.')
    await screen.findByText('Status is required.')
  })

  it('disables submit button while loading', async () => {
    let resolveSubmit!: (v: unknown) => void
    vi.mocked(
      (await import('../../src/hooks/useFormSubmit')).useFormSubmit,
    ).mockReturnValueOnce({
      submitForm: () =>
        new Promise(resolve => {
          resolveSubmit = resolve
        }),
    })

    render(<CreateProject />)
    fireEvent.change(screen.getByLabelText('Project Title'), { target: { value: 'Test Project Title' } })
    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'draft' } })
    fireEvent.click(screen.getByRole('button', { name: /create project/i }))
    expect(screen.getByRole('button', { name: /\.\.\.|loading/i })).toBeDisabled()
    resolveSubmit?.({ data: null, error: null })
  })
})
