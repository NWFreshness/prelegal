'use client'

import { useEffect, useState } from 'react'
import NdaForm from '@/components/NdaForm'
import NdaDocument from '@/components/NdaDocument'
import { NdaFormData, defaultFormData } from '@/lib/types'

export default function Home() {
  const [formData, setFormData] = useState<NdaFormData>(defaultFormData)

  // Set today's date on mount to avoid SSR/hydration mismatch
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      effectiveDate: new Date().toISOString().split('T')[0],
    }))
  }, [])

  return (
    <div className="h-screen flex flex-col">
      {/* Fixed header */}
      <header className="bg-blue-900 text-white shadow-lg flex-shrink-0 print:hidden">
        <div className="px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight">Prelegal</h1>
            <p className="text-blue-300 text-xs">Mutual NDA Creator</p>
          </div>
          <button
            onClick={() => window.print()}
            className="text-sm bg-white text-blue-900 font-semibold px-4 py-1.5 rounded hover:bg-blue-50 transition-colors"
          >
            Print / Download PDF
          </button>
        </div>
      </header>

      {/* Split pane */}
      <div className="flex flex-1 overflow-hidden print:hidden">
        {/* Left: Form */}
        <div className="w-1/2 overflow-y-auto bg-gray-100 border-r border-gray-300">
          <div className="p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Details
            </h2>
            <NdaForm data={formData} onChange={setFormData} />
          </div>
        </div>

        {/* Right: Live document preview */}
        <div className="w-1/2 overflow-y-auto bg-gray-200">
          <div className="p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Preview
            </h2>
            <NdaDocument data={formData} />
          </div>
        </div>
      </div>

      {/* Print: document only */}
      <div className="hidden print:block">
        <NdaDocument data={formData} />
      </div>
    </div>
  )
}
