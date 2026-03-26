export type DocumentFields = Record<string, unknown>

export interface NdaFormData {
  purpose: string
  effectiveDate: string
  mndaTermType: 'expires' | 'continues'
  mndaTermYears: number
  confidentialityTermType: 'years' | 'perpetuity'
  confidentialityTermYears: number
  governingLaw: string
  jurisdiction: string
  modifications: string
  party1Company: string
  party1Name: string
  party1Title: string
  party1Address: string
  party2Company: string
  party2Name: string
  party2Title: string
  party2Address: string
}

export const defaultFormData: NdaFormData = {
  purpose: 'Evaluating whether to enter into a business relationship with the other party.',
  effectiveDate: '',
  mndaTermType: 'expires',
  mndaTermYears: 1,
  confidentialityTermType: 'years',
  confidentialityTermYears: 1,
  governingLaw: '',
  jurisdiction: '',
  modifications: '',
  party1Company: '',
  party1Name: '',
  party1Title: '',
  party1Address: '',
  party2Company: '',
  party2Name: '',
  party2Title: '',
  party2Address: '',
}
