'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import ChatPane from '@/components/ChatPane'
import NdaDocument from '@/components/NdaDocument'
import NdaForm from '@/components/NdaForm'
import FieldsSummary from '@/components/FieldsSummary'
import { DocumentFields, NdaFormData, defaultFormData } from '@/lib/types'

const NDA_NAME = 'Mutual Non-Disclosure Agreement (NDA)'

export default function DocumentCreatorClient() {
  const searchParams = useSearchParams()
  const initialType = searchParams.get('type')

  const [documentType, setDocumentType] = useState<string | null>(initialType)
  const [fields, setFields] = useState<DocumentFields>({})
  const [activeTab, setActiveTab] = useState<'chat' | 'manual'>('chat')

  const isNda = documentType === NDA_NAME

  const ndaData: NdaFormData = useMemo(() => {
    if (!isNda) return defaultFormData
    return {
      ...defaultFormData,
      ...fields,
      effectiveDate: String(fields.effectiveDate ?? (defaultFormData.effectiveDate || new Date().toISOString().split('T')[0])),
      mndaTermYears: Number(fields.mndaTermYears ?? defaultFormData.mndaTermYears),
      confidentialityTermYears: Number(fields.confidentialityTermYears ?? defaultFormData.confidentialityTermYears),
      mndaTermType: (fields.mndaTermType as NdaFormData['mndaTermType']) ?? defaultFormData.mndaTermType,
      confidentialityTermType: (fields.confidentialityTermType as NdaFormData['confidentialityTermType']) ?? defaultFormData.confidentialityTermType,
    }
  }, [isNda, fields])

  function handleFieldsUpdate(newFields: DocumentFields, newDocType: string | null) {
    if (newDocType && newDocType !== documentType) {
      setDocumentType(newDocType)
      setFields(newFields)
    } else {
      setFields((prev) => ({ ...prev, ...newFields }))
    }
  }

  function handleNdaFormChange(data: NdaFormData) {
    setFields(data as unknown as DocumentFields)
  }

  const subtitle = documentType ?? 'Document Creator'

  return (
    <div className="h-screen flex flex-col">
      {/* Fixed header */}
      <header className="bg-blue-900 text-white shadow-lg flex-shrink-0 print:hidden">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-blue-300 hover:text-white text-sm">
              &larr; Dashboard
            </Link>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Prelegal</h1>
              <p className="text-blue-300 text-xs">{subtitle}</p>
            </div>
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
        {/* Left: Chat / Manual tabs */}
        <div className="w-1/2 flex flex-col bg-gray-100 border-r border-gray-300">
          {/* Tab bar */}
          <div className="flex border-b border-gray-300 bg-white flex-shrink-0">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                activeTab === 'chat'
                  ? 'text-[#209dd7] border-b-2 border-[#209dd7]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Chat
            </button>
            {isNda && (
              <button
                onClick={() => setActiveTab('manual')}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === 'manual'
                    ? 'text-[#209dd7] border-b-2 border-[#209dd7]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Edit Form
              </button>
            )}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'chat' || !isNda ? (
              <ChatPane
                documentType={documentType}
                onFieldsUpdate={handleFieldsUpdate}
              />
            ) : (
              <NdaForm data={ndaData} onChange={handleNdaFormChange} />
            )}
          </div>
        </div>

        {/* Right: Live document preview */}
        <div className="w-1/2 overflow-y-auto bg-gray-200">
          <div className="p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Preview
            </h2>
            {isNda ? (
              <NdaDocument data={ndaData} />
            ) : documentType ? (
              <FieldsSummary documentType={documentType} fields={fields} />
            ) : (
              <div className="text-center text-gray-400 mt-20">
                <p className="text-sm">Select a document type to see a preview.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Print: document only */}
      <div className="hidden print:block">
        {isNda ? (
          <NdaDocument data={ndaData} />
        ) : documentType ? (
          <FieldsSummary documentType={documentType} fields={fields} />
        ) : null}
      </div>
    </div>
  )
}
