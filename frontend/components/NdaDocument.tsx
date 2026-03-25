'use client'

import { NdaFormData } from '@/lib/types'

interface Props {
  data: NdaFormData
}

function Val({ children }: { children: React.ReactNode }) {
  return <span className="font-semibold underline decoration-blue-400">{children}</span>
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '[Date not specified]'
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function NdaDocument({ data }: Props) {
  const mndaTermText =
    data.mndaTermType === 'expires'
      ? `${data.mndaTermYears} year${data.mndaTermYears !== 1 ? 's' : ''} from Effective Date`
      : 'until terminated in accordance with the terms of the MNDA'

  const mndaTermDisplay =
    data.mndaTermType === 'expires'
      ? `Expires ${data.mndaTermYears} year${data.mndaTermYears !== 1 ? 's' : ''} from Effective Date`
      : 'Continues until terminated in accordance with the terms of the MNDA'

  const confidentialityTermText =
    data.confidentialityTermType === 'years'
      ? `${data.confidentialityTermYears} year${data.confidentialityTermYears !== 1 ? 's' : ''} from Effective Date, but in the case of trade secrets until Confidential Information is no longer considered a trade secret under applicable laws`
      : 'in perpetuity'

  const confidentialityTermDisplay =
    data.confidentialityTermType === 'years'
      ? `${data.confidentialityTermYears} year${data.confidentialityTermYears !== 1 ? 's' : ''} from Effective Date (trade secrets protected until no longer a trade secret under applicable laws)`
      : 'In perpetuity'

  return (
    <div
      className="bg-white shadow-md rounded-lg mx-auto print:shadow-none print:rounded-none"
      style={{ fontFamily: 'Georgia, "Times New Roman", serif', maxWidth: '800px' }}
    >
      <div className="px-12 py-10 print:px-8 print:py-6">
        {/* ── Cover Page ── */}
        <h1 className="text-2xl font-bold text-center tracking-tight mb-2">
          Mutual Non-Disclosure Agreement
        </h1>
        <p className="text-sm text-gray-600 text-center mb-8 leading-relaxed">
          This Mutual Non-Disclosure Agreement (the &ldquo;MNDA&rdquo;) consists of: (1) this Cover Page
          and (2) the Common Paper Mutual NDA Standard Terms Version 1.0, identical to those posted at
          commonpaper.com/standards/mutual-nda/1.0. Any modifications of the Standard Terms should be
          made on the Cover Page, which will control over conflicts with the Standard Terms.
        </p>

        {/* Cover Page Table */}
        <table className="w-full border-collapse border border-gray-300 text-sm mb-8">
          <tbody>
            <CoverRow label="Purpose" hint="How Confidential Information may be used">
              {data.purpose}
            </CoverRow>
            <CoverRow label="Effective Date">
              {formatDate(data.effectiveDate)}
            </CoverRow>
            <CoverRow label="MNDA Term" hint="The length of this MNDA">
              {mndaTermDisplay}
            </CoverRow>
            <CoverRow label="Term of Confidentiality" hint="How long Confidential Information is protected">
              {confidentialityTermDisplay}
            </CoverRow>
            <CoverRow label="Governing Law">
              {data.governingLaw || '[Not specified]'}
            </CoverRow>
            <CoverRow label="Jurisdiction">
              {data.jurisdiction || '[Not specified]'}
            </CoverRow>
            {data.modifications && (
              <CoverRow label="MNDA Modifications">
                {data.modifications}
              </CoverRow>
            )}
          </tbody>
        </table>

        <p className="text-sm mb-6">
          By signing this Cover Page, each party agrees to enter into this MNDA as of the Effective Date.
        </p>

        {/* Signature Block */}
        <table className="w-full border-collapse border border-gray-300 text-sm mb-10">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 bg-gray-50 text-left w-32" />
              <th className="border border-gray-300 p-2 bg-gray-50 text-center">PARTY 1</th>
              <th className="border border-gray-300 p-2 bg-gray-50 text-center">PARTY 2</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2 font-semibold bg-gray-50">Company</td>
              <td className="border border-gray-300 p-2">{data.party1Company || '\u00a0'}</td>
              <td className="border border-gray-300 p-2">{data.party2Company || '\u00a0'}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-semibold bg-gray-50">Signature</td>
              <td className="border border-gray-300 p-8" />
              <td className="border border-gray-300 p-8" />
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-semibold bg-gray-50">Print Name</td>
              <td className="border border-gray-300 p-2">{data.party1Name || '\u00a0'}</td>
              <td className="border border-gray-300 p-2">{data.party2Name || '\u00a0'}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-semibold bg-gray-50">Title</td>
              <td className="border border-gray-300 p-2">{data.party1Title || '\u00a0'}</td>
              <td className="border border-gray-300 p-2">{data.party2Title || '\u00a0'}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-semibold bg-gray-50">
                Notice Address
              </td>
              <td className="border border-gray-300 p-2">{data.party1Address || '\u00a0'}</td>
              <td className="border border-gray-300 p-2">{data.party2Address || '\u00a0'}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-semibold bg-gray-50">Date</td>
              <td className="border border-gray-300 p-2">{formatDate(data.effectiveDate)}</td>
              <td className="border border-gray-300 p-2">{formatDate(data.effectiveDate)}</td>
            </tr>
          </tbody>
        </table>

        {/* ── Standard Terms ── */}
        <hr className="my-8 border-t-2 border-gray-200" />

        <h2 className="text-xl font-bold text-center mb-1">Standard Terms</h2>
        <p className="text-xs text-gray-500 text-center mb-8">
          Common Paper Mutual NDA Standard Terms Version 1.0
        </p>

        <ol className="space-y-5 text-sm leading-relaxed" style={{ listStyleType: 'decimal', paddingLeft: '1.75rem' }}>
          <li>
            <strong>Introduction.</strong> This Mutual Non-Disclosure Agreement (which incorporates
            these Standard Terms and the Cover Page (defined below)) (&ldquo;<strong>MNDA</strong>&rdquo;) allows
            each party (&ldquo;<strong>Disclosing Party</strong>&rdquo;) to disclose or make available information
            in connection with the <Val>{data.purpose}</Val> which (1) the Disclosing Party identifies
            to the receiving party (&ldquo;<strong>Receiving Party</strong>&rdquo;) as &ldquo;confidential&rdquo;,
            &ldquo;proprietary&rdquo;, or the like or (2) should be reasonably understood as confidential or
            proprietary due to its nature and the circumstances of its disclosure
            (&ldquo;<strong>Confidential Information</strong>&rdquo;). Each party&rsquo;s Confidential Information also
            includes the existence and status of the parties&rsquo; discussions and information on the Cover
            Page. Confidential Information includes technical or business information, product designs or
            roadmaps, requirements, pricing, security and compliance documentation, technology, inventions
            and know-how. To use this MNDA, the parties must complete and sign a cover page incorporating
            these Standard Terms (&ldquo;<strong>Cover Page</strong>&rdquo;). Each party is identified on the Cover
            Page and capitalized terms have the meanings given herein or on the Cover Page.
          </li>

          <li>
            <strong>Use and Protection of Confidential Information.</strong> The Receiving Party shall:
            (a) use Confidential Information solely for the <Val>{data.purpose}</Val>; (b) not disclose
            Confidential Information to third parties without the Disclosing Party&rsquo;s prior written
            approval, except that the Receiving Party may disclose Confidential Information to its
            employees, agents, advisors, contractors and other representatives having a reasonable need to
            know for the <Val>{data.purpose}</Val>, provided these representatives are bound by
            confidentiality obligations no less protective of the Disclosing Party than the applicable
            terms in this MNDA and the Receiving Party remains responsible for their compliance with this
            MNDA; and (c) protect Confidential Information using at least the same protections the
            Receiving Party uses for its own similar information but no less than a reasonable standard of
            care.
          </li>

          <li>
            <strong>Exceptions.</strong> The Receiving Party&rsquo;s obligations in this MNDA do not apply to
            information that it can demonstrate: (a) is or becomes publicly available through no fault of
            the Receiving Party; (b) it rightfully knew or possessed prior to receipt from the Disclosing
            Party without confidentiality restrictions; (c) it rightfully obtained from a third party
            without confidentiality restrictions; or (d) it independently developed without using or
            referencing the Confidential Information.
          </li>

          <li>
            <strong>Disclosures Required by Law.</strong> The Receiving Party may disclose Confidential
            Information to the extent required by law, regulation or regulatory authority, subpoena or
            court order, provided (to the extent legally permitted) it provides the Disclosing Party
            reasonable advance notice of the required disclosure and reasonably cooperates, at the
            Disclosing Party&rsquo;s expense, with the Disclosing Party&rsquo;s efforts to obtain confidential
            treatment for the Confidential Information.
          </li>

          <li>
            <strong>Term and Termination.</strong> This MNDA commences on the{' '}
            <Val>{formatDate(data.effectiveDate)}</Val> and expires{' '}
            <Val>{mndaTermText}</Val>. Either party may terminate this MNDA for any or no reason
            upon written notice to the other party. The Receiving Party&rsquo;s obligations relating to
            Confidential Information will survive for{' '}
            <Val>{confidentialityTermText}</Val>, despite any expiration or termination of this MNDA.
          </li>

          <li>
            <strong>Return or Destruction of Confidential Information.</strong> Upon expiration or
            termination of this MNDA or upon the Disclosing Party&rsquo;s earlier request, the Receiving Party
            will: (a) cease using Confidential Information; (b) promptly after the Disclosing Party&rsquo;s
            written request, destroy all Confidential Information in the Receiving Party&rsquo;s possession or
            control or return it to the Disclosing Party; and (c) if requested by the Disclosing Party,
            confirm its compliance with these obligations in writing. As an exception to subsection (b),
            the Receiving Party may retain Confidential Information in accordance with its standard backup
            or record retention policies or as required by law, but the terms of this MNDA will continue
            to apply to the retained Confidential Information.
          </li>

          <li>
            <strong>Proprietary Rights.</strong> The Disclosing Party retains all of its intellectual
            property and other rights in its Confidential Information and its disclosure to the Receiving
            Party grants no license under such rights.
          </li>

          <li>
            <strong>Disclaimer.</strong> ALL CONFIDENTIAL INFORMATION IS PROVIDED &ldquo;AS IS&rdquo;, WITH ALL
            FAULTS, AND WITHOUT WARRANTIES, INCLUDING THE IMPLIED WARRANTIES OF TITLE, MERCHANTABILITY
            AND FITNESS FOR A PARTICULAR PURPOSE.
          </li>

          <li>
            <strong>Governing Law and Jurisdiction.</strong> This MNDA and all matters relating hereto
            are governed by, and construed in accordance with, the laws of the State of{' '}
            <Val>{data.governingLaw || '[Governing Law]'}</Val>, without regard to the conflict of laws
            provisions of such <Val>{data.governingLaw || '[Governing Law]'}</Val>. Any legal suit,
            action, or proceeding relating to this MNDA must be instituted in the federal or state courts
            located in <Val>{data.jurisdiction || '[Jurisdiction]'}</Val>. Each party irrevocably submits
            to the exclusive jurisdiction of such{' '}
            <Val>{data.jurisdiction || '[Jurisdiction]'}</Val> in any such suit, action, or proceeding.
          </li>

          <li>
            <strong>Equitable Relief.</strong> A breach of this MNDA may cause irreparable harm for
            which monetary damages are an insufficient remedy. Upon a breach of this MNDA, the Disclosing
            Party is entitled to seek appropriate equitable relief, including an injunction, in addition
            to its other remedies.
          </li>

          <li>
            <strong>General.</strong> Neither party has an obligation under this MNDA to disclose
            Confidential Information to the other or proceed with any proposed transaction. Neither party
            may assign this MNDA without the prior written consent of the other party, except that either
            party may assign this MNDA in connection with a merger, reorganization, acquisition or other
            transfer of all or substantially all its assets or voting securities. Any assignment in
            violation of this Section is null and void. This MNDA will bind and inure to the benefit of
            each party&rsquo;s permitted successors and assigns. Waivers must be signed by the waiving
            party&rsquo;s authorized representative and cannot be implied from conduct. If any provision of
            this MNDA is held unenforceable, it will be limited to the minimum extent necessary so the
            rest of this MNDA remains in effect. This MNDA (including the Cover Page) constitutes the
            entire agreement of the parties with respect to its subject matter, and supersedes all prior
            and contemporaneous understandings, agreements, representations, and warranties, whether
            written or oral, regarding such subject matter. This MNDA may only be amended, modified,
            waived, or supplemented by an agreement in writing signed by both parties. Notices, requests
            and approvals under this MNDA must be sent in writing to the email or postal addresses on the
            Cover Page and are deemed delivered on receipt. This MNDA may be executed in counterparts,
            including electronic copies, each of which is deemed an original and which together form the
            same agreement.
          </li>
        </ol>

        <p className="text-xs text-gray-400 mt-10 text-center">
          Common Paper Mutual Non-Disclosure Agreement (Version 1.0) — free to use under CC BY 4.0.
        </p>
      </div>
    </div>
  )
}

function CoverRow({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <tr>
      <td className="border border-gray-300 p-3 bg-gray-50 align-top w-44">
        <div className="font-semibold text-gray-800">{label}</div>
        {hint && <div className="text-xs text-gray-500 mt-0.5">{hint}</div>}
      </td>
      <td className="border border-gray-300 p-3 text-gray-900">{children}</td>
    </tr>
  )
}
