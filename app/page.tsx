'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Download, 
  Zap, 
  Star, 
  Users, 
  Globe, 
  Shield, 
  Clock, 
  CheckCircle, 
  BadgeCheck,
  TrendingUp, 
  Sparkles, 
  Crown, 
  Building, 
  Code, 
  Paintbrush, 
  Heart, 
  Calculator, 
  Camera, 
  Music, 
  Truck, 
  Package, 
  Plane, 
  Ship, 
  ArrowRight
} from 'lucide-react'
import Image from 'next/image'
import WhatsAppContact from './components/WhatsAppContact'

const trustBadges = [
  { icon: Shield, text: '100% Free', color: 'text-green-600' },
  { icon: Clock, text: 'No Signup', color: 'text-blue-600' },
  { icon: Download, text: 'Instant PDF', color: 'text-purple-600' },
  { icon: CheckCircle, text: 'Secure', color: 'text-emerald-600' },
  { icon: BadgeCheck, text: 'No Watermark', color: 'text-indigo-600' }
]

const howItWorks = [
  {
    icon: FileText,
    title: 'Enter Details',
    description: 'Fill in your company and client information in our simple form'
  },
  {
    icon: Package,
    title: 'Add Items',
    description: 'List your products or services with quantities and rates'
  },
  {
    icon: Download,
    title: 'Download PDF',
    description: 'Get your professional invoice instantly, ready to send'
  }
]



const industries = [
  { icon: Code, name: 'Technology', description: 'Startups, SaaS, IT Services' },
  { icon: Building, name: 'Consulting', description: 'Business, Legal, Financial' },
  { icon: Paintbrush, name: 'Creative', description: 'Design, Marketing, Media' },
  { icon: Heart, name: 'Healthcare', description: 'Medical, Dental, Wellness' },
  { icon: Calculator, name: 'Finance', description: 'Accounting, Banking, Insurance' },
  { icon: Camera, name: 'Photography', description: 'Portrait, Event, Commercial' },
  { icon: Music, name: 'Entertainment', description: 'Music, Film, Events' },
  { icon: Truck, name: 'Logistics', description: 'Shipping, Transport, Warehousing' },
  { icon: Plane, name: 'Travel', description: 'Agencies, Hotels, Tours' },
  { icon: Ship, name: 'Import/Export', description: 'International Trade' }
]

const stats = [
  { icon: Users, value: '50K+', label: 'Active Users' },
  { icon: Download, value: '100K+', label: 'Invoices Created' },
  { icon: Star, value: '4.8', label: 'Average Rating' },
  { icon: Globe, value: '150+', label: 'Countries' }
]

const benefits = [
  {
    icon: Shield,
    title: '100% Free Forever',
    description: 'No hidden fees, no subscriptions, no limitations. Create unlimited invoices completely free.'
  },
  {
    icon: Clock,
    title: 'Save Time',
    description: 'Create professional invoices in minutes, not hours. Our advanced customization tools do the heavy lifting.'
  },
  {
    icon: CheckCircle,
    title: 'Professional Quality',
    description: 'Industry-standard designs that impress clients and maintain your brand reputation.'
  },
  {
    icon: TrendingUp,
    title: 'Grow Your Business',
    description: 'Professional invoices help you get paid faster and build trust with clients.'
  }
]

const faqs = [
  { q: 'Is Invoice Meta 100% free?', a: 'Yes. You can create and download unlimited invoices free of charge. No watermark by default.' },
  { q: 'Do I need to sign up?', a: 'No account is required. Start creating invoices instantly.' },
  { q: 'Can I download a PDF?', a: 'Yes. Download high-quality PDFs instantly from the preview page.' },
  { q: 'Is my data secure?', a: 'We do not require logins. Shared invoices are stored server-side only when you generate a share link.' },
  { q: 'Who can see my shared invoice?', a: 'Only people with your share link can view it. Links are hard to guess and contain a short unique ID.' },
  { q: 'How long are shared invoices stored?', a: 'Shared invoices are automatically deleted after 30 days. This keeps your data light and private.' },
  { q: 'Can I delete a shared invoice sooner?', a: 'Yes. Contact support from the footer with the share link and we will remove it early.' },
  { q: 'Does it work on mobile?', a: 'Yes. The interface is fully responsive on phones and tablets.' },
  { q: 'Can I add my logo and branding?', a: 'Yes. Upload a logo, set colors, fonts, and watermark text from the design panel.' },
  { q: 'What countries and currencies are supported?', a: 'You can use it anywhere. Choose date formats, currency symbol positions, and decimals to match your locale.' },
  { q: 'Can I edit an invoice after sharing?', a: 'Yes. Update the invoice and generate a new share link if you need to send a revised version.' },
]

export default function Home() {
  const [activeFeature, setActiveFeature] = useState(0)

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
            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {trustBadges.map((badge, index) => (
                <motion.div
                  key={badge.text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200"
                >
                  <badge.icon className={`w-4 h-4 ${badge.color}`} />
                  <span className="text-sm font-medium text-gray-700">{badge.text}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 mb-6">
              <Crown className="w-6 h-6 text-yellow-500" />
              <span className="text-sm font-medium text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full">
                Most Advanced Free Invoice Tool
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Create Professional
              <span className="text-gradient block">Invoices</span>
              Like Never Before
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              The most advanced, feature-rich invoice creation tool available for free. 
              Designed for every industry, every business size, and every user skill level.
            </p>

            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/create-invoice/enhanced">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xl font-bold py-5 px-10 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 flex items-center gap-3 mx-auto sm:mx-0">
                  <Zap className="w-6 h-6" />
                  Create Invoice with Invoice Meta
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>



            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl mx-auto mb-3">
                    <stat.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-delayed"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-more-delayed"></div>
        </div>
      </section>

      {/* FAQ Section (SEO + AEO) */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">Quick answers for users and answer engines</p>
          </div>
          <div className="space-y-6">
            {faqs.map((f, i) => (
              <div key={i} className="p-6 rounded-xl border bg-white">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.q}</h3>
                <p className="text-gray-700">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map(f => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
              })),
            }),
          }}
        />
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Create professional invoices in just 3 simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-primary-600" />
                  </div>
                </div>
                <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA after How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/create-invoice/enhanced">
              <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-lg font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                Start Creating Now
              </button>
            </Link>
          </motion.div>
        </div>
      </section>



      {/* Industries Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Designed for Every Industry
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From tech startups to healthcare providers, we have specialized features for your business
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {industries.map((industry, index) => (
              <motion.div
                key={industry.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group cursor-pointer"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <industry.icon className="w-10 h-10 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{industry.name}</h3>
                <p className="text-sm text-gray-600">{industry.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose Our Free Tool?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We believe professional tools should be accessible to everyone, not just big corporations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-success-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <benefit.icon className="w-8 h-8 text-success-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Create Amazing Invoices?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses already using Invoice Meta. 
              Start creating professional invoices in minutes, completely free.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link href="/create-invoice/enhanced">
                <button className="bg-white text-primary-600 hover:bg-gray-50 font-bold py-5 px-10 rounded-2xl transition-all duration-200 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 flex items-center gap-3 mx-auto sm:mx-0 text-lg">
                  <Sparkles className="w-6 h-6" />
                  Create Invoice with Invoice Meta
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>

            <div className="mt-8 text-primary-100">
              <p className="text-sm">✨ No credit card required • No hidden fees • No limitations</p>
            </div>
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