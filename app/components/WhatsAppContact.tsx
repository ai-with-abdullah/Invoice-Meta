'use client'

import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import WhatsAppPopup from './WhatsAppPopup'

export default function WhatsAppContact() {
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsPopupOpen(true)}
        className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium transition-colors cursor-pointer"
      >
        <MessageCircle className="w-5 h-5" />
        <span>WhatsApp</span>
      </button>
      
      <WhatsAppPopup 
        isOpen={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)} 
      />
    </>
  )
}

