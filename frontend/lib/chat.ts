import { NdaFormData } from './types'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatResponse {
  reply: string
  fields: Partial<NdaFormData>
}

const API_URL = 'http://localhost:8001/api/chat'
const STORAGE_KEY = 'prelegal-chat-nda-v1'

export async function sendMessage(messages: ChatMessage[]): Promise<ChatResponse> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  })
  if (!res.ok) {
    throw new Error(`Chat API error: ${res.status}`)
  }
  return res.json()
}

export function loadMessages(): ChatMessage[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveMessages(messages: ChatMessage[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
}

export function clearStoredMessages() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}
