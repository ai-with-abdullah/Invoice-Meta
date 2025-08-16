'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { AlertTriangle, Info, Shield, FileText } from 'lucide-react'
import WhatsAppContact from '../components/WhatsAppContact'

export default function DisclaimerPage() {
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
              Legal
              <span className="text-gradient block">Disclaimer</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Important information about the use of our service
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
            <h2 className="text-3xl font-bold text-gray-900 mb-6">General Information</h2>
            <p className="text-gray-600 mb-6">
              The information provided by Invoice Meta is for general informational purposes only. 
              While we strive to keep the information up to date and correct, we make no representations 
              or warranties of any kind, express or implied, about the completeness, accuracy, reliability, 
              suitability, or availability of the information, products, services, or related graphics 
              contained on the website for any purpose.
            </p>
            <p className="text-gray-600 mb-6">
              Any reliance you place on such information is therefore strictly at your own risk. 
              In no event will we be liable for any loss or damage including without limitation, 
              indirect or consequential loss or damage, arising from loss of data or profits 
              arising out of, or in connection with, the use of this website.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">No Professional Advice</h2>
            <p className="text-gray-600 mb-6">
              The information on this website is not intended to constitute professional advice. 
              You should consult with qualified professionals for specific advice tailored to your situation. 
              This includes, but is not limited to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
              <li>Legal advice regarding business contracts or tax obligations</li>
              <li>Financial advice for business operations</li>
              <li>Accounting advice for bookkeeping and financial reporting</li>
              <li>Business strategy and operational guidance</li>
              <li>Compliance with local, state, or federal regulations</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">Service Limitations</h2>
            <p className="text-gray-600 mb-6">
              Invoice Meta is designed to assist with invoice generation and related business tasks. 
              However, we cannot guarantee that our service will meet your specific requirements or that 
              the service will be uninterrupted, timely, secure, or error-free.
            </p>
            <p className="text-gray-600 mb-6">
              Our service is provided "as is" and "as available" without any warranties of any kind, 
              either express or implied, including but not limited to warranties of merchantability, 
              fitness for a particular purpose, or non-infringement.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">Third-Party Content</h2>
            <p className="text-gray-600 mb-6">
              Through this website, you are able to link to other websites which are not under the control 
              of Invoice Meta. We have no control over the nature, content, and availability of 
              those sites. The inclusion of any links does not necessarily imply a recommendation or 
              endorse the views expressed within them.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">Data and Privacy</h2>
            <p className="text-gray-600 mb-6">
              While we strive to protect your privacy and personal information, we cannot guarantee 
              the security of any information transmitted to or from our website. You acknowledge that 
              you provide such information at your own risk.
            </p>
            <p className="text-gray-600 mb-6">
              We are not responsible for any data loss, corruption, or unauthorized access that may occur 
              during the use of our service. It is your responsibility to maintain appropriate security 
              measures for your own data and systems.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">Limitation of Liability</h2>
            <p className="text-gray-600 mb-6">
              In no event shall Invoice Meta, its directors, employees, partners, agents, suppliers, 
              or affiliates be liable for any damages arising out of the use or inability to use the materials 
              on our website, including but not limited to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
              <li>Direct, indirect, incidental, special, or consequential damages</li>
              <li>Loss of profits, revenue, or business opportunities</li>
              <li>Loss of data or information</li>
              <li>Business interruption or downtime</li>
              <li>Any other damages resulting from the use of our service</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">Indemnification</h2>
            <p className="text-gray-600 mb-6">
              You agree to indemnify and hold harmless Invoice Meta, its directors, employees, 
              partners, agents, suppliers, and affiliates from and against any claims, damages, obligations, 
              losses, liabilities, costs, or debt arising from your use of the service or violation of these terms.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">Governing Law</h2>
            <p className="text-gray-600 mb-6">
              This disclaimer shall be governed by and construed in accordance with the laws of Pakistan. 
              Any disputes arising from this disclaimer or the use of our website shall be subject to 
              the exclusive jurisdiction of the courts in Pakistan.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">Changes to Disclaimer</h2>
            <p className="text-gray-600 mb-6">
              We reserve the right to modify this disclaimer at any time. Changes will be effective 
              immediately upon posting on the website. Your continued use of the service after any 
              changes constitutes acceptance of the modified disclaimer.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact</h2>
            <p className="text-gray-600 mb-6">
              For questions about this disclaimer or any other concerns, please contact us via 
              the WhatsApp button in the footer. We are committed to addressing your questions 
              and concerns promptly and professionally.
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
