import { apiFetch } from './api'
import { NdaFormData } from './types'

export interface DocumentSummary {
  id: number
  title: string
  created_at: string
}

export interface DocumentDetail extends DocumentSummary {
  form_data: NdaFormData
}

export async function listDocuments(): Promise<DocumentSummary[]> {
  const res = await apiFetch('/api/documents')
  if (!res.ok) return []
  return res.json()
}

export async function saveDocument(title: string, formData: NdaFormData): Promise<DocumentSummary> {
  const res = await apiFetch('/api/documents', {
    method: 'POST',
    body: JSON.stringify({ title, form_data: formData }),
  })
  if (!res.ok) throw new Error('Failed to save document')
  return res.json()
}

export async function updateDocument(id: number, title: string, formData: NdaFormData): Promise<DocumentSummary> {
  const res = await apiFetch(`/api/documents/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ title, form_data: formData }),
  })
  if (!res.ok) throw new Error('Failed to update document')
  return res.json()
}

export async function getDocument(id: number): Promise<DocumentDetail> {
  const res = await apiFetch(`/api/documents/${id}`)
  if (!res.ok) throw new Error('Document not found')
  return res.json()
}
