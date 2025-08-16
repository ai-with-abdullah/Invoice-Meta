'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FileText, CheckCircle, AlertTriangle, Shield } from 'lucide-react'
import WhatsAppContact from '../components/WhatsAppContact'

export default function TermsPage() {
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
              Terms of
              <span className="text-gradient block">Service</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Please read these terms carefully before using our service
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
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Acceptance of Terms</h2>
            <p className="text-gray-600 mb-6">
              By accessing and using Invoice Meta, you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to these terms, please do not use our service.
            </p>
            <p className="text-gray-600 mb-6">
              These terms apply to all users of the service, including without limitation users who are browsers, 
              vendors, customers, merchants, and/or contributors of content.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">Use License</h2>
            <p className="text-gray-600 mb-6">
              Permission is granted to temporarily use Invoice Meta for personal, non-commercial 
              transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on Invoice Meta</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">Service Description</h2>
            <p className="text-gray-600 mb-6">
              Invoice Meta provides a free online invoice generation service. Our platform allows users to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
              <li>Create professional invoices with customizable templates</li>
              <li>Generate PDF invoices for download and sharing</li>
              <li>Customize invoice layouts and branding</li>
              <li>Access invoice templates for various business types</li>
              <li>Use the service without creating an account</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">User Responsibilities</h2>
            <p className="text-gray-600 mb-6">
              As a user of our service, you are responsible for:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
              <li>Providing accurate and truthful information</li>
              <li>Ensuring compliance with applicable laws and regulations</li>
              <li>Maintaining the security of your information</li>
              <li>Using the service for lawful purposes only</li>
              <li>Respecting intellectual property rights</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">Intellectual Property</h2>
            <p className="text-gray-600 mb-6">
              The service and its original content, features, and functionality are and will remain the 
              exclusive property of Invoice Meta and its licensors. The service is protected by 
              copyright, trademark, and other laws.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">Privacy and Data Protection</h2>
            <p className="text-gray-600 mb-6">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your 
              use of the service, to understand our practices regarding the collection and use of your information.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">Limitation of Liability</h2>
            <p className="text-gray-600 mb-6">
              In no event shall Invoice Meta, nor its directors, employees, partners, agents, suppliers, 
              or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, 
              including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">Disclaimer</h2>
            <p className="text-gray-600 mb-6">
              The materials on Invoice Meta are provided on an 'as is' basis. We make no 
              warranties, expressed or implied, and hereby disclaim and negate all other warranties, 
              including without limitation:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
              <li>Implied warranties of merchantability or fitness for a particular purpose</li>
              <li>Warranties that the service will be uninterrupted or error-free</li>
              <li>Warranties regarding the accuracy or reliability of any information</li>
              <li>Warranties that defects will be corrected</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">Governing Law</h2>
            <p className="text-gray-600 mb-6">
              These terms shall be governed by and construed in accordance with the laws of Pakistan, 
              without regard to its conflict of law provisions. Any disputes arising from these terms 
              or the use of our service shall be subject to the exclusive jurisdiction of the courts in Pakistan.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">Changes to Terms</h2>
            <p className="text-gray-600 mb-6">
              We reserve the right to modify or replace these terms at any time. If a revision is material, 
              we will try to provide at least 30 days notice prior to any new terms taking effect. 
              What constitutes a material change will be determined at our sole discretion.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Information</h2>
            <p className="text-gray-600 mb-6">
              For questions about these Terms of Service or any other inquiries, please contact us via 
              the WhatsApp button in the footer. We are committed to providing excellent customer support 
              and will respond to your questions promptly.
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
