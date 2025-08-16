'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 min-w-0">
          <Image src="/logo-mark.svg" alt="Invoice Meta" width={56} height={56} priority className="h-12 md:h-14 w-auto" />
          <span className="font-extrabold text-gray-900 text-lg sm:text-xl md:text-2xl tracking-tight whitespace-nowrap">Invoice Meta</span>
        </Link>

        <nav className="flex items-center gap-5 lg:gap-8 text-sm sm:text-base font-semibold text-gray-700 overflow-x-auto whitespace-nowrap">
          <a href="/" className="px-3 py-2 rounded-md hover:bg-gray-100 hover:text-gray-900">Home</a>
          <a href="/create-invoice/enhanced" className="px-3 py-2 rounded-md hover:bg-gray-100 hover:text-gray-900">Create</a>
          <a href="/blog" className="px-3 py-2 rounded-md hover:bg-gray-100 hover:text-gray-900">Blog</a>
          <a href="/about" className="px-3 py-2 rounded-md hover:bg-gray-100 hover:text-gray-900">About</a>
          <a href="/contact" className="px-3 py-2 rounded-md hover:bg-gray-100 hover:text-gray-900">Contact</a>
        </nav>
      </div>
    </header>
  )
}


