'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, QrCode, ArrowLeft, Eye } from 'lucide-react'
import Link from 'next/link'
import QRCode from 'qrcode'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface DesignOptions {
  primaryColor: string
  textColor: string
  backgroundColor: string
  borderColor: string
  fontFamily: string
  baseFontSize: number
  lineHeight: number
  borderRadius: number
  spacing: number
  headerAlignment: 'left' | 'center' | 'right'
  logoPosition: 'left' | 'center' | 'right'
  showLogo: boolean
  showDividers: boolean
  theme: 'modern' | 'classic' | 'minimal' | 'creative'
  paperSize: 'A4' | 'Letter'
  tableStyle: 'minimal' | 'striped' | 'borders'
  currencyPosition: 'before' | 'after'
  decimals: 0 | 2
  accentStyle: 'none' | 'top-line' | 'top-bar'
  logoSize: 'sm' | 'md' | 'lg'
  dateFormat: 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'DD Mon YYYY'
  watermarkText: string
  watermarkOpacity: 0.1 | 0.2 | 0.3
}

interface InvoiceData {
  invoiceNumber: string
  issueDate: string
  dueDate: string
  currency: string
  invoiceType?: string   // ✅ Added this field to fix error
  company: {
    name: string
    address: string
    city: string
    state: string
    zip: string
    country: string
    email: string
    logo: string
    taxId?: string
    phone?: string
  }
  client: {
    name: string
    address: string
    city: string
    state: string
    zip: string
    country: string
    email: string
    taxId?: string
    phone?: string
  }
  items: Array<{
    id: string
    description: string
    quantity: number
    rate: number
    amount: number
  }>
  taxRate: number
  taxAmount: number
  discountRate: number
  discountAmount: number
  subtotal: number
  total: number
  notes: string
  terms: string
  includeWatermark: boolean
  sharedAt: string
  shortId: string
  designOptions?: DesignOptions
}

// ✅ باقی کا code آپ کا وہی رہے گا جیسے ہے، صرف InvoiceData میں invoiceType field add ہوئی ہے


