'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Palette, Type, Layout, Image, Settings } from 'lucide-react'
/* Unused component - removing for production build size */

interface CustomizationOptions {
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  layoutStyle: string
  includeLogo: boolean
  includeQR: boolean
}

const defaultOptions: CustomizationOptions = {
  primaryColor: '#3B82F6',
  secondaryColor: '#1F2937',
  fontFamily: 'Inter',
  layoutStyle: 'standard',
  includeLogo: false,
  includeQR: false
}

const fontOptions = ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Poppins']
const layoutStyles = ['Standard', 'Compact', 'Detailed', 'Creative']

export default function CustomizationPanel() {
  const [options, setOptions] = useState<CustomizationOptions>(defaultOptions)
  const [activeTab, setActiveTab] = useState('colors')

  const updateOption = (key: keyof CustomizationOptions, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }))
  }

  const tabs = [
    { id: 'colors', name: 'Colors', icon: Palette },
    { id: 'fonts', name: 'Fonts', icon: Type },
    { id: 'layout', name: 'Layout', icon: Layout },
    { id: 'branding', name: 'Branding', icon: Image },
    { id: 'advanced', name: 'Advanced', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Customize Your Invoice
          </h1>
          <p className="text-gray-600">
            Personalize colors, fonts, and layout to match your brand
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Customization Panel */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Customization Options
              </h2>

              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-2 mb-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                        activeTab === tab.id
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.name}
                    </button>
                  )
                })}
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {activeTab === 'colors' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <h3 className="font-medium text-gray-900">Color Scheme</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Primary Color
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={options.primaryColor}
                            onChange={(e) => updateOption('primaryColor', e.target.value)}
                            className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={options.primaryColor}
                            onChange={(e) => updateOption('primaryColor', e.target.value)}
                            className="flex-1 input-field text-sm font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Secondary Color
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={options.secondaryColor}
                            onChange={(e) => updateOption('secondaryColor', e.target.value)}
                            className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={options.secondaryColor}
                            onChange={(e) => updateOption('secondaryColor', e.target.value)}
                            className="flex-1 input-field text-sm font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'fonts' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <h3 className="font-medium text-gray-900">Typography</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Font Family
                      </label>
                      <select
                        value={options.fontFamily}
                        onChange={(e) => updateOption('fontFamily', e.target.value)}
                        className="input-field"
                      >
                        {fontOptions.map(font => (
                          <option key={font} value={font}>{font}</option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'layout' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <h3 className="font-medium text-gray-900">Layout Options</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Layout Style
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {layoutStyles.map(style => (
                          <button
                            key={style}
                            onClick={() => updateOption('layoutStyle', style.toLowerCase())}
                            className={`p-3 rounded-lg border text-center text-sm transition-all duration-200 ${
                              options.layoutStyle === style.toLowerCase()
                                ? 'border-primary-500 bg-primary-50 text-primary-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {style}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'branding' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <h3 className="font-medium text-gray-900">Branding</h3>
                    
                    <div>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={options.includeLogo}
                          onChange={(e) => updateOption('includeLogo', e.target.checked)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">Include Company Logo</span>
                      </label>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'advanced' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <h3 className="font-medium text-gray-900">Advanced Features</h3>
                    
                    <div>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={options.includeQR}
                          onChange={(e) => updateOption('includeQR', e.target.checked)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">Include QR Code</span>
                      </label>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
                <button className="btn-secondary flex-1">
                  Reset
                </button>
                <button className="btn-primary flex-1">
                  Save & Apply
                </button>
              </div>
            </div>
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Live Preview
              </h2>

              <div className="bg-white border border-gray-200 rounded-xl p-8 min-h-[600px]">
                {/* Preview Header */}
                <div className="text-center mb-8">
                  <h1 
                    className="text-2xl font-bold mb-2"
                    style={{ color: options.primaryColor, fontFamily: options.fontFamily }}
                  >
                    INVOICE
                  </h1>
                  <p className="text-gray-600">Professional Invoice Template</p>
                </div>

                {/* Company Info */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: options.secondaryColor }}>
                      From:
                    </h3>
                    <p className="font-medium">Your Company Name</p>
                    <p className="text-sm text-gray-600">Professional Services</p>
                    <p className="text-sm text-gray-600">www.yourcompany.com</p>
                  </div>
                  <div className="text-right">
                    <h3 className="font-semibold mb-2" style={{ color: options.secondaryColor }}>
                      Invoice Details:
                    </h3>
                    <p className="text-sm text-gray-600">Invoice #: INV-001</p>
                    <p className="text-sm text-gray-600">Date: {new Date().toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600">Due: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Sample Content */}
                <div className="space-y-4">
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-semibold mb-2" style={{ color: options.primaryColor }}>
                      Services Rendered
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">
                        This is a preview of how your invoice will look with the selected customization options.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Color Preview */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold mb-3">Applied Customizations</h4>
                  <div className="flex gap-4 items-center">
                    <div className="flex gap-2">
                      <div
                        className="w-8 h-8 rounded-lg border-2 border-white shadow-sm"
                        style={{ backgroundColor: options.primaryColor }}
                      />
                      <div
                        className="w-8 h-8 rounded-lg border-2 border-white shadow-sm"
                        style={{ backgroundColor: options.secondaryColor }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">
                      Font: {options.fontFamily} | Layout: {options.layoutStyle}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 