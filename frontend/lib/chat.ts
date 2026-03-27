import { apiFetch } from './api'
import { DocumentFields } from './types'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatResponse {
  reply: string
  fields: DocumentFields
  document_type: string | null
}

function storageKey(documentType: string | null): string {
  if (!documentType) return 'prelegal-chat-v2-selection'
  const slug = documentType.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return `prelegal-chat-v2-${slug}`
}

export async function sendMessage(
  messages: ChatMessage[],
  documentType: string | null,
): Promise<ChatResponse> {
  const res = await apiFetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ messages, document_type: documentType }),
  })
  if (!res.ok) {
    throw new Error(`Chat API error: ${res.status}`)
  }
  return res.json()
}

export function loadMessages(documentType: string | null): ChatMessage[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(storageKey(documentType))
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveMessages(messages: ChatMessage[], documentType: string | null) {
  if (typeof window === 'undefined') return
  localStorage.setItem(storageKey(documentType), JSON.stringify(messages))
}

export function clearStoredMessages(documentType: string | null) {
  if (typeof window === 'undefined') return
  localStorage.removeItem(storageKey(documentType))
}
