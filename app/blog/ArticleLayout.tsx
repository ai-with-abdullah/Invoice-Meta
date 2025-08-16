import { Calendar, Tag as TagIcon, User } from 'lucide-react'
import { ReactNode } from 'react'

interface ArticleLayoutProps {
  title: string
  author: string
  date: string
  category: string
  readTime: string
  heroUrl?: string
  heroAlt?: string
  children: ReactNode
}

export default function ArticleLayout({
  title,
  author,
  date,
  category,
  readTime,
  heroUrl,
  heroAlt,
  children,
}: ArticleLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero */}
      <section className="relative overflow-hidden py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">{title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1"><User className="w-4 h-4" /> {author}</span>
            <span className="inline-flex items-center gap-1"><Calendar className="w-4 h-4" /> {date}</span>
            <span className="inline-flex items-center gap-1"><TagIcon className="w-4 h-4" /> {category}</span>
            <span>{readTime}</span>
          </div>
          {heroUrl && (
            <div className="mt-6 rounded-2xl overflow-hidden border border-gray-200 bg-white">
              {/* Use plain img to keep this server component simple */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={heroUrl} alt={heroAlt || title} className="w-full h-64 object-cover" />
            </div>
          )}
        </div>
      </section>

      {/* Content container */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </section>
    </div>
  )
}



