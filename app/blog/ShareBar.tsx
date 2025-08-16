'use client'

import { useEffect, useState } from 'react'
import { Share2, Link as LinkIcon } from 'lucide-react'

interface ShareBarProps {
  path: string
  title: string
}

export default function ShareBar({ path, title }: ShareBarProps) {
  const [shareUrl, setShareUrl] = useState<string>('')

  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    setShareUrl(origin + path)
  }, [path])

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3 text-sm">
      <span className="text-gray-600 inline-flex items-center gap-2"><Share2 className="w-4 h-4" /> Share:</span>
      <a className="px-3 py-2 border rounded-md hover:bg-gray-50" target="_blank" rel="noopener noreferrer" href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`}>
        Twitter
      </a>
      <a className="px-3 py-2 border rounded-md hover:bg-gray-50" target="_blank" rel="noopener noreferrer" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}>
        LinkedIn
      </a>
      <button className="px-3 py-2 border rounded-md hover:bg-gray-50 inline-flex items-center gap-2" onClick={() => { if (shareUrl) navigator.clipboard?.writeText(shareUrl) }}>
        <LinkIcon className="w-4 h-4" /> Copy link
      </button>
    </div>
  )
}



