'use client'

import { NdaFormData } from '@/lib/types'

interface Props {
  data: NdaFormData
  onChange: (data: NdaFormData) => void
  onSubmit: () => void
}

const inputClass =
  'w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'

const labelClass = 'block text-sm font-medium text-gray-700 mb-1'
const hintClass = 'text-xs text-gray-500 mb-1'

export default function NdaForm({ data, onChange, onSubmit }: Props) {
  const update = <K extends keyof NdaFormData>(field: K, value: NdaFormData[K]) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit() }} className="space-y-6">
      {/* Agreement Details */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">
          Agreement Details
        </h2>

        <div className="space-y-5">
          <div>
            <label className={labelClass}>Purpose</label>
            <p className={hintClass}>How Confidential Information may be used</p>
            <textarea
              value={data.purpose}
              onChange={(e) => update('purpose', e.target.value)}
              className={inputClass}
              rows={2}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Effective Date</label>
            <input
              type="date"
              value={data.effectiveDate}
              onChange={(e) => update('effectiveDate', e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className={labelClass}>MNDA Term</label>
            <p className={hintClass}>How long this agreement lasts</p>
            <div className="space-y-2 mt-1">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="mndaTermType"
                  checked={data.mndaTermType === 'expires'}
                  onChange={() => update('mndaTermType', 'expires')}
                  className="text-blue-600"
                />
                Expires after&nbsp;
                <input
                  type="number"
                  value={data.mndaTermYears}
                  onChange={(e) => update('mndaTermYears', Math.max(1, parseInt(e.target.value) || 1))}
                  min={1}
                  max={10}
                  disabled={data.mndaTermType !== 'expires'}
                  className="w-16 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
                />
                &nbsp;year(s) from Effective Date
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="mndaTermType"
                  checked={data.mndaTermType === 'continues'}
                  onChange={() => update('mndaTermType', 'continues')}
                />
                Continues until terminated in accordance with the terms
              </label>
            </div>
          </div>

          <div>
            <label className={labelClass}>Term of Confidentiality</label>
            <p className={hintClass}>How long Confidential Information is protected</p>
            <div className="space-y-2 mt-1">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="confidentialityTermType"
                  checked={data.confidentialityTermType === 'years'}
                  onChange={() => update('confidentialityTermType', 'years')}
                />
                <input
                  type="number"
                  value={data.confidentialityTermYears}
                  onChange={(e) =>
                    update('confidentialityTermYears', Math.max(1, parseInt(e.target.value) || 1))
                  }
                  min={1}
                  max={10}
                  disabled={data.confidentialityTermType !== 'years'}
                  className="w-16 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
                />
                &nbsp;year(s) from Effective Date (trade secrets protected until they are no longer a trade secret)
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="confidentialityTermType"
                  checked={data.confidentialityTermType === 'perpetuity'}
                  onChange={() => update('confidentialityTermType', 'perpetuity')}
                />
                In perpetuity
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Governing Law</label>
              <p className={hintClass}>State (e.g., Delaware)</p>
              <input
                type="text"
                value={data.governingLaw}
                onChange={(e) => update('governingLaw', e.target.value)}
                placeholder="Delaware"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Jurisdiction</label>
              <p className={hintClass}>City/county and state</p>
              <input
                type="text"
                value={data.jurisdiction}
                onChange={(e) => update('jurisdiction', e.target.value)}
                placeholder="New Castle, DE"
                className={inputClass}
                required
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>MNDA Modifications <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea
              value={data.modifications}
              onChange={(e) => update('modifications', e.target.value)}
              placeholder="List any modifications to the standard terms..."
              className={inputClass}
              rows={3}
            />
          </div>
        </div>
      </section>

      {/* Party 1 */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">Party 1</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Company Name</label>
            <input type="text" value={data.party1Company} onChange={(e) => update('party1Company', e.target.value)} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Signatory Name</label>
            <input type="text" value={data.party1Name} onChange={(e) => update('party1Name', e.target.value)} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Title</label>
            <input type="text" value={data.party1Title} onChange={(e) => update('party1Title', e.target.value)} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Notice Address</label>
            <input
              type="text"
              value={data.party1Address}
              onChange={(e) => update('party1Address', e.target.value)}
              placeholder="Email or postal address"
              className={inputClass}
              required
            />
          </div>
        </div>
      </section>

      {/* Party 2 */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">Party 2</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Company Name</label>
            <input type="text" value={data.party2Company} onChange={(e) => update('party2Company', e.target.value)} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Signatory Name</label>
            <input type="text" value={data.party2Name} onChange={(e) => update('party2Name', e.target.value)} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Title</label>
            <input type="text" value={data.party2Title} onChange={(e) => update('party2Title', e.target.value)} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Notice Address</label>
            <input
              type="text"
              value={data.party2Address}
              onChange={(e) => update('party2Address', e.target.value)}
              placeholder="Email or postal address"
              className={inputClass}
              required
            />
          </div>
        </div>
      </section>

      <div className="flex justify-end pb-4">
        <button
          type="submit"
          className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors shadow-sm"
        >
          Preview Document →
        </button>
      </div>
    </form>
  )
}
