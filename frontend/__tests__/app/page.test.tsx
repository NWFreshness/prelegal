import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NdaCreatorPage from '@/app/nda-creator/page'

describe('NDA Creator page', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await act(async () => {
      render(<NdaCreatorPage />)
    })
  })

  // ── Layout ────────────────────────────────────────────────────────────────

  it('renders the Prelegal header', () => {
    expect(screen.getByText('Prelegal')).toBeInTheDocument()
  })

  it('renders the Details panel label', () => {
    expect(screen.getByText('Details')).toBeInTheDocument()
  })

  it('renders the Preview panel label', () => {
    expect(screen.getByText('Preview')).toBeInTheDocument()
  })

  it('renders the Print / Download PDF button', () => {
    expect(screen.getByText('Print / Download PDF')).toBeInTheDocument()
  })

  it('renders the form and the document simultaneously', () => {
    // Form sections
    expect(screen.getByText('Agreement Details')).toBeInTheDocument()
    expect(screen.getByText('Party 1')).toBeInTheDocument()
    expect(screen.getByText('Party 2')).toBeInTheDocument()
    // Document (rendered twice: split-pane preview + hidden print div)
    expect(screen.getAllByText('Mutual Non-Disclosure Agreement').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Standard Terms').length).toBeGreaterThan(0)
  })

  it('calls window.print when Print / Download PDF is clicked', () => {
    screen.getByText('Print / Download PDF').click()
    expect(window.print).toHaveBeenCalledTimes(1)
  })

  it("sets today's date as effectiveDate on mount", () => {
    const today = new Date().toISOString().split('T')[0]
    const dateInput = screen.getByLabelText('Effective Date') as HTMLInputElement
    expect(dateInput.value).toBe(today)
  })

  // ── Live preview ──────────────────────────────────────────────────────────

  it('updates the document preview when governing law is typed', async () => {
    const user = userEvent.setup()
    const govLawInput = screen.getByLabelText('Governing Law')
    await user.type(govLawInput, 'California')
    // 'California' should now appear in the document preview (clause 9 and cover table)
    const matches = screen.getAllByText('California')
    expect(matches.length).toBeGreaterThan(0)
  })

  it('updates the document preview when Party 1 company name is typed', async () => {
    const user = userEvent.setup()
    await user.type(screen.getAllByLabelText('Company Name')[0], 'Acme Corp')
    expect(screen.getAllByText('Acme Corp').length).toBeGreaterThan(0)
  })
})
