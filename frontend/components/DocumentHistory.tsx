'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { listDocuments, DocumentSummary } from '@/lib/documents'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function DocumentHistory() {
  const [docs, setDocs] = useState<DocumentSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listDocuments()
      .then((d) => setDocs(d))
      .catch(() => null)
      .finally(() => setLoading(false))
  }, [])

  return (
    <section>
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
        My Documents
      </h2>

      {loading ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : docs.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <p className="text-sm text-gray-500">No documents saved yet.</p>
          <p className="text-xs text-gray-400 mt-1">Documents you save from the NDA creator will appear here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-lg border border-gray-200 px-5 py-3.5 flex items-center justify-between hover:border-brand-blue transition-colors"
            >
              <div>
                <p className="text-sm font-semibold text-gray-800">{doc.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{formatDate(doc.created_at)}</p>
              </div>
              <Link
                href={`/nda-creator?doc=${doc.id}`}
                className="text-xs font-semibold text-brand-blue hover:underline flex-shrink-0"
              >
                Open →
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
