'use client'

import { useEffect, useRef, useState } from 'react'
import { NdaFormData } from '@/lib/types'
import {
  ChatMessage,
  sendMessage,
  loadMessages,
  saveMessages,
  clearStoredMessages,
} from '@/lib/chat'

interface Props {
  onFieldsUpdate: (fields: Partial<NdaFormData>) => void
}

export default function ChatPane({ onFieldsUpdate }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Hydrate from localStorage on mount
  useEffect(() => {
    setMessages(loadMessages())
  }, [])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend() {
    const text = input.trim()
    if (!text || loading) return

    const userMessage: ChatMessage = { role: 'user', content: text }
    const updated = [...messages, userMessage]
    setMessages(updated)
    saveMessages(updated)
    setInput('')
    setLoading(true)

    try {
      const response = await sendMessage(updated)
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.reply,
      }
      const withReply = [...updated, assistantMessage]
      setMessages(withReply)
      saveMessages(withReply)

      if (response.fields && Object.keys(response.fields).length > 0) {
        onFieldsUpdate(response.fields)
      }
    } catch {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
      }
      const withError = [...updated, errorMessage]
      setMessages(withError)
      saveMessages(withError)
    } finally {
      setLoading(false)
      textareaRef.current?.focus()
    }
  }

  function handleClear() {
    setMessages([])
    clearStoredMessages()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-12 px-4">
            <p className="text-lg font-medium text-gray-500 mb-2">
              NDA Chat Assistant
            </p>
            <p className="text-sm">
              Tell me about the NDA you need and I will help you fill it out.
              For example: &quot;I need an NDA between Acme Corp and Beta Inc
              for a potential partnership.&quot;
            </p>
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
                  ? 'bg-brand-blue text-white'
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
            placeholder="Describe your NDA needs..."
            rows={2}
            disabled={loading}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:bg-gray-50"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-brand-purple text-white px-4 py-2 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed self-end"
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
