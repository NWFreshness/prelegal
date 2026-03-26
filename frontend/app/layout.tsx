import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Prelegal',
  description: 'A platform for drafting common legal agreements.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">{children}</body>
    </html>
  )
}
