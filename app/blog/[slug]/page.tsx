import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getPostBySlug } from '../posts'
import { posts } from '../posts'
import ShareBar from '../ShareBar'
import ArticleLayout from '../ArticleLayout'
// Note: Avoid client-only components here to keep this page purely server-rendered

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  return {
    title: post ? `${post.title} | Invoice Meta` : 'Blog Post',
    description: post?.excerpt,
    alternates: { canonical: `/blog/${params.slug}` },
    openGraph: {
      title: post?.title,
      description: post?.excerpt,
      type: 'article',
      url: `/blog/${params.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: post?.title,
      description: post?.excerpt,
    },
  }
}

export function generateStaticParams() {
  return posts.map(p => ({ slug: p.slug }))
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <section className="py-20 text-center">
          <p className="text-gray-700">Post not found.</p>
          <Link href="/blog" className="text-blue-600 underline">Back to Blog</Link>
        </section>
      </div>
    )
  }

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    author: { '@type': 'Organization', name: 'Invoice Meta' },
    datePublished: post.date,
    mainEntityOfPage: `/blog/${post.slug}`,
  }

  const faqLd = post.faqs && post.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  } : null

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: '/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `/blog/${post.slug}` },
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* JSON-LD for SEO/AEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <Link href="/blog" className="inline-flex items-center text-blue-600 hover:underline ml-4 sm:ml-6 mt-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
      </Link>

      <ArticleLayout
        title={post.title}
        author={post.author}
        date={post.date}
        category={post.category}
        readTime={post.readTime}
        heroUrl={"/api/og?title=" + encodeURIComponent(post.title)}
        heroAlt={post.title}
      >
          {/* Table of contents */}
          <nav className="mb-8 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-xl p-4">
            <strong className="block mb-2 text-gray-900">On this page</strong>
            <ul className="list-disc pl-5 space-y-1">
              <li><a href="#content" className="hover:underline">Main content</a></li>
              {post.faqs && post.faqs.length > 0 && <li><a href="#faqs" className="hover:underline">FAQs</a></li>}
              <li><a href="#related" className="hover:underline">Related articles</a></li>
            </ul>
          </nav>

          <div id="content" className="prose prose-lg max-w-none">
            {post.content()}

            <hr />
            <h3>Keep learning</h3>
            <p>
              Explore more guides on invoicing and cash flow in our{' '}
              <Link href="/blog" className="text-blue-600 hover:underline">blog</Link>. If you need a fast
              way to create professional invoices, try our{' '}
              <Link href="/create-invoice/enhanced" className="text-blue-600 hover:underline">free invoice tool</Link>.
            </p>
          </div>

          <ShareBar path={`/blog/${post.slug}`} title={post.title} />

          {/* FAQs */}
          {post.faqs && post.faqs.length > 0 && (
            <div id="faqs" className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {post.faqs.map((f, idx) => (
                  <details key={idx} className="group border border-gray-200 rounded-xl p-4 bg-gray-50">
                    <summary className="cursor-pointer font-medium text-gray-900">{f.question}</summary>
                    <p className="mt-2 text-gray-700">{f.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* Related posts */}
          <div id="related" className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related articles</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {posts
                .filter(p => p.slug !== post.slug && (p.category === post.category || p.tags.some(t => post.tags.includes(t))))
                .slice(0, 3)
                .map(rel => (
                  <Link key={rel.slug} href={`/blog/${rel.slug}`} className="block bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-shadow">
                    <div className="text-sm text-primary-600 font-medium mb-1">{rel.category}</div>
                    <div className="font-semibold text-gray-900">{rel.title}</div>
                    <div className="text-sm text-gray-600 mt-1 line-clamp-2">{rel.excerpt}</div>
                  </Link>
                ))}
            </div>
          </div>
      </ArticleLayout>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Invoice Meta</h3>
              <p className="text-gray-400 text-sm mb-4">
                The most powerful free invoice creation tool for businesses of all sizes.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-400 font-medium">Contact Support:</p>
                <a href="/contact" className="inline-flex items-center space-x-2 text-green-400 hover:text-green-300 font-medium transition-colors">Open Contact</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="/careers" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</a></li>
                <li><a href="/cookies" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          
          
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 Invoice Meta. All rights reserved. Made with ❤️ for businesses worldwide.</p>
            <p className="mt-2">Created by Muhammad Abdullah</p>
            <p className="mt-2">No signup required. Instant and secure.</p>
            <p className="mt-2 text-xs">
              For support: Click the WhatsApp contact button above (Message only, response within 24 hours)
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}


