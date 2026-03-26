'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { catalog } from '@/lib/catalog'

export default function DashboardPage() {
  const router = useRouter()

  function handleLogout() {
    document.cookie = 'prelegal-auth=; path=/; max-age=0'
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-blue-900 text-white shadow-lg flex-shrink-0">
        <div className="px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight">Prelegal</h1>
            <p className="text-blue-300 text-xs">Dashboard</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm bg-white text-blue-900 font-semibold px-4 py-1.5 rounded hover:bg-blue-50 transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="flex-1 p-8">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">
          Legal Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
          {catalog.map((entry) => (
            <div
              key={entry.name}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex flex-col gap-3"
            >
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">{entry.name}</h3>
                <p className="text-gray-500 text-xs mt-1">{entry.description}</p>
              </div>
              <Link
                href={`/document-creator?type=${encodeURIComponent(entry.name)}`}
                className="mt-auto text-xs font-semibold text-blue-900 hover:underline"
              >
                Open &rarr;
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
