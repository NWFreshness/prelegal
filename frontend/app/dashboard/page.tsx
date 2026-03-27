'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { apiFetch } from '@/lib/api'
import DocumentHistory from '@/components/DocumentHistory'

const TOOLS = [
  {
    title: 'Mutual NDA Creator',
    description: 'Draft a Mutual Non-Disclosure Agreement with key terms filled in via AI chat.',
    href: '/nda-creator',
    available: true,
  },
  {
    title: 'Cloud Service Agreement',
    description: 'Generate a Cloud Service Agreement for SaaS products.',
    href: '#',
    available: false,
  },
  {
    title: 'Professional Services Agreement',
    description: 'Create a Professional Services Agreement for consulting engagements.',
    href: '#',
    available: false,
  },
  {
    title: 'Data Processing Agreement',
    description: 'Prepare a GDPR-compliant Data Processing Agreement.',
    href: '#',
    available: false,
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    apiFetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => setUserName(d.name ?? null))
      .catch(() => null)
  }, [])

  async function handleLogout() {
    await apiFetch('/api/auth/logout', { method: 'POST' }).catch(() => null)
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-brand-navy text-white shadow-lg flex-shrink-0">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-brand-yellow rounded flex items-center justify-center flex-shrink-0">
              <span className="text-brand-navy font-black text-xs">PL</span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight leading-none">Prelegal</h1>
              {userName && (
                <p className="text-brand-blue/70 text-xs mt-0.5">Welcome back, {userName}</p>
              )}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm border border-white/30 text-white font-medium px-4 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="flex-1 p-8 max-w-5xl mx-auto w-full space-y-10">
        {/* Legal Tools */}
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Legal Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TOOLS.map((tool) => (
              <div
                key={tool.title}
                className={`bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3 shadow-sm transition-shadow hover:shadow-md ${
                  !tool.available ? 'opacity-50' : ''
                }`}
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-brand-navy text-sm">{tool.title}</h3>
                  <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">{tool.description}</p>
                </div>
                {tool.available ? (
                  <Link
                    href={tool.href}
                    className="text-xs font-semibold text-brand-blue hover:underline"
                  >
                    Open →
                  </Link>
                ) : (
                  <span className="text-xs text-gray-400">Coming soon</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Document History */}
        <DocumentHistory />
      </main>
    </div>
  )
}
