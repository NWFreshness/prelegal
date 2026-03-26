'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CREDENTIALS = {
  email: 'admin@prelegal.com',
  password: 'password123',
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email === CREDENTIALS.email && password === CREDENTIALS.password) {
      document.cookie = 'prelegal-auth=1; path=/'
      router.push('/dashboard')
    } else {
      setError('Invalid email or password.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="px-6 py-3">
          <h1 className="text-lg font-bold tracking-tight">Prelegal</h1>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-md w-full max-w-sm p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Sign in</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-900 text-white font-semibold py-2 rounded hover:bg-blue-800 transition-colors text-sm"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
