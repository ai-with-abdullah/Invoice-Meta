'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Trash2, 
  Copy, 
  Download, 
  Eye, 
  Settings, 
  Palette,
  Type,
  Layout,
  Image,
  Calculator,
  Globe,
  CreditCard,
  FileText,
  Star,
  Zap,
  Share2,
  QrCode,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Globe2,
  CreditCard as CreditCardIcon
} from 'lucide-react'
import Link from 'next/link'

interface InvoiceItem {
  id: string
  type: 'product' | 'service' | 'discount' | 'tax' | 'shipping'
  description: string
  quantity: number
  unit: string
  rate: number
  discount: number
  tax: number
  amount: number
  notes?: string
}

interface InvoiceData {
  invoiceNumber: string
  issueDate: string
  dueDate: string
  currency: string
  language: string
  company: {
    name: string
    address: string
    city: string
    state: string
    zip: string
    country: string
    email: string
    phone: string
    website: string
    logo?: string
    taxId: string
  }
  client: {
    name: string
    address: string
    city: string
    state: string
    zip: string
    country: string
    email: string
    phone: string
    taxId: string
  }
  items: InvoiceItem[]
  subtotal: number
  totalDiscount: number
  totalTax: number
  totalShipping: number
  total: number
  notes: string
  terms: string
  paymentInstructions: string
  footer: string
}

const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SEK', 'NOK', 'DKK']
const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Dutch', 'Russian', 'Chinese', 'Japanese']
const units = ['piece', 'hour', 'day', 'week', 'month', 'year', 'kg', 'lb', 'm', 'ft', 'liter', 'gallon']

