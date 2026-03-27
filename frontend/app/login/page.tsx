'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiFetch } from '@/lib/api'

type Tab = 'signin' | 'signup'

export default function LoginPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const body = tab === 'signup'
        ? { name, email, password }
        : { email, password }
      const res = await apiFetch(tab === 'signup' ? '/api/auth/signup' : '/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.detail ?? 'Something went wrong. Please try again.')
        return
      }
      router.push('/dashboard')
    } catch {
      setError('Unable to connect. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-brand-navy text-white shadow-lg">
        <div className="px-6 py-4 flex items-center gap-3">
          <div className="w-7 h-7 bg-brand-yellow rounded flex items-center justify-center">
            <span className="text-brand-navy font-black text-xs">PL</span>
          </div>
          <h1 className="text-lg font-bold tracking-tight">Prelegal</h1>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => { setTab('signin'); setError('') }}
              className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
                tab === 'signin'
                  ? 'text-brand-navy border-b-2 border-brand-blue'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => { setTab('signup'); setError('') }}
              className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
                tab === 'signup'
                  ? 'text-brand-navy border-b-2 border-brand-blue'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Create account
            </button>
          </div>

          <div className="p-7">
            <p className="text-2xl font-bold text-brand-navy mb-1">
              {tab === 'signin' ? 'Welcome back' : 'Get started'}
            </p>
            <p className="text-sm text-brand-gray mb-6">
              {tab === 'signin'
                ? 'Sign in to your Prelegal account.'
                : 'Create your free Prelegal account.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === 'signup' && (
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Full name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Jane Smith"
                    autoComplete="name"
                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="jane@company.com"
                  autoComplete="email"
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder={tab === 'signup' ? 'At least 8 characters' : ''}
                  autoComplete={tab === 'signup' ? 'new-password' : 'current-password'}
                  minLength={tab === 'signup' ? 8 : undefined}
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                />
              </div>

              {error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-purple text-white font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity text-sm disabled:opacity-60 mt-1"
              >
                {loading ? 'Please wait…' : tab === 'signin' ? 'Sign in' : 'Create account'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
