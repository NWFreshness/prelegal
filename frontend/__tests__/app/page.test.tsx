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

  it('renders Chat and Edit Form tabs', () => {
    expect(screen.getByText('Chat')).toBeInTheDocument()
    expect(screen.getByText('Edit Form')).toBeInTheDocument()
  })

  it('renders the Preview panel label', () => {
    expect(screen.getByText('Preview')).toBeInTheDocument()
  })

  it('renders the Print / Download PDF button', () => {
    expect(screen.getByText('Print / Download PDF')).toBeInTheDocument()
  })

  it('defaults to the Chat tab with chat assistant visible', () => {
    expect(screen.getByText('NDA Chat Assistant')).toBeInTheDocument()
  })

  it('shows the form when Edit Form tab is clicked', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByText('Edit Form'))
    expect(screen.getByText('Agreement Details')).toBeInTheDocument()
    expect(screen.getByText('Party 1')).toBeInTheDocument()
    expect(screen.getByText('Party 2')).toBeInTheDocument()
  })

  it('renders the document preview alongside chat', () => {
    expect(screen.getAllByText('Mutual Non-Disclosure Agreement').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Standard Terms').length).toBeGreaterThan(0)
  })

  it('calls window.print when Print / Download PDF is clicked', () => {
    screen.getByText('Print / Download PDF').click()
    expect(window.print).toHaveBeenCalledTimes(1)
  })

  it("sets today's date as effectiveDate on mount", async () => {
    const user = userEvent.setup()
    await user.click(screen.getByText('Edit Form'))
    const today = new Date().toISOString().split('T')[0]
    const dateInput = screen.getByLabelText('Effective Date') as HTMLInputElement
    expect(dateInput.value).toBe(today)
  })

  // ── Live preview ──────────────────────────────────────────────────────────

  it('updates the document preview when governing law is typed in Edit Form', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByText('Edit Form'))
    const govLawInput = screen.getByLabelText('Governing Law')
    await user.type(govLawInput, 'California')
    const matches = screen.getAllByText('California')
    expect(matches.length).toBeGreaterThan(0)
  })

  it('updates the document preview when Party 1 company name is typed', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByText('Edit Form'))
    await user.type(screen.getAllByLabelText('Company Name')[0], 'Acme Corp')
    expect(screen.getAllByText('Acme Corp').length).toBeGreaterThan(0)
  })
})
