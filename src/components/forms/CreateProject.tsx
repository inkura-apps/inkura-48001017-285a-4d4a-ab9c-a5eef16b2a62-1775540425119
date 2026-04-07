import { useMemo, useState } from 'react'
import { useFormSubmit } from '../../hooks/useFormSubmit'
import { isEmail, isNumber, max, maxLength, min, minLength, required } from '../../lib/validation'

type CreateProjectValues = {
  title: string
  description: string
  status: string
}

type CreateProjectErrors = Partial<Record<keyof CreateProjectValues, string>>

export interface CreateProjectProps {
  initialValues?: Partial<CreateProjectValues>
  recordId?: string | number | null
  onSuccess?: (data: unknown) => void
}

export function CreateProject({ initialValues = {}, recordId = null, onSuccess }: CreateProjectProps) {
  const defaultValues = useMemo<CreateProjectValues>(() => ({
    title: initialValues.title ?? '',
    description: initialValues.description ?? '',
    status: initialValues.status ?? "draft",
  }), [initialValues])
  const [values, setValues] = useState<CreateProjectValues>(defaultValues)
  const [errors, setErrors] = useState<CreateProjectErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { submitForm } = useFormSubmit()

  function validateField(name: keyof CreateProjectValues, value: CreateProjectValues[keyof CreateProjectValues]): string | null {
    switch (name) {
    case 'title': {
  const requiredError = required(value, 'Project Title')
  if (requiredError) return requiredError
  return null
    }
    case 'description': {
  return null
    }
    case 'status': {
  const requiredError = required(value, 'Status')
  if (requiredError) return requiredError
  return null
    }
      default:
        return null
    }
  }

  function validateForm(currentValues: CreateProjectValues) {
    const nextErrors: CreateProjectErrors = {
      title: validateField('title', currentValues.title) ?? undefined,
      description: validateField('description', currentValues.description) ?? undefined,
      status: validateField('status', currentValues.status) ?? undefined,
    }

    const filteredEntries = Object.entries(nextErrors).filter(([, value]) => Boolean(value))
    return Object.fromEntries(filteredEntries) as CreateProjectErrors
  }

  function setFieldValue(name: keyof CreateProjectValues, value: CreateProjectValues[keyof CreateProjectValues]) {
    setValues(previous => ({ ...previous, [name]: value }))
    setErrors(previous => ({ ...previous, [name]: undefined }))
  }

  function handleBlur(name: keyof CreateProjectValues) {
    const message = validateField(name, values[name])
    setErrors(previous => ({ ...previous, [name]: message ?? undefined }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)

    const nextErrors = validateForm(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setFormError('Please fix the highlighted fields and try again.')
      return
    }

    setLoading(true)

    const payload = {
    title: values.title,
    description: values.description,
    status: values.status,
    }

    const result = await submitForm({
      table: "projects",
      action: 'insert',
      values: payload,
      recordId,
    })

    setLoading(false)

    if (result.error) {
      setFormError(result.error)
      return
    }

    onSuccess?.(result.data)

    
    if (typeof window !== 'undefined') {
      window.location.href = '/projects'
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="form-layout">
      <div className="form-field">
        <label htmlFor="CreateProject-title" className="form-label">
          Project Title<span className="text-red-600"> *</span>
        </label>
        <input
          id="CreateProject-title"
          name="title"
          type="text"
          placeholder={undefined}
          value={values.title}
          onChange={(event) => setFieldValue('title', event.target.value)}
          onBlur={() => handleBlur('title')}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? 'CreateProject-title-error' : undefined}
          className="form-input"
        />
        {errors.title ? <p id="CreateProject-title-error" className="form-error">{errors.title}</p> : null}
      </div>

      <div className="form-field">
        <label htmlFor="CreateProject-description" className="form-label">
          Description
        </label>
        <textarea
          id="CreateProject-description"
          name="description"
          placeholder={undefined}
          value={values.description}
          onChange={(event) => setFieldValue('description', event.target.value)}
          onBlur={() => handleBlur('description')}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? 'CreateProject-description-error' : undefined}
          rows={4}
          className="form-textarea"
        />
        {errors.description ? <p id="CreateProject-description-error" className="form-error">{errors.description}</p> : null}
      </div>

      <div className="form-field">
        <label htmlFor="CreateProject-status" className="form-label">
          Status<span className="text-red-600"> *</span>
        </label>
        <select
          id="CreateProject-status"
          name="status"
          value={values.status}
          onChange={(event) => setFieldValue('status', event.target.value)}
          onBlur={() => handleBlur('status')}
          aria-invalid={Boolean(errors.status)}
          aria-describedby={errors.status ? 'CreateProject-status-error' : undefined}
          className="form-select"
        >
          <option value="">Select an option</option>
          <option value="draft">draft</option>
          <option value="active">active</option>
          <option value="completed">completed</option>
          <option value="archived">archived</option>
        </select>
        {errors.status ? <p id="CreateProject-status-error" className="form-error">{errors.status}</p> : null}
      </div>

      {formError ? <p className="form-error form-error-global">{formError}</p> : null}

      <button type="submit" disabled={loading} className="form-submit-button">
        {loading ? 'Saving...' : "Create Project"}
      </button>
    </form>
  )
}

export default CreateProject
