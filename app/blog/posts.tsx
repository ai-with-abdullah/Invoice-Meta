import { ReactNode } from 'react'

export type FAQ = { question: string; answer: string }

export type Post = {
  id: number
  slug: string
  title: string
  excerpt: string
  author: string
  date: string
  category: string
  readTime: string
  tags: string[]
  content: () => ReactNode
  faqs?: FAQ[]
}

export const posts: Post[] = [
  {
    id: 1,
    slug: 'professional-invoice-design-tips-2025',
    title: '10 Practical Tips for Professional Invoice Design (2025)',
    excerpt:
      'Simple, client‑friendly invoice design principles that speed up payments and strengthen your brand—tested with real clients.',
    author: 'Invoice Team',
    date: '2025-01-15',
    category: 'Design',
    readTime: '7 min read',
    tags: ['invoice design', 'branding', 'UX'],
    content: () => (
      <>
        <p>
          Clean invoices get paid faster. A professional design reduces confusion, limits back‑and‑forth,
          and reflects your brand. Here are ten practical ideas that work for freelancers, agencies, and
          small businesses.
        </p>
        <h3>1) Keep the layout scannable</h3>
        <p>
          Use clear sections for business details, client details, items, totals, and payment instructions.
          Avoid dense blocks of text and keep a consistent left alignment for labels.
        </p>
        <h3>2) Use one accent color</h3>
        <p>
          Color helps hierarchy, but too many shades look messy. Pick one brand color for headings and
          highlights. Ensure strong contrast for accessibility.
        </p>
        <h3>3) Emphasize due date and total</h3>
        <p>
          The amount due and the deadline should be visually prominent. Clients should understand “how much”
          and “by when” in seconds.
        </p>
        <h3>4) Add polite, direct payment instructions</h3>
        <p>
          Provide bank details, links, or QR codes. Short, friendly copy reduces friction and improves on‑time
          payment rates.
        </p>
        <h3>5) Use consistent typography</h3>
        <p>
          Limit fonts to one family with clear weights. Keep body text between 12–14px and headings 18–24px.
        </p>
        <h3>6) Include purchase order and tax fields when relevant</h3>
        <p>
          B2B clients often require POs or VAT IDs. Having fields ready prevents delays.
        </p>
        <h3>7) Clarify discounts and taxes</h3>
        <p>
          Show line items, rates, taxes, and any discount as separate rows. Transparency builds trust.
        </p>
        <h3>8) Add brand elements carefully</h3>
        <p>
          A small logo and a subtle color bar are enough. Let content stay readable on print and PDF.
        </p>
        <h3>9) Provide a short thank‑you note</h3>
        <p>
          Friendly closers improve client relationships and reduce disputes.
        </p>
        <h3>10) Export crisp PDFs</h3>
        <p>
          Always preview the final PDF. Check totals, fonts, and margins before sending.
        </p>
        <h3>Bonus: Accessible defaults</h3>
        <p>
          Aim for WCAG‑friendly color contrast and legible font sizes. Accessibility improves trust and
          reduces approval friction for large organizations.
        </p>
        <p>
          Further reading: <a href="https://www.gov.uk/invoicing-and-taking-payment-from-customers" target="_blank" rel="noopener noreferrer">UK invoicing guidance</a>,{' '}
          <a href="https://www.irs.gov/businesses/small-businesses-self-employed/recordkeeping" target="_blank" rel="noopener noreferrer">US recordkeeping basics</a>.
        </p>
      </>
    ),
  },
  {
    id: 2,
    slug: 'invoice-payment-terms-that-improve-cash-flow',
    title: 'Invoice Payment Terms That Improve Cash Flow',
    excerpt:
      'Clear terms and a predictable process reduce late payments. Here is a practical setup you can copy.',
    author: 'Invoice Team',
    date: '2025-01-10',
    category: 'Finance',
    readTime: '6 min read',
    tags: ['payments', 'terms', 'cash flow'],
    content: () => (
      <>
        <p>
          The best payment terms are simple and easy to accept. State when payment is due, accepted methods,
          and what happens if a deadline is missed. Consistency is key.
        </p>
        <h3>Recommended structure</h3>
        <ul>
          <li>Due within 7–14 days for ongoing work; due on receipt for small fixed jobs</li>
          <li>Late fee after a short grace period (for example, 1.5% per month where legal)</li>
          <li>Accepted methods: bank transfer, card, and wallet where available</li>
          <li>Clear reference line to match payments automatically</li>
        </ul>
        <h3>Templates you can copy</h3>
        <p>
          “Payment due within 10 days by bank transfer or card. Please include the invoice number in the
          payment reference. A late fee may apply after the grace period.”
        </p>
        <p>
          Firm but fair terms help you get paid on time without damaging relationships.
          For country guidance see the{' '}
          <a href="https://europa.eu/youreurope/business/finance-funding/getting-paid/late-payment/index_en.htm" target="_blank" rel="noopener noreferrer">EU Late Payment rules</a> and the{' '}
          <a href="https://www.consumerfinance.gov/" target="_blank" rel="noopener noreferrer">US CFPB resources</a>.
        </p>
      </>
    ),
  },
  {
    id: 3,
    slug: 'handling-late-payments-professionally',
    title: 'How to Handle Late Payments Professionally',
    excerpt:
      'Templates and steps to follow when an invoice becomes overdue—while keeping the client relationship strong.',
    author: 'Invoice Team',
    date: '2025-01-05',
    category: 'Operations',
    readTime: '6 min read',
    tags: ['collections', 'clients'],
    content: () => (
      <>
        <p>
          Start with a gentle reminder, then escalate in clear, polite steps. Document each contact and
          keep copies of the signed agreement and sent invoices.
        </p>
        <h3>Escalation ladder</h3>
        <ol>
          <li>Friendly reminder 2–3 days after due date</li>
          <li>Firm reminder with late fee policy</li>
          <li>Phone call and revised deadline</li>
          <li>Final notice and next steps</li>
        </ol>
        <p>
          When used consistently, this approach recovers most payments without legal action.
        </p>
        <h3>Short reminder you can send</h3>
        <p>
          “Hi [Name], a quick check on invoice [#] due [date]. Could you confirm payment timing? Thank you!”
        </p>
      </>
    ),
  },
  {
    id: 4,
    slug: 'branding-your-invoices-for-trust',
    title: 'Branding Your Invoices for Trust and Faster Approvals',
    excerpt:
      'Subtle branding can improve approval rates without compromising readability. Here is what to include.',
    author: 'Invoice Team',
    date: '2025-01-02',
    category: 'Branding',
    readTime: '5 min read',
    tags: ['branding', 'design'],
    content: () => (
      <>
        <p>
          Buyers approve invoices faster when your identity is consistent. Use the same logo, color, and
          sender email each time. Keep the layout clean and predictable.
        </p>
        <p>
          Include a short tagline or project reference to help the recipient match work to payment.
        </p>
        <h3>Checklist</h3>
        <ul>
          <li>High‑resolution logo</li>
          <li>Consistent sender name and email</li>
          <li>Clear project or PO reference</li>
          <li>Readable color contrast</li>
        </ul>
      </>
    ),
  },
  {
    id: 5,
    slug: 'international-invoices-vat-and-tax-basics',
    title: 'International Invoices: VAT and Tax Basics',
    excerpt:
      'The essential fields to include when billing overseas clients, with links to trusted resources.',
    author: 'Invoice Team',
    date: '2025-01-01',
    category: 'Compliance',
    readTime: '8 min read',
    tags: ['international', 'VAT', 'compliance'],
    content: () => (
      <>
        <p>
          International billing requires accurate tax information. Always include the seller and buyer tax IDs,
          the place of supply, and the applicable tax rate or exemption reference.
        </p>
        <p>
          For EU trade, consult the{' '}
          <a href="https://taxation-customs.ec.europa.eu/vat-where-you-are-established-or-have-fixed-establishment_en" target="_blank" rel="noopener noreferrer">European Commission VAT guidance</a>.
          For US sales tax context, see{' '}
          <a href="https://www.taxadmin.org/" target="_blank" rel="noopener noreferrer">Federation of Tax Administrators</a>.
        </p>
        <p>
          Always confirm rules with a qualified professional in your jurisdiction before issuing cross‑border
          invoices.
        </p>
      </>
    ),
  },
  {
    id: 6,
    slug: 'cash-flow-management-for-small-businesses',
    title: 'Cash Flow Management for Small Businesses',
    excerpt:
      'Simple forecasting, invoicing cadence, and follow‑up routines that stabilize cash flow.',
    author: 'Invoice Team',
    date: '2024-12-20',
    category: 'Finance',
    readTime: '7 min read',
    tags: ['cash flow', 'planning'],
    content: () => (
      <>
        <p>
          Healthy cash flow relies on predictable invoicing and disciplined follow‑ups. Send invoices promptly,
          set short terms, and reconcile payments weekly.
        </p>
        <h3>Quick checklist</h3>
        <ul>
          <li>Invoice immediately after delivery</li>
          <li>Offer digital payment options</li>
          <li>Automate reminders</li>
          <li>Maintain a 3‑month forecast</li>
        </ul>
        <p>
          A light weekly finance routine beats end‑of‑month catch‑up. Put 30 minutes on the calendar.
        </p>
      </>
    ),
  },
  {
    id: 7,
    slug: 'freelancer-invoicing-best-practices',
    title: 'Freelancer Invoicing: Best Practices That Get You Paid',
    excerpt:
      'From clear scope to payment links—habits that reduce disputes and delays for independent pros.',
    author: 'Invoice Team',
    date: '2024-12-10',
    category: 'Freelancing',
    readTime: '6 min read',
    tags: ['freelancer', 'clients', 'process'],
    content: () => (
      <>
        <p>
          Use a consistent invoice template, include work logs where appropriate, and provide at least two
          payment methods. Keep tone professional and friendly.
        </p>
        <h3>Simple habit loop</h3>
        <ul>
          <li>Confirm scope and deposit before starting</li>
          <li>Send a mid‑project summary</li>
          <li>Invoice same‑day on completion</li>
          <li>Schedule follow‑ups in your calendar</li>
        </ul>
      </>
    ),
  },
  {
    id: 8,
    slug: 'ecommerce-invoicing-for-online-stores',
    title: 'E‑commerce Invoicing for Online Stores',
    excerpt:
      'Order matching, partial shipments, and tax handling for multi‑channel sellers.',
    author: 'Invoice Team',
    date: '2024-12-01',
    category: 'E‑commerce',
    readTime: '7 min read',
    tags: ['ecommerce', 'ops', 'tax'],
    content: () => (
      <>
        <p>
          Match invoice numbers to order IDs, include return policies, and handle mixed tax rates per jurisdiction.
          Export a clean PDF for customers and your records.
        </p>
        <p>
          For marketplaces, align your invoice fields with their requirements to avoid disputes.
        </p>
      </>
    ),
  },
  {
    id: 9,
    slug: 'saas-invoicing-metrics-and-billing-cadence',
    title: 'SaaS Invoicing: Metrics and Billing Cadence That Reduce Churn',
    excerpt:
      'Practical invoicing rhythms and statements that keep subscription cash flow healthy.',
    author: 'Invoice Team',
    date: '2025-01-20',
    category: 'SaaS',
    readTime: '6 min read',
    tags: ['SaaS', 'billing', 'retention'],
    content: () => (
      <>
        <p>
          Consistent renewal emails, clear proration lines, and predictable billing dates reduce churn.
          Send statements ahead of renewals with a short summary of value delivered.
        </p>
      </>
    ),
  },
  {
    id: 10,
    slug: 'invoice-email-templates-that-get-opens-and-payments',
    title: 'Invoice Email Templates That Get Opens and Payments',
    excerpt:
      'Subject lines, message structure, and timing that move invoices through approvals fast.',
    author: 'Invoice Team',
    date: '2025-01-18',
    category: 'Communication',
    readTime: '7 min read',
    tags: ['email', 'templates', 'collections'],
    content: () => (
      <>
        <p>
          Keep subject lines short and specific. In the body, restate the amount, due date, and payment link.
          Add a one‑sentence project reminder and a polite closing.
        </p>
      </>
    ),
  },
  {
    id: 11,
    slug: 'us-sales-tax-invoice-requirements-2025',
    title: 'United States: Sales Tax and Invoice Requirements (2025)',
    excerpt:
      'Key fields and practical tips to keep US invoices compliant across states in 2025.',
    author: 'Invoice Team',
    date: '2025-01-22',
    category: 'Compliance',
    readTime: '9 min read',
    tags: ['US', 'sales tax', 'compliance'],
    content: () => (
      <>
        <p>
          US invoicing practices vary by state. While there is no federal VAT, sales tax is administered at
          the state and local level. Include seller details, buyer details, item descriptions, quantity, unit
          price, tax rate, and total. Use clear notes for exemptions or destination‑based rates.
        </p>
        <p>
          Multi‑state sellers should track nexus and keep documentation for exempt sales. Automating a tax
          summary line per jurisdiction reduces reconciliation issues.
        </p>
        <p>
          Reference: <a href="https://www.taxadmin.org/" target="_blank" rel="noreferrer noopener">Federation of Tax Administrators</a>.
        </p>
      </>
    ),
    faqs: [
      { question: 'Do I need to show state and local tax separately?', answer: 'It is good practice to show the combined rate and, if relevant, a breakdown for state and local components.' },
      { question: 'What if the sale is tax‑exempt?', answer: 'Collect a valid exemption certificate and note the exemption on the invoice for your records.' },
    ],
  },
  {
    id: 12,
    slug: 'uk-vat-invoice-rules-for-small-businesses-2025',
    title: 'United Kingdom: VAT Invoice Rules for Small Businesses (2025)',
    excerpt:
      'What to include on UK VAT invoices and how to avoid common mistakes after Making Tax Digital.',
    author: 'Invoice Team',
    date: '2025-01-22',
    category: 'Compliance',
    readTime: '10 min read',
    tags: ['UK', 'VAT', 'MTD'],
    content: () => (
      <>
        <p>
          UK VAT invoices require your business name, address, VAT number, an invoice number, date, supply date
          (if different), customer details, a description of goods or services, unit price, VAT rate, amount of
          VAT, and the total. For simplified VAT invoices under £250, fewer details may be allowed.
        </p>
        <p>
          For zero‑rated or exempt items, mark the correct rate and cite the reason. Digital record‑keeping and
          compatible software help you comply with Making Tax Digital (MTD).
        </p>
        <p>
          Reference: <a href="https://www.gov.uk/vat-record-keeping" target="_blank" rel="noreferrer noopener">HMRC VAT record keeping</a>.
        </p>
      </>
    ),
    faqs: [
      { question: 'Do I need to show VAT per line item?', answer: 'Show VAT rate per line and total VAT for the invoice. For mixed rates, clarity is essential.' },
      { question: 'Are simplified VAT invoices allowed?', answer: 'Yes, for amounts under £250, simplified details may be used. Check HMRC rules for specifics.' },
    ],
  },
  {
    id: 13,
    slug: 'canada-gst-hst-invoice-basics-2025',
    title: 'Canada: GST/HST Invoice Basics (2025)',
    excerpt:
      'How to format Canadian invoices with GST/HST, including registration numbers and thresholds.',
    author: 'Invoice Team',
    date: '2025-01-22',
    category: 'Compliance',
    readTime: '9 min read',
    tags: ['Canada', 'GST', 'HST'],
    content: () => (
      <>
        <p>
          Canadian invoices typically include the supplier’s business name, address, the GST/HST registration
          number if registered, invoice date and number, customer details, description, amounts, and the tax
          charged (GST/HST or provincial taxes where applicable).
        </p>
        <p>
          For place‑of‑supply rules, ensure you are using the right rate for the customer’s province. Keep
          records that tie amounts to filed returns.
        </p>
        <p>
          Reference: <a href="https://www.canada.ca/en/revenue-agency.html" target="_blank" rel="noreferrer noopener">Canada Revenue Agency</a>.
        </p>
      </>
    ),
    faqs: [
      { question: 'Do I always need a GST/HST number?', answer: 'Register once you exceed the small supplier threshold or choose to register earlier to claim input tax credits.' },
      { question: 'What about PST/QST?', answer: 'Some provinces apply separate sales taxes. Confirm local rules and show applicable amounts clearly.' },
    ],
  },
  {
    id: 14,
    slug: 'australia-gst-tax-invoice-requirements-2025',
    title: 'Australia: GST Tax Invoice Requirements (2025)',
    excerpt:
      'Fields to include on Australian tax invoices and when to use a simplified format.',
    author: 'Invoice Team',
    date: '2025-01-22',
    category: 'Compliance',
    readTime: '8 min read',
    tags: ['Australia', 'GST', 'ATO'],
    content: () => (
      <>
        <p>
          Australian tax invoices should show your identity, ABN, the words “Tax invoice” (if GST registered),
          invoice date, a description of items, the GST amount payable (if any), and the extent to which sales are
          taxable. For sales under AUD 1,000, simplified invoices are allowed.
        </p>
        <p>
          Reference: <a href="https://www.ato.gov.au/" target="_blank" rel="noreferrer noopener">Australian Taxation Office (ATO)</a>.
        </p>
      </>
    ),
    faqs: [
      { question: 'Do I need to include my ABN?', answer: 'Yes, if you are GST‑registered. It helps customers claim credits.' },
      { question: 'When is a simplified tax invoice valid?', answer: 'When the total sale is AUD 1,000 or less, provided key fields are present.' },
    ],
  },
  {
    id: 15,
    slug: 'us-independent-contractor-invoicing-2025',
    title: 'US Independent Contractor Invoicing: Practical Guide (2025)',
    excerpt:
      'What freelancers in the US should include on invoices and how to reduce payment delays.',
    author: 'Invoice Team',
    date: '2025-01-23',
    category: 'Freelancing',
    readTime: '10 min read',
    tags: ['US', 'freelance', 'payments'],
    content: () => (
      <>
        <p>
          Use a predictable template, add W‑9 details when requested, and state payment methods clearly. For
          recurring work, send invoices on a fixed weekday so clients expect them.
        </p>
      </>
    ),
    faqs: [
      { question: 'Should I include my EIN?', answer: 'Include the tax ID your client requests (SSN or EIN). Share securely and only when needed.' },
      { question: 'How soon should I invoice?', answer: 'Invoice as soon as deliverables are approved; same‑day invoicing improves on‑time payment.' },
    ],
  },
  {
    id: 16,
    slug: 'uk-self-employed-invoice-tips-2025',
    title: 'UK Self‑Employed: Invoice Tips That Speed Up Payment (2025)',
    excerpt:
      'A friendly template and payment options that work well with UK clients and accounts teams.',
    author: 'Invoice Team',
    date: '2025-01-23',
    category: 'Freelancing',
    readTime: '9 min read',
    tags: ['UK', 'self‑employed', 'payments'],
    content: () => (
      <>
        <p>
          Use plain language for line items, reference the PO where applicable, and provide bank details plus a
          card option. Confirm your VAT status to avoid confusion.
        </p>
      </>
    ),
    faqs: [
      { question: 'Do I need to charge VAT?', answer: 'Only if you are VAT‑registered or required to register. Otherwise, state that your prices do not include VAT.' },
      { question: 'What payment methods are common?', answer: 'Bank transfer is standard, but offering card or wallet can reduce delays.' },
    ],
  },
  {
    id: 17,
    slug: 'canada-small-business-payment-terms-2025',
    title: 'Canada Small Business: Payment Terms That Work (2025)',
    excerpt:
      'Clear, polite terms that Canadian clients accept easily—and that protect your cash flow.',
    author: 'Invoice Team',
    date: '2025-01-23',
    category: 'Finance',
    readTime: '8 min read',
    tags: ['Canada', 'payment terms', 'cash flow'],
    content: () => (
      <>
        <p>
          Keep terms short (Net 10–14 where possible), include late fees where lawful, and provide electronic
          payment options. Add bilingual notes when appropriate.
        </p>
      </>
    ),
    faqs: [
      { question: 'Are late fees enforceable?', answer: 'Often yes, but ensure your contract and provincial law allow them. Keep language clear and fair.' },
      { question: 'Should I offer card payments?', answer: 'Offering card or Interac e‑Transfer can speed up approvals for small invoices.' },
    ],
  },
  {
    id: 18,
    slug: 'australia-late-payment-guide-2025',
    title: 'Australia: Handling Late Payments with Care (2025)',
    excerpt:
      'Step‑by‑step reminders and policies that improve collection while keeping client relationships strong.',
    author: 'Invoice Team',
    date: '2025-01-23',
    category: 'Operations',
    readTime: '8 min read',
    tags: ['Australia', 'late payments', 'collections'],
    content: () => (
      <>
        <p>
          Start with a friendly message, then escalate. Keep records and offer simple payment links. For
          government suppliers, align with standard payment timeframes.
        </p>
      </>
    ),
    faqs: [
      { question: 'Can I charge interest on late payments?', answer: 'Check your contract and applicable state or territory laws before applying interest.' },
      { question: 'What message should I send first?', answer: 'A short, polite reminder with the invoice number and due date is usually enough.' },
    ],
  },
  {
    id: 19,
    slug: 'us-saas-invoicing-compliance-2025',
    title: 'US SaaS Invoicing: Compliance and Revenue Recognition (2025)',
    excerpt:
      'Notes on tax nexus, proration, and statements that reduce disputes for subscription businesses.',
    author: 'Invoice Team',
    date: '2025-01-24',
    category: 'SaaS',
    readTime: '9 min read',
    tags: ['US', 'SaaS', 'compliance'],
    content: () => (
      <>
        <p>
          Show proration lines on upgrades and downgrades, confirm tax handling per state, and make renewal dates
          predictable. Summaries on statements reduce confusion for finance teams.
        </p>
      </>
    ),
    faqs: [
      { question: 'Do I need to collect sales tax on SaaS?', answer: 'It depends on the state. Many treat SaaS as taxable; monitor nexus and apply correct rates.' },
      { question: 'How do I show proration?', answer: 'List the period covered and the credit/charge lines with dates for clarity.' },
    ],
  },
  {
    id: 20,
    slug: 'uk-eu-cross-border-invoicing-after-brexit-2025',
    title: 'UK–EU Cross‑Border Invoicing After Brexit (2025)',
    excerpt:
      'What UK businesses should include on invoices for EU customers, and common pitfalls to avoid.',
    author: 'Invoice Team',
    date: '2025-01-24',
    category: 'Compliance',
    readTime: '9 min read',
    tags: ['UK', 'EU', 'cross‑border'],
    content: () => (
      <>
        <p>
          Determine the place of supply, include VAT or reverse‑charge references when required, and attach EORI
          details for goods. Keep evidence for zero‑rated exports.
        </p>
      </>
    ),
    faqs: [
      { question: 'Do I charge UK VAT to EU businesses?', answer: 'Often no, if the reverse‑charge applies. Show the correct reference and collect the customer’s VAT number.' },
      { question: 'What identifiers are needed for goods?', answer: 'Include your EORI where relevant and match customs paperwork.' },
    ],
  },
]

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug)
}

