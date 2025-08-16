'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  FileText, 
  Building, 
  User, 
  Calendar, 
  DollarSign,
  Eye,
  Share2,
  QrCode,
  Download,
  Trash2,
  Search,
  Filter
} from 'lucide-react'

interface SavedInvoice {
  id: string
  invoiceNumber: string
  companyName: string
  clientName: string
  total: number
  currency: string
  issueDate: string
  dueDate: string
  sharedAt: string
  data: any
}

export default function MyInvoices() {
  const [invoices, setInvoices] = useState<SavedInvoice[]>([])
  const [filteredInvoices, setFilteredInvoices] = useState<SavedInvoice[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('sharedAt')

  useEffect(() => {
    loadInvoices()
  }, [])

  useEffect(() => {
    filterAndSortInvoices()
  }, [invoices, searchTerm, filterStatus, sortBy])

  const loadInvoices = () => {
    try {
      console.log('Loading invoices from storage...')
      const stored = localStorage.getItem('sharedInvoices')
      console.log('Raw storage data:', stored)
      
      const savedInvoices = stored ? JSON.parse(stored) : []
      console.log('Parsed invoices:', savedInvoices)
      
      if (Array.isArray(savedInvoices)) {
        setInvoices(savedInvoices)
        console.log(`✅ Loaded ${savedInvoices.length} invoices from storage`)
      } else {
        console.warn('Stored data is not an array, setting empty array')
        setInvoices([])
      }
    } catch (error) {
      console.error('Error loading invoices:', error)
      setInvoices([])
    }
  }

  const filterAndSortInvoices = () => {
    let filtered = [...invoices]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(invoice => 
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (filterStatus === 'overdue') {
      filtered = filtered.filter(invoice => new Date(invoice.dueDate) < new Date())
    } else if (filterStatus === 'due-soon') {
      const today = new Date()
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      filtered = filtered.filter(invoice => 
        new Date(invoice.dueDate) >= today && new Date(invoice.dueDate) <= weekFromNow
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'sharedAt') {
        return new Date(b.sharedAt).getTime() - new Date(a.sharedAt).getTime()
      } else if (sortBy === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      } else if (sortBy === 'total') {
        return b.total - a.total
      } else if (sortBy === 'invoiceNumber') {
        return a.invoiceNumber.localeCompare(b.invoiceNumber)
      }
      return 0
    })

    setFilteredInvoices(filtered)
  }

  const deleteInvoice = (invoiceId: string) => {
    try {
      const updatedInvoices = invoices.filter(inv => inv.id !== invoiceId)
      localStorage.setItem('sharedInvoices', JSON.stringify(updatedInvoices))
      setInvoices(updatedInvoices)
      
      // Show success message
      const successMsg = document.createElement('div')
      successMsg.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50'
      successMsg.textContent = 'Invoice deleted successfully!'
      document.body.appendChild(successMsg)
      setTimeout(() => {
        document.body.removeChild(successMsg)
      }, 3000)
    } catch (error) {
      console.error('Error deleting invoice:', error)
    }
  }

  const getStatusColor = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    
    if (due < today) {
      return 'text-red-600 bg-red-100'
    } else if (due.getTime() - today.getTime() <= 7 * 24 * 60 * 60 * 1000) {
      return 'text-yellow-600 bg-yellow-100'
    } else {
      return 'text-green-600 bg-green-100'
    }
  }

  const getStatusText = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    
    if (due < today) {
      return 'Overdue'
    } else if (due.getTime() - today.getTime() <= 7 * 24 * 60 * 60 * 1000) {
      return 'Due Soon'
    } else {
      return 'On Time'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number, currency: string) => {
    const symbols: { [key: string]: string } = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
      'CAD': 'C$',
      'AUD': 'A$'
    }
    const symbol = symbols[currency] || currency
    return `${symbol}${amount.toFixed(2)}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">My Invoices</h1>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {invoices.length} invoices
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link href="/create-invoice/enhanced">
                <button className="btn-primary text-sm px-4 py-2">
                  <FileText className="w-4 h-4 mr-2" />
                  Create New Invoice
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search invoices by number, company, or client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="overdue">Overdue</option>
              <option value="due-soon">Due Soon</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="sharedAt">Sort by Shared Date</option>
              <option value="dueDate">Sort by Due Date</option>
              <option value="total">Sort by Amount</option>
              <option value="invoiceNumber">Sort by Invoice #</option>
            </select>
          </div>
        </div>

        {/* Invoices Grid */}
        {filteredInvoices.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
            <p className="text-gray-600 mb-6">
              {invoices.length === 0 
                ? "You haven't shared any invoices yet. Create and share your first invoice to see it here."
                : "No invoices match your search criteria."
              }
            </p>
            {invoices.length === 0 && (
              <Link href="/create-invoice/enhanced">
                <button className="btn-primary">
                  Create Your First Invoice
                </button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInvoices.map((invoice) => (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="card hover:shadow-lg transition-shadow duration-200"
              >
                {/* Invoice Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      #{invoice.invoiceNumber}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {invoice.companyName}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.dueDate)}`}>
                    {getStatusText(invoice.dueDate)}
                  </span>
                </div>

                {/* Invoice Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span className="font-medium">Client:</span>
                    <span>{invoice.clientName}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">Due:</span>
                    <span>{formatDate(invoice.dueDate)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-medium">Total:</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(invoice.total, invoice.currency)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">Shared:</span>
                    <span>{formatDate(invoice.sharedAt)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                  <Link href={`/invoice/view/${invoice.invoiceNumber}?data=${btoa(JSON.stringify(invoice.data))}`}>
                    <button className="btn-secondary text-xs px-3 py-2">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </button>
                  </Link>
                  
                  <button 
                    className="btn-secondary text-xs px-3 py-2"
                    onClick={() => {
                      const shareUrl = `${window.location.origin}/invoice/view/${invoice.invoiceNumber}?data=${btoa(JSON.stringify(invoice.data))}`
                      navigator.clipboard.writeText(shareUrl)
                      
                      // Show success message
                      const successMsg = document.createElement('div')
                      successMsg.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50'
                      successMsg.textContent = 'Share link copied to clipboard!'
                      document.body.appendChild(successMsg)
                      setTimeout(() => {
                        document.body.removeChild(successMsg)
                      }, 3000)
                    }}
                  >
                    <Share2 className="w-3 h-3 mr-1" />
                    Share
                  </button>
                  
                  <button 
                    className="btn-secondary text-xs px-3 py-2"
                    onClick={() => deleteInvoice(invoice.id)}
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 