'use client'

import { DocumentFields } from '@/lib/types'

interface Props {
  documentType: string
  fields: DocumentFields
}

function formatKey(key: string): string {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())
}

export default function FieldsSummary({ documentType, fields }: Props) {
  const entries = Object.entries(fields)

  return (
    <div
      className="bg-white shadow-md rounded-lg mx-auto print:shadow-none print:rounded-none"
      style={{ fontFamily: 'Georgia, "Times New Roman", serif', maxWidth: '800px' }}
    >
      <div className="px-12 py-10 print:px-8 print:py-6">
        <h1 className="text-2xl font-bold text-center tracking-tight mb-2">
          {documentType}
        </h1>
        <p className="text-sm text-gray-500 text-center mb-8">Collected fields</p>

        {entries.length === 0 ? (
          <p className="text-sm text-gray-400 text-center mt-12">
            No fields collected yet. Use the chat to fill in details.
          </p>
        ) : (
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <tbody>
              {entries.map(([key, value]) => (
                <tr key={key}>
                  <td className="border border-gray-300 p-3 bg-gray-50 font-semibold w-48 align-top text-gray-800">
                    {formatKey(key)}
                  </td>
                  <td className="border border-gray-300 p-3 text-gray-900">
                    {String(value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
