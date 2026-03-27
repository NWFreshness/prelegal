import { Suspense } from 'react'
import DocumentCreatorClient from './client'

export default function DocumentCreatorPage() {
  return (
    <Suspense>
      <DocumentCreatorClient />
    </Suspense>
  )
}
