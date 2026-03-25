'use client'

import { useEffect, useState } from 'react'
import NdaForm from '@/components/NdaForm'
import NdaDocument from '@/components/NdaDocument'
import { NdaFormData, defaultFormData } from '@/lib/types'

export default function Home() {
  const [formData, setFormData] = useState<NdaFormData>(defaultFormData)
  const [view, setView] = useState<'form' | 'preview'>('form')

  // Set today's date on mount to avoid SSR/hydration mismatch
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      effectiveDate: new Date().toISOString().split('T')[0],
    }))
  }, [])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-blue-900 text-white shadow-lg print:hidden">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight">Prelegal</h1>
            <p className="text-blue-300 text-xs">Mutual NDA Creator</p>
          </div>
          {view === 'preview' && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setView('form')}
                className="text-sm text-blue-200 hover:text-white border border-blue-700 hover:border-blue-400 px-3 py-1.5 rounded transition-colors"
              >
                ← Edit
              </button>
              <button
                onClick={() => window.print()}
                className="text-sm bg-white text-blue-900 font-semibold px-4 py-1.5 rounded hover:bg-blue-50 transition-colors"
              >
                Print / Download PDF
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4 print:p-0 print:max-w-none">
        {view === 'form' ? (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">Create Mutual NDA</h2>
              <p className="text-gray-500 text-sm mt-1">
                Fill in the details below to generate your Mutual Non-Disclosure Agreement.
              </p>
            </div>
            <NdaForm data={formData} onChange={setFormData} onSubmit={() => setView('preview')} />
          </div>
        ) : (
          <div>
            <div className="mb-6 print:hidden">
              <p className="text-gray-500 text-sm">
                Review your document below. Use <strong>Print / Download PDF</strong> to save a copy.
              </p>
            </div>
            <NdaDocument data={formData} />
          </div>
        )}
      </main>
    </div>
  )
}