export default function AdvancedInvoiceBuilder() {
  const [mounted, setMounted] = useState(false)
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    currency: 'USD',
    language: 'English',
    company: {
      name: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      email: '',
      phone: '',
      website: '',
      taxId: ''
    },
    client: {
      name: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      email: '',
      phone: '',
      taxId: ''
    },
    items: [
      {
        id: '1',
        type: 'service',
        description: '',
        quantity: 1,
        unit: 'hour',
        rate: 0,
        discount: 0,
        tax: 0,
        amount: 0
      }
    ],
    subtotal: 0,
    totalDiscount: 0,
    totalTax: 0,
    totalShipping: 0,
    total: 0,
    notes: '',
    terms: '',
    paymentInstructions: '',
    footer: ''
  })

  const [activeTab, setActiveTab] = useState('builder')
  const [showPreview, setShowPreview] = useState(false)
  const [customizationMode, setCustomizationMode] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const [dragMode, setDragMode] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Ensure client-side rendering
  useEffect(() => {
    setMounted(true)
  }, [])

  // Calculate totals whenever items change
  useEffect(() => {
    const subtotal = invoiceData.items.reduce((sum, item) => {
      const itemTotal = (item.quantity * item.rate) - item.discount
      return sum + itemTotal
    }, 0)

    const totalDiscount = invoiceData.items.reduce((sum, item) => sum + item.discount, 0)
    const totalTax = invoiceData.items.reduce((sum, item) => sum + item.tax, 0)
    const total = subtotal + totalTax + invoiceData.totalShipping

    setInvoiceData(prev => ({
      ...prev,
      subtotal,
      totalDiscount,
      totalTax,
      total
    }))
  }, [invoiceData.items, invoiceData.totalShipping])

  const addItem = (type: InvoiceItem['type'] = 'service') => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      type,
      description: '',
      quantity: 1,
      unit: 'piece',
      rate: 0,
      discount: 0,
      tax: 0,
      amount: 0
    }
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }))
  }

  const removeItem = (id: string) => {
    if (invoiceData.items.length > 1) {
      setInvoiceData(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== id)
      }))
    }
  }

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }
          if (field === 'quantity' || field === 'rate') {
            updatedItem.amount = updatedItem.quantity * updatedItem.rate
          }
          return updatedItem
        }
        return item
      })
    }))
  }

  const duplicateItem = (id: string) => {
    const itemToDuplicate = invoiceData.items.find(item => item.id === id)
    if (itemToDuplicate) {
      const newItem = {
        ...itemToDuplicate,
        id: Date.now().toString(),
        description: `${itemToDuplicate.description} (Copy)`
      }
      setInvoiceData(prev => ({
        ...prev,
        items: [...prev.items, newItem]
      }))
    }
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setInvoiceData(prev => ({
          ...prev,
          company: { ...prev.company, logo: e.target?.result as string }
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const generateInvoice = () => {
    console.log('Generating invoice:', invoiceData)
    alert('Invoice generated successfully!')
  }

  const saveDraft = () => {
    localStorage.setItem('invoiceDraft', JSON.stringify(invoiceData))
    alert('Draft saved successfully!')
  }

  const loadDraft = () => {
    const draft = localStorage.getItem('invoiceDraft')
    if (draft) {
      setInvoiceData(JSON.parse(draft))
      alert('Draft loaded successfully!')
    }
  }

  const shareInvoice = () => {
    if (navigator.share) {
      navigator.share({
        title: `Invoice ${invoiceData.invoiceNumber}`,
        text: `Invoice ${invoiceData.invoiceNumber} for ${invoiceData.client.name}`,
        url: window.location.href
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Invoice link copied to clipboard!')
    }
  }

  const generateQRCode = () => {
    setShowQRCode(!showQRCode)
  }

  const updateCompanyInfo = (field: keyof InvoiceData['company'], value: string) => {
    setInvoiceData(prev => ({
      ...prev,
      company: { ...prev.company, [field]: value }
    }))
  }

  const updateClientInfo = (field: keyof InvoiceData['client'], value: string) => {
    setInvoiceData(prev => ({
      ...prev,
      client: { ...prev.client, [field]: value }
    }))
  }

  const updateInvoiceSettings = (field: keyof InvoiceData, value: any) => {
    setInvoiceData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const tabs = [
    { id: 'builder', name: 'Invoice Builder', icon: FileText },
    { id: 'company', name: 'Company Info', icon: Building2 },
    { id: 'client', name: 'Client Info', icon: User },
    { id: 'preview', name: 'Live Preview', icon: Eye },
    { id: 'settings', name: 'Settings', icon: Settings }
  ]

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">Advanced Invoice Builder</h1>
              <div className="hidden sm:flex items-center space-x-2">
                <span className="text-sm text-gray-500">Template:</span>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-2 py-1"
                >
                  <option value="modern">Modern</option>
                  <option value="classic">Classic</option>
                  <option value="minimal">Minimal</option>
                  <option value="creative">Creative</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={saveDraft}
                className="btn-secondary text-sm px-4 py-2"
              >
                Save Draft
              </button>
              <button
                onClick={loadDraft}
                className="btn-secondary text-sm px-4 py-2"
              >
                Load Draft
              </button>
              <button
                onClick={shareInvoice}
                className="btn-secondary text-sm px-4 py-2"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
              <button
                onClick={generateQRCode}
                className="btn-secondary text-sm px-4 py-2"
              >
                <QrCode className="w-4 h-4 mr-2" />
                QR Code
              </button>
              <button
                onClick={generateInvoice}
                className="btn-primary text-sm px-4 py-2"
              >
                Generate Invoice
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700 shadow-medium'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.name}
              </button>
            )
          })}
        </div>

        {/* QR Code Modal */}
        {showQRCode && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Invoice QR Code</h3>
                <button
                  onClick={() => setShowQRCode(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="bg-gray-100 p-8 rounded-lg text-center">
                <QrCode className="w-32 h-32 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600">QR Code for Invoice {invoiceData.invoiceNumber}</p>
                <p className="text-xs text-gray-500 mt-2">Scan to view invoice details</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'builder' && (
            <motion.div
              key="builder"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Invoice Builder</h2>
                <p className="text-gray-600">Advanced invoice creation with drag-and-drop functionality</p>
                
                {/* Quick Actions */}
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => addItem('product')}
                    className="btn-secondary text-sm px-4 py-2"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </button>
                  <button
                    onClick={() => addItem('service')}
                    className="btn-secondary text-sm px-4 py-2"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Service
                  </button>
                  <button
                    onClick={() => addItem('discount')}
                    className="btn-secondary text-sm px-4 py-2"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Discount
                  </button>
                </div>

                {/* Invoice Items */}
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">Invoice Items</h3>
                  <div className="space-y-4">
                    {invoiceData.items.map((item, index) => (
                      <div key={item.id} className="p-4 bg-gray-50 rounded-lg border">
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                              className="input-field"
                              placeholder="Item description"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                              value={item.type}
                              onChange={(e) => updateItem(item.id, 'type', e.target.value)}
                              className="input-field"
                            >
                              <option value="product">Product</option>
                              <option value="service">Service</option>
                              <option value="discount">Discount</option>
                              <option value="tax">Tax</option>
                              <option value="shipping">Shipping</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Qty</label>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                              className="input-field"
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rate</label>
                            <input
                              type="number"
                              value={item.rate}
                              onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                              className="input-field"
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div className="flex items-end gap-2">
                            <button
                              onClick={() => duplicateItem(item.id)}
                              className="btn-ghost p-2 text-blue-600 hover:text-blue-800"
                              title="Duplicate"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="btn-ghost p-2 text-red-600 hover:text-red-800"
                              title="Remove"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => addItem()}
                    className="mt-4 btn-secondary"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </button>
                </div>

                {/* Totals Summary */}
                <div className="mt-6 p-4 bg-primary-50 rounded-lg">
                  <h3 className="text-lg font-medium mb-3">Invoice Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-medium">${invoiceData.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Discount:</span>
                      <span className="font-medium text-green-600">-${invoiceData.totalDiscount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Tax:</span>
                      <span className="font-medium">${invoiceData.totalTax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span className="font-medium">${invoiceData.totalShipping.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-primary-200 pt-2 flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>${invoiceData.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'company' && (
            <motion.div
              key="company"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="card">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Company Information
                </h2>
                <p className="text-gray-600 mb-6">Enter your company details that will appear on the invoice</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                    <input
                      type="text"
                      value={invoiceData.company.name}
                      onChange={(e) => updateCompanyInfo('name', e.target.value)}
                      className="input-field"
                      placeholder="Your Company Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID</label>
                    <input
                      type="text"
                      value={invoiceData.company.taxId}
                      onChange={(e) => updateCompanyInfo('taxId', e.target.value)}
                      className="input-field"
                      placeholder="Tax Identification Number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={invoiceData.company.email}
                      onChange={(e) => updateCompanyInfo('email', e.target.value)}
                      className="input-field"
                      placeholder="company@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={invoiceData.company.phone}
                      onChange={(e) => updateCompanyInfo('phone', e.target.value)}
                      className="input-field"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <input
                      type="url"
                      value={invoiceData.company.website}
                      onChange={(e) => updateCompanyInfo('website', e.target.value)}
                      className="input-field"
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <input
                      type="text"
                      value={invoiceData.company.country}
                      onChange={(e) => updateCompanyInfo('country', e.target.value)}
                      className="input-field"
                      placeholder="United States"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      value={invoiceData.company.address}
                      onChange={(e) => updateCompanyInfo('address', e.target.value)}
                      className="input-field"
                      placeholder="123 Business Street"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={invoiceData.company.city}
                      onChange={(e) => updateCompanyInfo('city', e.target.value)}
                      className="input-field"
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
                    <input
                      type="text"
                      value={invoiceData.company.state}
                      onChange={(e) => updateCompanyInfo('state', e.target.value)}
                      className="input-field"
                      placeholder="NY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ZIP/Postal Code</label>
                    <input
                      type="text"
                      value={invoiceData.company.zip}
                      onChange={(e) => updateCompanyInfo('zip', e.target.value)}
                      className="input-field"
                      placeholder="10001"
                    />
                  </div>
                </div>

                {/* Logo Upload */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
                  <div className="flex items-center gap-4">
                    {invoiceData.company.logo && (
                      <img
                        src={invoiceData.company.logo}
                        alt="Company Logo"
                        className="w-20 h-20 object-contain border rounded-lg"
                      />
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-secondary"
                    >
                      <Image className="w-4 h-4 mr-2" />
                      {invoiceData.company.logo ? 'Change Logo' : 'Upload Logo'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'client' && (
            <motion.div
              key="client"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="card">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Client Information
                </h2>
                <p className="text-gray-600 mb-6">Enter your client's details for the invoice</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Client Name *</label>
                    <input
                      type="text"
                      value={invoiceData.client.name}
                      onChange={(e) => updateClientInfo('name', e.target.value)}
                      className="input-field"
                      placeholder="Client Company or Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID</label>
                    <input
                      type="text"
                      value={invoiceData.client.taxId}
                      onChange={(e) => updateClientInfo('taxId', e.target.value)}
                      className="input-field"
                      placeholder="Client Tax ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={invoiceData.client.email}
                      onChange={(e) => updateClientInfo('email', e.target.value)}
                      className="input-field"
                      placeholder="client@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={invoiceData.client.phone}
                      onChange={(e) => updateClientInfo('phone', e.target.value)}
                      className="input-field"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <input
                      type="text"
                      value={invoiceData.client.country}
                      onChange={(e) => updateClientInfo('country', e.target.value)}
                      className="input-field"
                      placeholder="United States"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      value={invoiceData.client.address}
                      onChange={(e) => updateClientInfo('address', e.target.value)}
                      className="input-field"
                      placeholder="123 Client Street"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={invoiceData.client.city}
                      onChange={(e) => updateClientInfo('city', e.target.value)}
                      className="input-field"
                      placeholder="Client City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
                    <input
                      type="text"
                      value={invoiceData.client.state}
                      onChange={(e) => updateClientInfo('state', e.target.value)}
                      className="input-field"
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ZIP/Postal Code</label>
                    <input
                      type="text"
                      value={invoiceData.client.zip}
                      onChange={(e) => updateClientInfo('zip', e.target.value)}
                      className="input-field"
                      placeholder="ZIP Code"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
                <p className="text-gray-600">Real-time preview of your invoice</p>
                
                {/* Actual Invoice Preview */}
                <div className="mt-6 bg-white border rounded-lg p-8 max-w-4xl mx-auto">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      {invoiceData.company.logo && (
                        <img
                          src={invoiceData.company.logo}
                          alt="Company Logo"
                          className="w-24 h-24 object-contain mb-4"
                        />
                      )}
                      <h1 className="text-2xl font-bold text-gray-900">{invoiceData.company.name || 'Your Company Name'}</h1>
                      <p className="text-gray-600">{invoiceData.company.address || 'Company Address'}</p>
                      <p className="text-gray-600">{invoiceData.company.city}, {invoiceData.company.state} {invoiceData.company.zip}</p>
                      <p className="text-gray-600">{invoiceData.company.country}</p>
                    </div>
                    <div className="text-right">
                      <h2 className="text-3xl font-bold text-primary-600 mb-2">INVOICE</h2>
                      <p className="text-gray-600"><strong>Invoice #:</strong> {invoiceData.invoiceNumber}</p>
                      <p className="text-gray-600"><strong>Issue Date:</strong> {invoiceData.issueDate}</p>
                      <p className="text-gray-600"><strong>Due Date:</strong> {invoiceData.dueDate}</p>
                    </div>
                  </div>

                  {/* Client Info */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Bill To:</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium text-gray-900">{invoiceData.client.name || 'Client Name'}</p>
                      <p className="text-gray-600">{invoiceData.client.address || 'Client Address'}</p>
                      <p className="text-gray-600">{invoiceData.client.city}, {invoiceData.client.state} {invoiceData.client.zip}</p>
                      <p className="text-gray-600">{invoiceData.client.country}</p>
                    </div>
                  </div>

                  {/* Invoice Items */}
                  <div className="mb-8">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left py-3 px-2 font-semibold text-gray-900">Description</th>
                          <th className="text-center py-3 px-2 font-semibold text-gray-900">Type</th>
                          <th className="text-center py-3 px-2 font-semibold text-gray-900">Qty</th>
                          <th className="text-center py-3 px-2 font-semibold text-gray-900">Rate</th>
                          <th className="text-right py-3 px-2 font-semibold text-gray-900">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceData.items.map((item, index) => (
                          <tr key={item.id} className="border-b border-gray-100">
                            <td className="py-3 px-2 text-gray-900">{item.description || `Item ${index + 1}`}</td>
                            <td className="py-3 px-2 text-center text-gray-600 capitalize">{item.type}</td>
                            <td className="py-3 px-2 text-center text-gray-600">{item.quantity}</td>
                            <td className="py-3 px-2 text-center text-gray-600">${item.rate.toFixed(2)}</td>
                            <td className="py-3 px-2 text-right text-gray-900 font-medium">${item.amount.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals */}
                  <div className="flex justify-end">
                    <div className="w-64 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">${invoiceData.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Discount:</span>
                        <span className="font-medium text-green-600">-${invoiceData.totalDiscount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Tax:</span>
                        <span className="font-medium">${invoiceData.totalTax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping:</span>
                        <span className="font-medium">${invoiceData.totalShipping.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span className="text-primary-600">${invoiceData.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  {invoiceData.notes && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2">Notes:</h4>
                      <p className="text-gray-600">{invoiceData.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Settings & Preferences</h2>
                <p className="text-gray-600">Configure your invoice preferences</p>
                
                <div className="mt-6 space-y-6">
                  {/* Invoice Settings */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Invoice Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                        <select
                          value={invoiceData.currency}
                          onChange={(e) => updateInvoiceSettings('currency', e.target.value)}
                          className="input-field"
                        >
                          {currencies.map(currency => (
                            <option key={currency} value={currency}>{currency}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                        <select
                          value={invoiceData.language}
                          onChange={(e) => updateInvoiceSettings('language', e.target.value)}
                          className="input-field"
                        >
                          {languages.map(language => (
                            <option key={language} value={language}>{language}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Issue Date</label>
                        <input
                          type="date"
                          value={invoiceData.issueDate}
                          onChange={(e) => updateInvoiceSettings('issueDate', e.target.value)}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                        <input
                          type="date"
                          value={invoiceData.dueDate}
                          onChange={(e) => updateInvoiceSettings('dueDate', e.target.value)}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Cost</label>
                        <input
                          type="number"
                          value={invoiceData.totalShipping}
                          onChange={(e) => updateInvoiceSettings('totalShipping', parseFloat(e.target.value) || 0)}
                          className="input-field"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Fields */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                        <textarea
                          value={invoiceData.notes}
                          onChange={(e) => updateInvoiceSettings('notes', e.target.value)}
                          className="input-field"
                          rows={3}
                          placeholder="Additional notes for the client..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Terms & Conditions</label>
                        <textarea
                          value={invoiceData.terms}
                          onChange={(e) => updateInvoiceSettings('terms', e.target.value)}
                          className="input-field"
                          rows={3}
                          placeholder="Payment terms and conditions..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Instructions</label>
                        <textarea
                          value={invoiceData.paymentInstructions}
                          onChange={(e) => updateInvoiceSettings('paymentInstructions', e.target.value)}
                          className="input-field"
                          rows={3}
                          placeholder="How to make payment..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Footer</label>
                        <input
                          type="text"
                          value={invoiceData.footer}
                          onChange={(e) => updateInvoiceSettings('footer', e.target.value)}
                          className="input-field"
                          placeholder="Footer text..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preferences */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>Auto-save drafts</span>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>Real-time calculations</span>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>Show item numbers</span>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 