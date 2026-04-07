import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { updatePassword } from '../../hooks/useAuth'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setError(null)
    setLoading(true)
    const { error } = await updatePassword(password)
    setLoading(false)
    if (error) setError(error)
    else navigate('/dashboard', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Choose a new password</h1>
          <p className="text-gray-500 text-sm mt-1">Make it strong</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            {[
              { label: 'New password', value: password, onChange: setPassword, placeholder: 'Min. 8 characters', autoFocus: true },
              { label: 'Confirm password', value: confirm, onChange: setConfirm, placeholder: 'Repeat your password' },
            ].map(f => (
              <div key={f.label} className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">{f.label}</label>
                <input type="password" value={f.value} onChange={e => f.onChange(e.target.value)}
                  placeholder={f.placeholder} autoFocus={f.autoFocus} required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 outline-none transition-colors" />
              </div>
            ))}
            {error && (
              <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
            )}
            <button type="submit" disabled={loading}
              className="w-full py-2.5 px-4 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
              {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              Update password
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
