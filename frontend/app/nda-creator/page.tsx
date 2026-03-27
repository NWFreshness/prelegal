'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import NdaForm from '@/components/NdaForm'
import NdaDocument from '@/components/NdaDocument'
import ChatPane from '@/components/ChatPane'
import DisclaimerBanner from '@/components/DisclaimerBanner'
import { NdaFormData, defaultFormData } from '@/lib/types'
import { saveDocument, updateDocument, getDocument } from '@/lib/documents'

function NdaCreatorInner() {
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState<NdaFormData>(defaultFormData)
  const [activeTab, setActiveTab] = useState<'chat' | 'manual'>('chat')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [currentDocId, setCurrentDocId] = useState<number | null>(null)

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const docId = searchParams.get('doc')
    if (docId) {
      const id = Number(docId)
      setCurrentDocId(id)
      getDocument(id).then((doc) => {
        setFormData({ ...doc.form_data, effectiveDate: doc.form_data.effectiveDate || today })
      }).catch(() => {
        setFormData((prev) => ({ ...prev, effectiveDate: today }))
      })
    } else {
      setCurrentDocId(null)
      setFormData((prev) => ({ ...prev, effectiveDate: today }))
    }
  }, [searchParams])

  function handleFieldsUpdate(fields: Partial<NdaFormData>) {
    setFormData((prev) => ({ ...prev, ...fields }))
  }

  async function handleSave() {
    setSaveStatus('saving')
    const p1 = formData.party1Company
    const p2 = formData.party2Company
    const title = p1 && p2
      ? `${p1} / ${p2} Mutual NDA`
      : p1 || p2
      ? `${p1 || p2} Mutual NDA`
      : 'Untitled NDA'
    try {
      if (currentDocId) {
        await updateDocument(currentDocId, title, formData)
      } else {
        const saved = await saveDocument(title, formData)
        setCurrentDocId(saved.id)
      }
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2500)
    } catch {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 2500)
    }
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Fixed header */}
      <header className="bg-brand-navy text-white shadow-lg flex-shrink-0 print:hidden">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-brand-blue/70 hover:text-white text-sm">
              ← Dashboard
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 bg-brand-yellow rounded flex items-center justify-center flex-shrink-0">
                <span className="text-brand-navy font-black text-xs">PL</span>
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight leading-none">Prelegal</h1>
                <p className="text-brand-blue/70 text-xs">Mutual NDA Creator</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className={`text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors ${
                saveStatus === 'saved'
                  ? 'bg-green-500 text-white'
                  : saveStatus === 'error'
                  ? 'bg-red-500 text-white'
                  : 'bg-white/10 border border-white/30 text-white hover:bg-white/20'
              }`}
            >
              {saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? 'Saved!' : saveStatus === 'error' ? 'Error' : 'Save'}
            </button>
            <button
              onClick={() => window.print()}
              className="text-sm bg-white text-brand-navy font-semibold px-4 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Print / PDF
            </button>
          </div>
        </div>
      </header>

      {/* Split pane */}
      <div className="flex flex-1 overflow-hidden print:hidden">
        {/* Left: Chat / Manual tabs */}
        <div className="w-1/2 flex flex-col bg-gray-50 border-r border-gray-200">
          <div className="px-4 pt-3 pb-0 flex-shrink-0">
            <DisclaimerBanner />
          </div>
          {/* Tab bar */}
          <div className="flex border-b border-gray-200 bg-white flex-shrink-0 mt-3">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                activeTab === 'chat'
                  ? 'text-brand-blue border-b-2 border-brand-blue'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                activeTab === 'manual'
                  ? 'text-brand-blue border-b-2 border-brand-blue'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Edit Form
            </button>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-5">
            {activeTab === 'chat' ? (
              <ChatPane onFieldsUpdate={handleFieldsUpdate} />
            ) : (
              <NdaForm data={formData} onChange={setFormData} />
            )}
          </div>
        </div>

        {/* Right: Live document preview */}
        <div className="w-1/2 overflow-y-auto bg-gray-200">
          <div className="p-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
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

export default function NdaCreatorPage() {
  return (
    <Suspense>
      <NdaCreatorInner />
    </Suspense>
  )
}
