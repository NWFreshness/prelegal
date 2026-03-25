import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NdaForm from '@/components/NdaForm'
import { defaultFormData, NdaFormData } from '@/lib/types'

describe('NdaForm', () => {
  const mockOnChange = jest.fn()

  beforeEach(() => {
    mockOnChange.mockClear()
  })

  // ── Section rendering ─────────────────────────────────────────────────────

  it('renders all three sections', () => {
    render(<NdaForm data={defaultFormData} onChange={mockOnChange} />)
    expect(screen.getByText('Agreement Details')).toBeInTheDocument()
    expect(screen.getByText('Party 1')).toBeInTheDocument()
    expect(screen.getByText('Party 2')).toBeInTheDocument()
  })

  // ── Purpose field ─────────────────────────────────────────────────────────

  it('renders the purpose textarea with the current value', () => {
    render(<NdaForm data={defaultFormData} onChange={mockOnChange} />)
    const purposeField = screen.getByLabelText('Purpose')
    expect(purposeField).toHaveValue(defaultFormData.purpose)
  })

  it('calls onChange with updated purpose when user types', async () => {
    const user = userEvent.setup()
    render(<NdaForm data={{ ...defaultFormData, purpose: '' }} onChange={mockOnChange} />)
    const purposeField = screen.getByLabelText('Purpose')
    await user.type(purposeField, 'Exploring a partnership')
    expect(mockOnChange).toHaveBeenCalled()
    const lastCall = mockOnChange.mock.calls.at(-1)![0] as NdaFormData
    expect(lastCall.purpose).toContain('Exploring a partnership')
  })

  // ── Effective Date ────────────────────────────────────────────────────────

  it('renders the effective date input', () => {
    render(<NdaForm data={{ ...defaultFormData, effectiveDate: '2026-03-25' }} onChange={mockOnChange} />)
    expect(screen.getByLabelText('Effective Date')).toHaveValue('2026-03-25')
  })

  it('calls onChange with updated effectiveDate when date changes', () => {
    render(<NdaForm data={defaultFormData} onChange={mockOnChange} />)
    fireEvent.change(screen.getByLabelText('Effective Date'), {
      target: { value: '2026-06-01' },
    })
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ effectiveDate: '2026-06-01' })
    )
  })

  // ── MNDA Term radios ──────────────────────────────────────────────────────

  it('renders both MNDA term radio buttons', () => {
    render(<NdaForm data={defaultFormData} onChange={mockOnChange} />)
    expect(screen.getByTestId('mnda-expires-radio')).toBeInTheDocument()
    expect(screen.getByTestId('mnda-continues-radio')).toBeInTheDocument()
  })

  it('checks the expires radio by default', () => {
    render(<NdaForm data={defaultFormData} onChange={mockOnChange} />)
    expect(screen.getByTestId('mnda-expires-radio')).toBeChecked()
    expect(screen.getByTestId('mnda-continues-radio')).not.toBeChecked()
  })

  it('checks the continues radio when mndaTermType is continues', () => {
    render(<NdaForm data={{ ...defaultFormData, mndaTermType: 'continues' }} onChange={mockOnChange} />)
    expect(screen.getByTestId('mnda-continues-radio')).toBeChecked()
    expect(screen.getByTestId('mnda-expires-radio')).not.toBeChecked()
  })

  it('calls onChange with mndaTermType: continues when continues radio is clicked', () => {
    render(<NdaForm data={defaultFormData} onChange={mockOnChange} />)
    fireEvent.click(screen.getByTestId('mnda-continues-radio'))
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ mndaTermType: 'continues' })
    )
  })

  it('calls onChange with mndaTermType: expires when expires radio is clicked', () => {
    render(<NdaForm data={{ ...defaultFormData, mndaTermType: 'continues' }} onChange={mockOnChange} />)
    fireEvent.click(screen.getByTestId('mnda-expires-radio'))
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ mndaTermType: 'expires' })
    )
  })

  it('disables the MNDA term years input when continues is selected', () => {
    render(<NdaForm data={{ ...defaultFormData, mndaTermType: 'continues' }} onChange={mockOnChange} />)
    expect(screen.getByLabelText('MNDA term years')).toBeDisabled()
  })

  it('enables the MNDA term years input when expires is selected', () => {
    render(<NdaForm data={{ ...defaultFormData, mndaTermType: 'expires' }} onChange={mockOnChange} />)
    expect(screen.getByLabelText('MNDA term years')).toBeEnabled()
  })

  it('calls onChange with updated mndaTermYears when the year input changes', () => {
    render(<NdaForm data={defaultFormData} onChange={mockOnChange} />)
    fireEvent.change(screen.getByLabelText('MNDA term years'), { target: { value: '3' } })
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ mndaTermYears: 3 })
    )
  })

  // ── Confidentiality Term radios ───────────────────────────────────────────

  it('renders both confidentiality term radio buttons', () => {
    render(<NdaForm data={defaultFormData} onChange={mockOnChange} />)
    expect(screen.getByTestId('confidentiality-years-radio')).toBeInTheDocument()
    expect(screen.getByTestId('confidentiality-perpetuity-radio')).toBeInTheDocument()
  })

  it('checks the years radio by default', () => {
    render(<NdaForm data={defaultFormData} onChange={mockOnChange} />)
    expect(screen.getByTestId('confidentiality-years-radio')).toBeChecked()
    expect(screen.getByTestId('confidentiality-perpetuity-radio')).not.toBeChecked()
  })

  it('checks the perpetuity radio when confidentialityTermType is perpetuity', () => {
    render(<NdaForm data={{ ...defaultFormData, confidentialityTermType: 'perpetuity' }} onChange={mockOnChange} />)
    expect(screen.getByTestId('confidentiality-perpetuity-radio')).toBeChecked()
  })

  it('calls onChange with confidentialityTermType: perpetuity when perpetuity radio is clicked', () => {
    render(<NdaForm data={defaultFormData} onChange={mockOnChange} />)
    fireEvent.click(screen.getByTestId('confidentiality-perpetuity-radio'))
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ confidentialityTermType: 'perpetuity' })
    )
  })

  it('disables the confidentiality years input when perpetuity is selected', () => {
    render(<NdaForm data={{ ...defaultFormData, confidentialityTermType: 'perpetuity' }} onChange={mockOnChange} />)
    expect(screen.getByLabelText('Confidentiality term years')).toBeDisabled()
  })

  it('calls onChange with confidentialityTermType: years when years radio is clicked from perpetuity state', () => {
    render(
      <NdaForm
        data={{ ...defaultFormData, confidentialityTermType: 'perpetuity' }}
        onChange={mockOnChange}
      />
    )
    fireEvent.click(screen.getByTestId('confidentiality-years-radio'))
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ confidentialityTermType: 'years' })
    )
  })

  it('calls onChange with updated confidentialityTermYears when the year input changes', () => {
    render(<NdaForm data={defaultFormData} onChange={mockOnChange} />)
    fireEvent.change(screen.getByLabelText('Confidentiality term years'), { target: { value: '5' } })
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ confidentialityTermYears: 5 })
    )
  })

  // ── Governing Law & Jurisdiction ──────────────────────────────────────────

  it('renders the governing law input', () => {
    render(<NdaForm data={defaultFormData} onChange={mockOnChange} />)
    expect(screen.getByLabelText('Governing Law')).toBeInTheDocument()
  })

  it('calls onChange with updated governingLaw when user types', async () => {
    const user = userEvent.setup()
    render(<NdaForm data={defaultFormData} onChange={mockOnChange} />)
    await user.type(screen.getByLabelText('Governing Law'), 'California')
    const lastCall = mockOnChange.mock.calls.at(-1)![0] as NdaFormData
    expect(lastCall.governingLaw).toContain('California')
  })

  it('renders the jurisdiction input', () => {
    render(<NdaForm data={defaultFormData} onChange={mockOnChange} />)
    expect(screen.getByLabelText('Jurisdiction')).toBeInTheDocument()
  })

  it('calls onChange with updated jurisdiction when user types', async () => {
    const user = userEvent.setup()
    render(<NdaForm data={defaultFormData} onChange={mockOnChange} />)
    await user.type(screen.getByLabelText('Jurisdiction'), 'San Francisco, CA')
    const lastCall = mockOnChange.mock.calls.at(-1)![0] as NdaFormData
    expect(lastCall.jurisdiction).toContain('San Francisco, CA')
  })

  // ── Modifications ─────────────────────────────────────────────────────────

  it('renders the MNDA modifications textarea', () => {
    render(<NdaForm data={defaultFormData} onChange={mockOnChange} />)
    expect(screen.getByLabelText(/MNDA Modifications/)).toBeInTheDocument()
  })

  it('calls onChange with updated modifications', async () => {
    const user = userEvent.setup()
    render(<NdaForm data={defaultFormData} onChange={mockOnChange} />)
    await user.type(screen.getByLabelText(/MNDA Modifications/), 'Clause 5 modified')
    const lastCall = mockOnChange.mock.calls.at(-1)![0] as NdaFormData
    expect(lastCall.modifications).toContain('Clause 5 modified')
  })

  // ── Party fields ──────────────────────────────────────────────────────────

  it('renders and updates Party 1 company name', async () => {
    const user = userEvent.setup()
    render(<NdaForm data={defaultFormData} onChange={mockOnChange} />)
    // Party 1 Company Name is the first of two "Company Name" labels in the DOM
    await user.type(screen.getAllByLabelText('Company Name')[0], 'Acme Corp')
    const lastCall = mockOnChange.mock.calls.at(-1)![0] as NdaFormData
    expect(lastCall.party1Company).toContain('Acme Corp')
  })

  it('renders and updates Party 2 company name', async () => {
    const user = userEvent.setup()
    render(<NdaForm data={defaultFormData} onChange={mockOnChange} />)
    // Party 2 Company Name is the second "Company Name" label in the DOM
    await user.type(screen.getAllByLabelText('Company Name')[1], 'Beta Inc')
    const lastCall = mockOnChange.mock.calls.at(-1)![0] as NdaFormData
    expect(lastCall.party2Company).toContain('Beta Inc')
  })

  it('renders Party 1 signatory name field', () => {
    render(<NdaForm data={defaultFormData} onChange={mockOnChange} />)
    expect(screen.getAllByLabelText('Signatory Name')[0]).toBeInTheDocument()
  })

  it('renders Party 2 signatory name field', () => {
    render(<NdaForm data={defaultFormData} onChange={mockOnChange} />)
    expect(screen.getAllByLabelText('Signatory Name')[1]).toBeInTheDocument()
  })

  it('renders Party 1 title field', () => {
    render(<NdaForm data={defaultFormData} onChange={mockOnChange} />)
    expect(screen.getAllByLabelText('Title')[0]).toBeInTheDocument()
  })

  it('renders Party 2 title field', () => {
    render(<NdaForm data={defaultFormData} onChange={mockOnChange} />)
    expect(screen.getAllByLabelText('Title')[1]).toBeInTheDocument()
  })

  it('renders Party 1 address field', () => {
    render(<NdaForm data={defaultFormData} onChange={mockOnChange} />)
    expect(screen.getAllByLabelText('Notice Address')[0]).toBeInTheDocument()
  })

  it('renders Party 2 address field', () => {
    render(<NdaForm data={defaultFormData} onChange={mockOnChange} />)
    expect(screen.getAllByLabelText('Notice Address')[1]).toBeInTheDocument()
  })

  it('preserves other fields when one field changes', () => {
    render(<NdaForm data={defaultFormData} onChange={mockOnChange} />)
    fireEvent.change(screen.getByLabelText('Governing Law'), {
      target: { value: 'Texas' },
    })
    const updatedData = mockOnChange.mock.calls.at(-1)![0] as NdaFormData
    expect(updatedData.purpose).toBe(defaultFormData.purpose)
    expect(updatedData.mndaTermType).toBe(defaultFormData.mndaTermType)
    expect(updatedData.governingLaw).toBe('Texas')
  })
})
