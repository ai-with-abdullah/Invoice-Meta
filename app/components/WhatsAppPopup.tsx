'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle, CheckCircle } from 'lucide-react'

interface WhatsAppPopupProps {
  isOpen: boolean
  onClose: () => void
}

export default function WhatsAppPopup({ isOpen, onClose }: WhatsAppPopupProps) {
  const [agreedToRules, setAgreedToRules] = useState(false)

  const handleWhatsAppClick = () => {
    if (agreedToRules) {
      const phoneNumber = '+923194124382'
      const message = encodeURIComponent('Hello! I need help with Invoice Meta.')
      window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Contact Us via WhatsApp</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Rules & Guidelines</h3>
                
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Message only - No calls please</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Response within 24 hours during business days</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Please provide clear details about your inquiry</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>For technical issues, include screenshots if possible</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Business hours: Monday to Friday, 9 AM - 6 PM (PKT)</span>
                  </div>
                </div>
              </div>

              {/* Checkbox */}
              <div className="mb-6">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToRules}
                    onChange={(e) => setAgreedToRules(e.target.checked)}
                    className="mt-1 w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-700">
                    I have read and agree to the contact rules and guidelines above. 
                    I understand that this is a message-only service and I will not attempt to call.
                  </span>
                </label>
              </div>

              {/* WhatsApp Button */}
              <button
                onClick={handleWhatsAppClick}
                disabled={!agreedToRules}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                  agreedToRules
                    ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                <span>Open WhatsApp</span>
              </button>

              {!agreedToRules && (
                <p className="text-xs text-gray-500 text-center mt-3">
                  Please accept the rules to enable WhatsApp contact
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-2xl">
              <p className="text-xs text-gray-600 text-center">
                Your privacy is protected. We do not store or collect any personal information.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
