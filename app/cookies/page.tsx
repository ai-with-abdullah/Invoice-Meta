'use client'

import { motion } from 'framer-motion'
import { Cookie, Shield, Settings, Globe } from 'lucide-react'
import WhatsAppContact from '../components/WhatsAppContact'

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Cookie
              <span className="text-gradient block">Policy</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Understanding how Invoice Meta uses cookies to improve your experience
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="prose prose-lg max-w-none"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">What Are Cookies?</h2>
            <p className="text-gray-600 mb-6">
              Cookies are small text files placed on your device when you visit our website. They
              help us provide a more personalized and efficient experience by remembering your
              preferences, analyzing how you use our site, and improving our services.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">How We Use Cookies</h2>
            <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for basic site functionality like navigation and security.</li>
              <li><strong>Performance Cookies:</strong> Collect anonymous data about how users interact with our website.</li>
              <li><strong>Functional Cookies:</strong> Remember your preferences and settings.</li>
              <li><strong>Analytics Cookies:</strong> Help us improve features by understanding usage patterns.</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">Types of Cookies We Use</h2>
            <p className="text-gray-600 mb-6">
              We may use session cookies (temporary, deleted when you close your browser) and
              persistent cookies (stay until deleted manually or expired).
            </p>
            <p className="text-gray-600 mb-6">
              Some cookies may be set by third-party services like analytics tools to help us better
              understand traffic and usage.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">Managing Your Cookies</h2>
            <p className="text-gray-600 mb-6">
              You can control and manage cookies through your browser settings. You may choose to
              disable certain cookies, but please note this may affect website functionality.
            </p>

            <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
              <li>Change browser settings to block or delete cookies.</li>
              <li>Accept or reject non-essential cookies when prompted.</li>
              <li>Clear cookies manually at any time.</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">Updates to This Policy</h2>
            <p className="text-gray-600 mb-6">
              We may update this Cookie Policy from time to time to reflect changes in practices,
              legal, or regulatory reasons. Any updates will be posted on this page.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h2>
            <p className="text-gray-600 mb-6">
              If you have questions about our use of cookies, please reach out to us via the WhatsApp
              contact button in the footer.
            </p>
          </motion.div>
        </div>
      </section>

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
                <p className="text-sm text-gray-400">
                  <span className="font-medium text-white">Contact Support:</span>
                </p>
                <WhatsAppContact />
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
