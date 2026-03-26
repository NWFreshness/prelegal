'use client'

import { useEffect, useRef, useState } from 'react'
import { DocumentFields } from '@/lib/types'
import {
  ChatMessage,
  sendMessage,
  loadMessages,
  saveMessages,
  clearStoredMessages,
} from '@/lib/chat'

interface Props {
  documentType: string | null
  onFieldsUpdate: (fields: DocumentFields, documentType: string | null) => void
}

export default function ChatPane({ documentType, onFieldsUpdate }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setMessages(loadMessages(documentType))
  }, [documentType])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-focus the textarea on mount and when loading completes
  useEffect(() => {
    if (!loading) {
      textareaRef.current?.focus()
    }
  }, [loading])

  async function handleSend() {
    const text = input.trim()
    if (!text || loading) return

    const userMessage: ChatMessage = { role: 'user', content: text }
    const updated = [...messages, userMessage]
    setMessages(updated)
    saveMessages(updated, documentType)
    setInput('')
    setLoading(true)

    try {
      const response = await sendMessage(updated, documentType)
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.reply,
      }
      const withReply = [...updated, assistantMessage]
      setMessages(withReply)
      saveMessages(withReply, documentType)

      onFieldsUpdate(response.fields ?? {}, response.document_type)
    } catch {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
      }
      const withError = [...updated, errorMessage]
      setMessages(withError)
      saveMessages(withError, documentType)
    } finally {
      setLoading(false)
    }
  }

  function handleClear() {
    setMessages([])
    clearStoredMessages(documentType)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const welcomeTitle = documentType
    ? `${documentType} Assistant`
    : 'Legal Document Assistant'
  const welcomeText = documentType
    ? `Tell me about the ${documentType} you need and I'll help you fill it out.`
    : 'Tell me what kind of legal document you need and I\'ll help you get started.'
  const placeholder = documentType
    ? `Describe your ${documentType} needs...`
    : 'What legal document do you need?'

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-12 px-4">
            <p className="text-lg font-medium text-gray-500 mb-2">
              {welcomeTitle}
            </p>
            <p className="text-sm">{welcomeText}</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-[#209dd7] text-white'
                  : 'bg-white border border-gray-200 text-gray-800'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-400">
              Thinking...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 pt-3">
        <div className="flex gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={2}
            disabled={loading}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:bg-gray-50"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-[#753991] text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#652d80] transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-end"
          >
            Send
          </button>
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleClear}
            className="text-xs text-gray-400 hover:text-gray-600 mt-2"
          >
            Clear chat
          </button>
        )}
      </div>
    </div>
  )
}
