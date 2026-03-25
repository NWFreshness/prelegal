import { render, screen } from '@testing-library/react'
import NdaDocument from '@/components/NdaDocument'
import { defaultFormData, NdaFormData } from '@/lib/types'

const completeData: NdaFormData = {
  ...defaultFormData,
  effectiveDate: '2026-03-25',
  governingLaw: 'Delaware',
  jurisdiction: 'New Castle, DE',
  party1Company: 'Acme Corp',
  party1Name: 'Alice Smith',
  party1Title: 'CEO',
  party1Address: 'alice@acme.com',
  party2Company: 'Beta Inc',
  party2Name: 'Bob Jones',
  party2Title: 'CTO',
  party2Address: 'bob@beta.com',
}

describe('NdaDocument', () => {
  // ── Structural rendering ──────────────────────────────────────────────────

  it('renders the document title', () => {
    render(<NdaDocument data={completeData} />)
    expect(screen.getByText('Mutual Non-Disclosure Agreement')).toBeInTheDocument()
  })

  it('renders the Standard Terms section heading', () => {
    render(<NdaDocument data={completeData} />)
    expect(screen.getByText('Standard Terms')).toBeInTheDocument()
  })

  it('renders all 11 standard terms clause titles', () => {
    render(<NdaDocument data={completeData} />)
    expect(screen.getByText('Introduction.')).toBeInTheDocument()
    expect(screen.getByText('Use and Protection of Confidential Information.')).toBeInTheDocument()
    expect(screen.getByText('Exceptions.')).toBeInTheDocument()
    expect(screen.getByText('Disclosures Required by Law.')).toBeInTheDocument()
    expect(screen.getByText('Term and Termination.')).toBeInTheDocument()
    expect(screen.getByText('Return or Destruction of Confidential Information.')).toBeInTheDocument()
    expect(screen.getByText('Proprietary Rights.')).toBeInTheDocument()
    expect(screen.getByText('Disclaimer.')).toBeInTheDocument()
    expect(screen.getByText('Governing Law and Jurisdiction.')).toBeInTheDocument()
    expect(screen.getByText('Equitable Relief.')).toBeInTheDocument()
    expect(screen.getByText('General.')).toBeInTheDocument()
  })

  it('renders cover page table row labels', () => {
    render(<NdaDocument data={completeData} />)
    expect(screen.getByText('Purpose')).toBeInTheDocument()
    expect(screen.getByText('Effective Date')).toBeInTheDocument()
    expect(screen.getByText('MNDA Term')).toBeInTheDocument()
    expect(screen.getByText('Term of Confidentiality')).toBeInTheDocument()
    expect(screen.getByText('Governing Law')).toBeInTheDocument()
    expect(screen.getByText('Jurisdiction')).toBeInTheDocument()
  })

  it('renders the CC BY 4.0 attribution footer', () => {
    render(<NdaDocument data={completeData} />)
    expect(screen.getByText(/CC BY 4\.0/)).toBeInTheDocument()
  })

  // ── Dynamic values — cover page ───────────────────────────────────────────

  it('displays the purpose value in the cover page table', () => {
    render(<NdaDocument data={completeData} />)
    // Purpose appears in the cover table and is also inserted into clause 1 & 2
    const elements = screen.getAllByText(completeData.purpose)
    expect(elements.length).toBeGreaterThan(0)
  })

  it('displays the governing law in the cover page and clause 9', () => {
    render(<NdaDocument data={completeData} />)
    const delawareElements = screen.getAllByText('Delaware')
    expect(delawareElements.length).toBeGreaterThanOrEqual(2) // cover table + clause 9 (×2)
  })

  it('displays the jurisdiction in the cover page and clause 9', () => {
    render(<NdaDocument data={completeData} />)
    const jurisdictionElements = screen.getAllByText('New Castle, DE')
    expect(jurisdictionElements.length).toBeGreaterThanOrEqual(2) // cover table + clause 9 (×2)
  })

  it('shows MNDA modifications row when modifications are provided', () => {
    const modifications = 'Section 5 is modified as follows: mutual obligations only.'
    render(<NdaDocument data={{ ...completeData, modifications }} />)
    expect(screen.getByText('MNDA Modifications')).toBeInTheDocument()
    expect(screen.getByText(modifications)).toBeInTheDocument()
  })

  it('omits MNDA modifications row when modifications field is empty', () => {
    render(<NdaDocument data={{ ...completeData, modifications: '' }} />)
    expect(screen.queryByText('MNDA Modifications')).not.toBeInTheDocument()
  })

  // ── Date formatting ───────────────────────────────────────────────────────

  it('formats a valid ISO date as a human-readable date', () => {
    render(<NdaDocument data={completeData} />)
    // 2026-03-25 → March 25, 2026
    const dateElements = screen.getAllByText('March 25, 2026')
    expect(dateElements.length).toBeGreaterThan(0)
  })

  it('shows fallback text when effectiveDate is empty', () => {
    render(<NdaDocument data={{ ...completeData, effectiveDate: '' }} />)
    const fallbackElements = screen.getAllByText('[Date not specified]')
    expect(fallbackElements.length).toBeGreaterThan(0)
  })

  // ── MNDA Term variations ──────────────────────────────────────────────────

  it('shows expires term display text in the cover page for expires type', () => {
    render(<NdaDocument data={{ ...completeData, mndaTermType: 'expires', mndaTermYears: 2 }} />)
    expect(screen.getByText('Expires 2 years from Effective Date')).toBeInTheDocument()
  })

  it('shows singular "year" (not "years") when mndaTermYears is 1', () => {
    render(<NdaDocument data={{ ...completeData, mndaTermType: 'expires', mndaTermYears: 1 }} />)
    expect(screen.getByText('Expires 1 year from Effective Date')).toBeInTheDocument()
  })

  it('shows continues display text in the cover page for continues type', () => {
    render(<NdaDocument data={{ ...completeData, mndaTermType: 'continues' }} />)
    expect(
      screen.getByText('Continues until terminated in accordance with the terms of the MNDA')
    ).toBeInTheDocument()
  })

  it('inserts expires term into clause 5 body text', () => {
    render(<NdaDocument data={{ ...completeData, mndaTermType: 'expires', mndaTermYears: 3 }} />)
    // Clause 5 uses mndaTermText (inline format, not the display format)
    expect(screen.getByText('3 years from Effective Date')).toBeInTheDocument()
  })

  it('inserts continues term into clause 5 body text', () => {
    render(<NdaDocument data={{ ...completeData, mndaTermType: 'continues' }} />)
    expect(
      screen.getByText('until terminated in accordance with the terms of the MNDA')
    ).toBeInTheDocument()
  })

  // ── Confidentiality Term variations ───────────────────────────────────────

  it('shows years confidentiality display text in cover page', () => {
    render(
      <NdaDocument
        data={{ ...completeData, confidentialityTermType: 'years', confidentialityTermYears: 2 }}
      />
    )
    expect(
      screen.getByText(/2 years from Effective Date \(trade secrets protected/)
    ).toBeInTheDocument()
  })

  it('shows perpetuity confidentiality display text in cover page', () => {
    render(<NdaDocument data={{ ...completeData, confidentialityTermType: 'perpetuity' }} />)
    expect(screen.getByText('In perpetuity')).toBeInTheDocument()
  })

  it('shows singular "year" for confidentiality term when years is 1', () => {
    render(
      <NdaDocument
        data={{ ...completeData, confidentialityTermType: 'years', confidentialityTermYears: 1 }}
      />
    )
    expect(
      screen.getByText(/1 year from Effective Date \(trade secrets protected/)
    ).toBeInTheDocument()
  })

  it('inserts perpetuity text into clause 5 body', () => {
    render(<NdaDocument data={{ ...completeData, confidentialityTermType: 'perpetuity' }} />)
    expect(screen.getByText('in perpetuity')).toBeInTheDocument()
  })

  it('inserts years + trade-secrets text into clause 5 body for years type', () => {
    render(
      <NdaDocument
        data={{ ...completeData, confidentialityTermType: 'years', confidentialityTermYears: 2 }}
      />
    )
    // The clause-5 confidentialityTermText for years includes the trade-secrets qualifier
    expect(
      screen.getByText(
        /2 years from Effective Date, but in the case of trade secrets until/
      )
    ).toBeInTheDocument()
  })

  // ── Governing law / jurisdiction fallbacks ────────────────────────────────

  it('shows [Governing Law] fallback in clause 9 when governingLaw is empty', () => {
    render(<NdaDocument data={{ ...completeData, governingLaw: '' }} />)
    const fallbacks = screen.getAllByText('[Governing Law]')
    expect(fallbacks.length).toBeGreaterThan(0)
  })

  it('shows [Not specified] in the cover table when governingLaw is empty', () => {
    // The cover page table uses a different fallback than clause 9
    render(<NdaDocument data={{ ...completeData, governingLaw: '', jurisdiction: 'New Castle, DE' }} />)
    expect(screen.getByText('[Not specified]')).toBeInTheDocument()
  })

  it('shows [Jurisdiction] fallback in clause 9 when jurisdiction is empty', () => {
    render(<NdaDocument data={{ ...completeData, jurisdiction: '' }} />)
    const fallbacks = screen.getAllByText('[Jurisdiction]')
    expect(fallbacks.length).toBeGreaterThan(0)
  })

  it('shows [Not specified] in the cover table when jurisdiction is empty', () => {
    render(<NdaDocument data={{ ...completeData, governingLaw: 'Delaware', jurisdiction: '' }} />)
    expect(screen.getByText('[Not specified]')).toBeInTheDocument()
  })

  // ── Signature block ───────────────────────────────────────────────────────

  it('renders Party 1 company name in the signature block', () => {
    render(<NdaDocument data={completeData} />)
    const elements = screen.getAllByText('Acme Corp')
    expect(elements.length).toBeGreaterThan(0)
  })

  it('renders Party 2 company name in the signature block', () => {
    render(<NdaDocument data={completeData} />)
    const elements = screen.getAllByText('Beta Inc')
    expect(elements.length).toBeGreaterThan(0)
  })

  it('renders Party 1 signatory name in the signature block', () => {
    render(<NdaDocument data={completeData} />)
    expect(screen.getByText('Alice Smith')).toBeInTheDocument()
  })

  it('renders Party 2 signatory name in the signature block', () => {
    render(<NdaDocument data={completeData} />)
    expect(screen.getByText('Bob Jones')).toBeInTheDocument()
  })

  it('renders Party 1 title in the signature block', () => {
    render(<NdaDocument data={completeData} />)
    expect(screen.getByText('CEO')).toBeInTheDocument()
  })

  it('renders Party 2 title in the signature block', () => {
    render(<NdaDocument data={completeData} />)
    expect(screen.getByText('CTO')).toBeInTheDocument()
  })

  it('renders Party 1 notice address in the signature block', () => {
    render(<NdaDocument data={completeData} />)
    expect(screen.getByText('alice@acme.com')).toBeInTheDocument()
  })

  it('renders Party 2 notice address in the signature block', () => {
    render(<NdaDocument data={completeData} />)
    expect(screen.getByText('bob@beta.com')).toBeInTheDocument()
  })

  // ── Renders with default data (smoke test) ─────────────────────────────────

  it('renders without crashing when given only default data', () => {
    render(<NdaDocument data={defaultFormData} />)
    expect(screen.getByText('Mutual Non-Disclosure Agreement')).toBeInTheDocument()
  })
})