export default function InvoiceViewPage({ params }: { params: { id: string } }) {
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showQRModal, setShowQRModal] = useState(false)
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('')
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [isGeneratingQR, setIsGeneratingQR] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/share/${params.id}`)
        if (res.ok) {
          const data = await res.json()
          const decodedData = data.invoice
          const completeInvoice = {
            ...decodedData,
            designOptions: data.design,
            sharedAt: data.createdAt,
            shortId: data.id,
          }
          setInvoiceData(completeInvoice)
          setLoading(false)
          return
        }
      } catch {}

      // Fallbacks: localStorage and URL data for backward compatibility
      const storedInvoices = JSON.parse(localStorage.getItem('sharedInvoices') || '{}')
      const invoice = storedInvoices[params.id]
      if (invoice) {
        setInvoiceData(invoice)
        setLoading(false)
        return
      }

      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search)
        const encodedData = urlParams.get('data')
        if (encodedData) {
          try {
            const decodedRaw = JSON.parse(atob(encodedData))
            const decodedData = decodedRaw.invoice ? { ...decodedRaw.invoice, designOptions: decodedRaw.design } : decodedRaw
            const completeInvoice = {
              ...decodedData,
              sharedAt: new Date().toISOString(),
              shortId: params.id
            }
            setInvoiceData(completeInvoice)
            setLoading(false)
            return
          } catch (error) {
            console.error('Error decoding invoice data:', error)
          }
        }
      }

      setError('Invoice not found or has expired')
      setLoading(false)
    }
    load()
  }, [params.id])

  const generateQRCode = async () => {
    if (!invoiceData) return
    
    setIsGeneratingQR(true)
    try {
      const qrData = {
        invoiceNumber: invoiceData.invoiceNumber,
        company: invoiceData.company.name,
        client: invoiceData.client.name,
        total: invoiceData.total,
        dueDate: invoiceData.dueDate,
        url: typeof window !== 'undefined' ? window.location.href : ''
      }
      
      const payload = JSON.stringify(qrData)
      const qrDataUrl = await QRCode.toDataURL(payload, {
        width: 300,
        margin: 2,
        color: { dark: '#000000', light: '#FFFFFF' }
      })
      setQrCodeDataUrl(qrDataUrl)
      setShowQRModal(true)
    } catch (error) {
      console.error('Error generating QR code:', error)
      toast.error('Failed to generate QR code')
    } finally {
      setIsGeneratingQR(false)
    }
  }

  const downloadPDF = async () => {
    if (!invoiceData) return
    
    setIsGeneratingPDF(true)
    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'),
        import('html2canvas'),
      ])
      const invoiceElement = document.getElementById('invoice-preview')
      if (!invoiceElement) {
        toast.error('Invoice preview element not found')
        return
      }

      const canvas = await html2canvas(invoiceElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      const margin = 20
      const imgWidth = 210 - (margin * 2)
      const pageHeight = 295 - (margin * 2)
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = margin

      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + margin
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`invoice-${invoiceData.invoiceNumber}.pdf`)
      toast.success('PDF downloaded successfully!')
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('Failed to generate PDF')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const getCurrencySymbol = (currencyCode: string) => {
    const currencyMap: { [key: string]: string } = {
      'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'CAD': 'C$',
      'AUD': 'A$', 'CHF': 'CHF', 'CNY': '¥', 'INR': '₹', 'PKR': 'Rs'
    }
    return currencyMap[currencyCode] || currencyCode
  }

  const formatAmount = (amount: number) => {
    const decimals = invoiceData?.designOptions?.decimals ?? 2
    const currencyPosition = invoiceData?.designOptions?.currencyPosition ?? 'before'
    const fixed = decimals === 0 ? Math.round(amount) : amount
    const numStr = decimals === 0 ? fixed.toString() : fixed.toFixed(2)
    const formatted = numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    const symbol = getCurrencySymbol(invoiceData?.currency || '')
    return currencyPosition === 'before' ? `${symbol} ${formatted}` : `${formatted} ${symbol}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoice...</p>
        </div>
      </div>
    )
  }

  if (error || !invoiceData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Invoice Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The invoice you are looking for does not exist or has expired.'}</p>
          <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
            Go back home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Invoice #{invoiceData.invoiceNumber}</h1>
            </div>
            
            <div className="flex gap-3">
              <button 
                className="btn-secondary"
                onClick={generateQRCode}
                disabled={isGeneratingQR}
              >
                <QrCode className="w-4 h-4 mr-2" />
                {isGeneratingQR ? 'Generating...' : 'QR Code'}
              </button>
              <button 
                className="btn-primary"
                onClick={downloadPDF}
                disabled={isGeneratingPDF}
              >
                <Download className="w-4 h-4 mr-2" />
                {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div
            id="invoice-preview"
            className="p-8 relative"
            style={{
              margin: '20px',
              minHeight: invoiceData.designOptions?.paperSize === 'Letter' ? '279mm' : '297mm',
              width: invoiceData.designOptions?.paperSize === 'Letter' ? '216mm' : '210mm',
              backgroundColor: invoiceData.designOptions?.backgroundColor || '#FFFFFF',
              color: invoiceData.designOptions?.textColor || '#111827',
              fontFamily: invoiceData.designOptions?.fontFamily || 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
              fontSize: (invoiceData.designOptions?.baseFontSize || 14),
              lineHeight: (invoiceData.designOptions?.lineHeight || 1.6),
              border: `1px solid ${invoiceData.designOptions?.borderColor || '#E5E7EB'}`,
              borderRadius: (invoiceData.designOptions?.borderRadius || 12)
            }}
          >
            {invoiceData.includeWatermark && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10" style={{ opacity: invoiceData.designOptions?.watermarkOpacity || 0.1 }}>
                <div className="text-6xl font-bold" style={{ color: invoiceData.designOptions?.primaryColor || '#1F2937' }}>
                  {invoiceData.designOptions?.watermarkText || 'Invoice Meta'}
                </div>
              </div>
            )}
            
            <div className="text-center mb-8">
              {invoiceData.designOptions?.accentStyle && invoiceData.designOptions.accentStyle !== 'none' && (
                <div className={invoiceData.designOptions.accentStyle === 'top-bar' ? 'h-3 mb-4 rounded' : 'h-px mb-4'} style={{ backgroundColor: invoiceData.designOptions.primaryColor || '#1F2937' }} />
              )}
              <div className={`flex items-center ${invoiceData.designOptions?.headerAlignment === 'center' ? 'justify-center' : invoiceData.designOptions?.headerAlignment === 'right' ? 'justify-end' : 'justify-start'} gap-4 mb-4`}>
                {invoiceData.company.logo && (
                  <img
                    src={invoiceData.company.logo}
                    alt="Company Logo"
                    className="object-contain"
                    style={{
                      width: invoiceData.designOptions?.logoSize === 'sm' ? 40 : invoiceData.designOptions?.logoSize === 'lg' ? 96 : 64,
                      height: invoiceData.designOptions?.logoSize === 'sm' ? 40 : invoiceData.designOptions?.logoSize === 'lg' ? 96 : 64,
                      order: invoiceData.designOptions?.logoPosition === 'right' ? 2 : invoiceData.designOptions?.logoPosition === 'center' ? 1 : 0
                    }}
                  />
                )}
                <div>
                  <h1 className="text-2xl font-bold mb-2" style={{ color: invoiceData.designOptions?.primaryColor || '#1F2937' }}>INVOICE</h1>
                  <p className="text-gray-600">#{invoiceData.invoiceNumber}</p>
                  {invoiceData.invoiceType && <p className="text-xs text-gray-500 mt-1">{invoiceData.invoiceType}</p>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="pl-4">
                <h3 className="font-semibold text-gray-900 mb-3">From:</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-medium">{invoiceData.company.name}</p>
                  {invoiceData.company.taxId && <p>Tax ID: {invoiceData.company.taxId}</p>}
                  {invoiceData.company.email && <p className="text-blue-600">{invoiceData.company.email}</p>}
                  {invoiceData.company.phone && <p>{invoiceData.company.phone}</p>}
                  <p>{invoiceData.company.address}</p>
                  <p>{invoiceData.company.city}, {invoiceData.company.state} {invoiceData.company.zip}</p>
                  <p>{invoiceData.company.country}</p>
                </div>
              </div>
              <div className="pr-4">
                <h3 className="font-semibold text-gray-900 mb-3">To:</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-medium">{invoiceData.client.name}</p>
                  {invoiceData.client.taxId && <p>Tax ID: {invoiceData.client.taxId}</p>}
                  {invoiceData.client.email && <p className="text-blue-600">{invoiceData.client.email}</p>}
                  {invoiceData.client.phone && <p>{invoiceData.client.phone}</p>}
                  <p>{invoiceData.client.address}</p>
                  <p>{invoiceData.client.city}, {invoiceData.client.state} {invoiceData.client.zip}</p>
                  <p>{invoiceData.client.country}</p>
                </div>
              </div>
            </div>

            <div className="mb-8 px-4">
              <div className="flex justify-between text-sm mb-2" style={{ opacity: 0.8 }}>
                <span>Issue Date: {invoiceData.issueDate}</span>
                <span>Due Date: {invoiceData.dueDate}</span>
              </div>
            </div>

            <div className="mb-8 px-4">
              <table className="w-full text-sm" style={invoiceData.designOptions?.tableStyle === 'borders' ? { border: `1px solid ${invoiceData.designOptions?.borderColor || '#E5E7EB'}`, borderCollapse: 'collapse' } : undefined}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${invoiceData.designOptions?.borderColor || '#E5E7EB'}` }}>
                    <th className="text-left py-3 px-2">Description</th>
                    <th className="text-right py-3 px-2">Qty</th>
                    <th className="text-right py-3 px-2">Rate</th>
                    <th className="text-right py-3 px-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((item, index) => (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: invoiceData.designOptions?.tableStyle !== 'minimal' ? `1px solid ${invoiceData.designOptions?.borderColor || '#E5E7EB'}` : 'none',
                        backgroundColor: invoiceData.designOptions?.tableStyle === 'striped' && index % 2 === 1 ? '#F9FAFB' : 'transparent'
                      }}
                    >
                      <td className="py-3 px-2" style={invoiceData.designOptions?.tableStyle === 'borders' ? { borderRight: `1px solid ${invoiceData.designOptions?.borderColor || '#E5E7EB'}` } : undefined}>{item.description}</td>
                      <td className="text-right py-3 px-2" style={invoiceData.designOptions?.tableStyle === 'borders' ? { borderRight: `1px solid ${invoiceData.designOptions?.borderColor || '#E5E7EB'}` } : undefined}>{item.quantity}</td>
                      <td className="text-right py-3 px-2" style={invoiceData.designOptions?.tableStyle === 'borders' ? { borderRight: `1px solid ${invoiceData.designOptions?.borderColor || '#E5E7EB'}` } : undefined}>{formatAmount(item.rate)}</td>
                      <td className="text-right py-3 px-2">{formatAmount(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-right px-4 mb-8">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatAmount(invoiceData.subtotal)}</span>
                </div>
                {invoiceData.taxRate > 0 && (
                  <div className="flex justify-between" style={{ color: '#ef4444' }}>
                    <span>Tax ({invoiceData.taxRate}%):</span>
                    <span>+{formatAmount(invoiceData.taxAmount)}</span>
                  </div>
                )}
                {invoiceData.discountRate > 0 && (
                  <div className="flex justify-between" style={{ color: '#10b981' }}>
                    <span>Discount ({invoiceData.discountRate}%):</span>
                    <span>-{formatAmount(invoiceData.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-3" style={{ borderTop: `1px solid ${invoiceData.designOptions?.borderColor || '#E5E7EB'}` }}>
                  <span>Total:</span>
                  <span style={{ color: invoiceData.designOptions?.primaryColor || '#1F2937' }}>{formatAmount(invoiceData.total)}</span>
                </div>
              </div>
            </div>

            {(invoiceData.notes || invoiceData.terms) && (
              <div className="mt-8 pt-6 border-t border-gray-200 px-4">
                {invoiceData.notes && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Notes:</h4>
                    <p className="text-sm text-gray-600">{invoiceData.notes}</p>
                  </div>
                )}
                {invoiceData.terms && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Terms & Conditions:</h4>
                    <p className="text-sm text-gray-600">{invoiceData.terms}</p>
                  </div>
                )}
              </div>
            )}

            {/* Removed promotional footer for a clean viewer/PDF */}
          </div>
        </motion.div>
      </div>

      {showQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">QR Code</h3>
            <div className="text-center mb-4">
              {qrCodeDataUrl && (
                <img src={qrCodeDataUrl} alt="Invoice QR Code" className="mx-auto mb-4" />
              )}
              <p className="text-sm text-gray-600 mb-4">
                Scan this QR code to view the invoice details
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (qrCodeDataUrl) {
                    const link = document.createElement('a')
                    link.download = `invoice-qr-${invoiceData.invoiceNumber}.png`
                    link.href = qrCodeDataUrl
                    link.click()
                  }
                }}
                className="btn-primary flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Download QR
              </button>
              <button
                onClick={() => setShowQRModal(false)}
                className="btn-secondary flex-1"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  )
}
