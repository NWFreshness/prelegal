import { redirect } from 'next/navigation'

export default function NdaCreatorPage() {
  redirect('/document-creator?type=Mutual+Non-Disclosure+Agreement+%28NDA%29')
}
