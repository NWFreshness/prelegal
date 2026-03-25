import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Prelegal — Mutual NDA Creator',
  description: 'Create a Mutual Non-Disclosure Agreement with key terms filled in.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">{children}</body>
    </html>
  )
}
