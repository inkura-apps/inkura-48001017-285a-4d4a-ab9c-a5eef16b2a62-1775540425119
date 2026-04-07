import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../../hooks/useAuth'

export default function LoginPage() {
  const navigate = useNavigate()
  
  const mode = 'email'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleEmail = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await login(email, password)
    if (error) { setError(error); setLoading(false) }
    else navigate('/dashboard', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          
          
          
          
          
      {mode === 'email' && (
        <form onSubmit={handleEmail} className="flex flex-col gap-4" noValidate>
          <Field label="Email address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" required autoFocus />
          <div>
            <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" required />
            <div className="flex justify-end mt-1">
              <Link to="/forgot-password" className="text-xs text-gray-500 hover:text-gray-800">Forgot password?</Link>
            </div>
          </div>
          {error && <ErrorBox message={error} />}
          <SubmitButton loading={loading}>Sign in</SubmitButton>
        </form>
      )}
          
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-gray-900 hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  )
}

// ── Shared primitives ──────────────────────────────────────────────────────────

function Field({ label, type, value, onChange, placeholder, required, autoFocus }: {
  label: string; type: string; value: string; onChange: (v: string) => void
  placeholder?: string; required?: boolean; autoFocus?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} required={required} autoFocus={autoFocus}
        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 bg-white focus:border-gray-400 focus:ring-2 focus:ring-gray-100 outline-none transition-colors"
      />
    </div>
  )
}

function SubmitButton({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return (
    <button type="submit" disabled={loading}
      className="w-full py-2.5 px-4 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
      {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  )
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{message}</div>
  )
}
