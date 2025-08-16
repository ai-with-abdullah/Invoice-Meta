'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format, parseISO } from 'date-fns'
import { 
  Plus, 
  Trash2, 
  Download, 
  Eye, 
  Save, 
  FileText, 
  Settings, 
  Building, 
  User, 
  Package, 
  Share2,
  Mail,
  MessageSquare,
  Link,
  Image,
  QrCode,
  Copy,
  Twitter,
  Facebook,
  Linkedin,
  Phone,
  Palette,
  Type,
  Layout,
  X
} from 'lucide-react'
import QRCode from 'qrcode'
// Lazy-load heavy libs when needed to improve initial performance
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function EnhancedCreateInvoice() {
  const [activeTab, setActiveTab] = useState('create')
  const [showShareModal, setShowShareModal] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('')
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [isGeneratingQR, setIsGeneratingQR] = useState(false)
  const [shareLink, setShareLink] = useState('')
  const [isDesignPanelOpen, setIsDesignPanelOpen] = useState(false)

  interface DesignOptions {
    primaryColor: string
    textColor: string
    backgroundColor: string
    borderColor: string
    fontFamily: string
    baseFontSize: number
    lineHeight: number
    borderRadius: number
    spacing: number
    headerAlignment: 'left' | 'center' | 'right'
    logoPosition: 'left' | 'center' | 'right'
    showLogo: boolean
    showDividers: boolean
    theme: 'modern' | 'classic' | 'minimal' | 'creative'
    paperSize: 'A4' | 'Letter'
    tableStyle: 'minimal' | 'striped' | 'borders'
    currencyPosition: 'before' | 'after'
    decimals: 0 | 2
    accentStyle: 'none' | 'top-line' | 'top-bar'
    logoSize: 'sm' | 'md' | 'lg'
    dateFormat: 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'DD Mon YYYY'
    watermarkText: string
    watermarkOpacity: 0.1 | 0.2 | 0.3
  }

  const [designOptions, setDesignOptions] = useState<DesignOptions>({
    primaryColor: '#1F2937',
    textColor: '#111827',
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    fontFamily: 'Inter',
    baseFontSize: 14,
    lineHeight: 1.6,
    borderRadius: 12,
    spacing: 24,
    headerAlignment: 'center',
    logoPosition: 'left',
    showLogo: true,
    showDividers: true,
    theme: 'modern',
    paperSize: 'A4',
    tableStyle: 'minimal',
    currencyPosition: 'before',
    decimals: 2,
    accentStyle: 'none',
    logoSize: 'md',
    dateFormat: 'YYYY-MM-DD',
    watermarkText: 'Invoice Meta',
    watermarkOpacity: 0.1
  })

  // Load persisted customization options (including watermark settings)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('customizeOptions')
      if (saved) {
        const parsed = JSON.parse(saved)
        setDesignOptions(prev => ({
          ...prev,
          ...(parsed.primaryColor ? { primaryColor: parsed.primaryColor } : {}),
          ...(parsed.textColor ? { textColor: parsed.textColor } : {}),
          ...(parsed.backgroundColor ? { backgroundColor: parsed.backgroundColor } : {}),
          ...(parsed.borderColor ? { borderColor: parsed.borderColor } : {}),
          ...(parsed.fontFamily ? { fontFamily: parsed.fontFamily } : {}),
          ...(parsed.watermarkText ? { watermarkText: parsed.watermarkText } : {}),
          ...(parsed.watermarkOpacity ? { watermarkOpacity: parsed.watermarkOpacity as 0.1 | 0.2 | 0.3 } : {}),
        }))
        if (typeof parsed.includeWatermark === 'boolean') {
          setInvoiceData(prev => ({ ...prev, includeWatermark: parsed.includeWatermark }))
        }
      }
    } catch {}
  }, [])

  const fontOptions = [
    'Inter',
    'Roboto',
    'Open Sans',
    'Poppins',
    'Montserrat',
    'Lato',
    'Source Sans Pro',
    'Nunito',
    'Work Sans',
    'DM Sans',
    'Merriweather',
    'Playfair Display',
    'Oswald',
    'Raleway',
    'PT Sans',
    'Noto Sans'
  ]

  const resolveFontStack = (fontName: string) => {
    const quoted = fontName.includes(' ') ? `"${fontName}"` : fontName
    return `${quoted}, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"`
  }

  const buildGoogleFontHref = (fontName: string) => {
    const family = fontName.replace(/\s+/g, '+')
    return `https://fonts.googleapis.com/css2?family=${family}:wght@400;500;600;700&display=swap`
  }

  const [dynamicFontHref, setDynamicFontHref] = useState<string>(buildGoogleFontHref('Inter'))
  const [fontCss, setFontCss] = useState<string>('')

  useEffect(() => {
    if (fontOptions.includes(designOptions.fontFamily)) {
      const href = buildGoogleFontHref(designOptions.fontFamily)
      setDynamicFontHref(href)
      // Dynamically inject or replace the link tag
      const id = 'dynamic-google-font-link'
      let link = document.getElementById(id) as HTMLLinkElement | null
      if (!link) {
        link = document.createElement('link')
        link.id = id
        link.rel = 'stylesheet'
        document.head.appendChild(link)
      }
      link.href = href
      // Also set a CSS variable to force re-render styling
      setFontCss(`:root{--invoice-font: ${resolveFontStack(designOptions.fontFamily)};}`)
    }
  }, [designOptions.fontFamily])
  const colorChoices = [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Indigo', value: '#6366F1' },
    { name: 'Green', value: '#10B981' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Orange', value: '#F59E0B' },
    { name: 'Slate', value: '#64748B' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Teal', value: '#14B8A6' },
    { name: 'Gray', value: '#374151' }
  ]
  const textChoices = [
    { name: 'Almost Black', value: '#111827' },
    { name: 'Dark Gray', value: '#1F2937' },
    { name: 'Gray', value: '#374151' }
  ]
  const backgroundChoices = [
    { name: 'White', value: '#FFFFFF' },
    { name: 'Warm Gray', value: '#F9FAFB' },
    { name: 'Cool Gray', value: '#F3F4F6' }
  ]
  const borderChoices = [
    { name: 'Light Gray', value: '#E5E7EB' },
    { name: 'Slate', value: '#CBD5E1' },
    { name: 'Neutral', value: '#D1D5DB' }
  ]

  const sizeChoices = [12, 13, 14, 15, 16, 18, 20]
  const lineHeightChoices = [1.4, 1.6, 1.8]
  const radiusChoices = [0, 4, 8, 12, 16, 20, 24]
  const spacingChoices = [16, 20, 24, 28, 32, 36, 40]

  const applyTheme = (theme: DesignOptions['theme']) => {
    const maps: Record<string, Partial<DesignOptions>> = {
      modern: { primaryColor: '#1F2937', backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', textColor: '#111827' },
      classic: { primaryColor: '#374151', backgroundColor: '#F9FAFB', borderColor: '#D1D5DB', textColor: '#111827' },
      minimal: { primaryColor: '#000000', backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', textColor: '#111827' },
      creative: { primaryColor: '#8B5CF6', backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', textColor: '#111827' }
    }
    setDesignOptions(prev => ({ ...prev, ...maps[theme], theme }))
  }

  const formatAmount = (amount: number) => {
    const fixed = designOptions.decimals === 0 ? Math.round(amount) : amount
    const numStr = designOptions.decimals === 0 ? fixed.toString() : fixed.toFixed(2)
    const formatted = numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    const symbol = getCurrencySymbol(invoiceData.currency)
    return designOptions.currencyPosition === 'before' ? `${symbol} ${formatted}` : `${formatted} ${symbol}`
  }

  const formatDateSafe = (dateStr: string) => {
    if (!dateStr) return ''
    try {
      const date = parseISO(dateStr)
      switch (designOptions.dateFormat) {
        case 'DD/MM/YYYY':
          return format(date, 'dd/MM/yyyy')
        case 'MM/DD/YYYY':
          return format(date, 'MM/dd/yyyy')
        case 'DD Mon YYYY':
          return format(date, 'dd LLL yyyy')
        case 'YYYY-MM-DD':
        default:
          return format(date, 'yyyy-MM-dd')
      }
    } catch {
      return dateStr
    }
  }
  
  // Invoice data state
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: '',
    issueDate: '',
    dueDate: '',
    currency: '',
    invoiceType: '',
    language: '',
    company: {
      name: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      email: '',
      phone: '',
      taxId: '',
      logo: ''
    },
    client: {
      name: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      email: '',
      phone: '',
      taxId: ''
    },
    items: [
      {
        id: '1',
        description: '',
        quantity: 1,
        rate: 0,
        amount: 0
      }
    ],
    taxRate: 0,
    taxAmount: 0,
    discountRate: 0,
    discountAmount: 0,
    subtotal: 0,
    total: 0,
    notes: '',
    terms: '',
    includeWatermark: false
  })

  // Comprehensive list of world currencies
  const worldCurrencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
    { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
    { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
    { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
    { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
    { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
    { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
    { code: 'PLN', name: 'Polish Złoty', symbol: 'zł' },
    { code: 'THB', name: 'Thai Baht', symbol: '฿' },
    { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
    { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
    { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
    { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč' },
    { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft' },
    { code: 'ILS', name: 'Israeli Shekel', symbol: '₪' },
    { code: 'CLP', name: 'Chilean Peso', symbol: '$' },
    { code: 'COP', name: 'Colombian Peso', symbol: '$' },
    { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£' },
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
    { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨' },
    { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳' },
    { code: 'VND', name: 'Vietnamese Dong', symbol: '₫' },
    { code: 'ARS', name: 'Argentine Peso', symbol: '$' },
    { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/' },
    { code: 'UAH', name: 'Ukrainian Hryvnia', symbol: '₴' },
    { code: 'RON', name: 'Romanian Leu', symbol: 'lei' },
    { code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв' },
    { code: 'HRK', name: 'Croatian Kuna', symbol: 'kn' },
    { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
    { code: 'ISK', name: 'Icelandic Króna', symbol: 'kr' },
    { code: 'RSD', name: 'Serbian Dinar', symbol: 'дин' },
    { code: 'UYU', name: 'Uruguayan Peso', symbol: '$' },
    { code: 'BOB', name: 'Bolivian Boliviano', symbol: 'Bs' },
    { code: 'PYG', name: 'Paraguayan Guaraní', symbol: '₲' },
    { code: 'GTQ', name: 'Guatemalan Quetzal', symbol: 'Q' },
    { code: 'HNL', name: 'Honduran Lempira', symbol: 'L' },
    { code: 'NIO', name: 'Nicaraguan Córdoba', symbol: 'C$' },
    { code: 'CRC', name: 'Costa Rican Colón', symbol: '₡' },
    { code: 'PAB', name: 'Panamanian Balboa', symbol: 'B/' },
    { code: 'DOP', name: 'Dominican Peso', symbol: '$' },
    { code: 'JMD', name: 'Jamaican Dollar', symbol: 'J$' },
    { code: 'TTD', name: 'Trinidad and Tobago Dollar', symbol: 'TT$' },
    { code: 'BBD', name: 'Barbadian Dollar', symbol: 'Bds$' },
    { code: 'XCD', name: 'East Caribbean Dollar', symbol: 'EC$' },
    { code: 'BZD', name: 'Belize Dollar', symbol: 'BZ$' },
    { code: 'GYD', name: 'Guyanese Dollar', symbol: 'G$' },
    { code: 'SRD', name: 'Surinamese Dollar', symbol: '$' },
    { code: 'BMD', name: 'Bermudian Dollar', symbol: 'BD$' },
    { code: 'KYD', name: 'Cayman Islands Dollar', symbol: 'CI$' },
    { code: 'FJD', name: 'Fijian Dollar', symbol: 'FJ$' },
    { code: 'WST', name: 'Samoan Tālā', symbol: 'T' },
    { code: 'TOP', name: 'Tongan Paʻanga', symbol: 'T$' },
    { code: 'VUV', name: 'Vanuatu Vatu', symbol: 'VT' },
    { code: 'SBD', name: 'Solomon Islands Dollar', symbol: 'SI$' },
    { code: 'PGK', name: 'Papua New Guinean Kina', symbol: 'K' },
    { code: 'KID', name: 'Kiribati Dollar', symbol: '$' },
    { code: 'TVD', name: 'Tuvaluan Dollar', symbol: '$' },
    { code: 'NAD', name: 'Namibian Dollar', symbol: 'N$' },
    { code: 'BWP', name: 'Botswana Pula', symbol: 'P' },
    { code: 'LSL', name: 'Lesotho Loti', symbol: 'L' },
    { code: 'SZL', name: 'Eswatini Lilangeni', symbol: 'E' },
    { code: 'MUR', name: 'Mauritian Rupee', symbol: '₨' },
    { code: 'SCR', name: 'Seychellois Rupee', symbol: '₨' },
    { code: 'MVR', name: 'Maldivian Rufiyaa', symbol: 'Rf' },
    { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs' },
    { code: 'NPR', name: 'Nepalese Rupee', symbol: '₨' },
    { code: 'BTN', name: 'Bhutanese Ngultrum', symbol: 'Nu' },
    { code: 'MMK', name: 'Myanmar Kyat', symbol: 'K' },
    { code: 'LAK', name: 'Lao Kip', symbol: '₭' },
    { code: 'KHR', name: 'Cambodian Riel', symbol: '៛' },
    { code: 'MNT', name: 'Mongolian Tögrög', symbol: '₮' },
    { code: 'KZT', name: 'Kazakhstani Tenge', symbol: '₸' },
    { code: 'UZS', name: 'Uzbekistani Som', symbol: 'so\'m' },
    { code: 'TJS', name: 'Tajikistani Somoni', symbol: 'ЅM' },
    { code: 'TMT', name: 'Turkmenistan Manat', symbol: 'T' },
    { code: 'AZN', name: 'Azerbaijani Manat', symbol: '₼' },
    { code: 'GEL', name: 'Georgian Lari', symbol: '₾' },
    { code: 'AMD', name: 'Armenian Dram', symbol: '֏' },
    { code: 'BYN', name: 'Belarusian Ruble', symbol: 'Br' },
    { code: 'MDL', name: 'Moldovan Leu', symbol: 'L' },
    { code: 'ALL', name: 'Albanian Lek', symbol: 'L' },
    { code: 'MKD', name: 'North Macedonian Denar', symbol: 'ден' },
    { code: 'MNE', name: 'Montenegrin Euro', symbol: '€' },
    { code: 'BIH', name: 'Bosnia and Herzegovina Convertible Mark', symbol: 'KM' },
    { code: 'XOF', name: 'West African CFA Franc', symbol: 'CFA' },
    { code: 'XAF', name: 'Central African CFA Franc', symbol: 'FCFA' },
    { code: 'XPF', name: 'CFP Franc', symbol: '₣' },
    { code: 'ANG', name: 'Netherlands Antillean Guilder', symbol: 'ƒ' },
    { code: 'AWG', name: 'Aruban Florin', symbol: 'ƒ' },
    { code: 'BIF', name: 'Burundian Franc', symbol: 'FBu' },
    { code: 'CDF', name: 'Congolese Franc', symbol: 'FC' },
    { code: 'DJF', name: 'Djiboutian Franc', symbol: 'Fdj' },
    { code: 'GNF', name: 'Guinean Franc', symbol: 'FG' },
    { code: 'KMF', name: 'Comorian Franc', symbol: 'CF' },
    { code: 'RWF', name: 'Rwandan Franc', symbol: 'FRw' },
    { code: 'TND', name: 'Tunisian Dinar', symbol: 'د.ت' },
    { code: 'LYD', name: 'Libyan Dinar', symbol: 'ل.د' },
    { code: 'MAD', name: 'Moroccan Dirham', symbol: 'د.م.' },
    { code: 'DZD', name: 'Algerian Dinar', symbol: 'د.ج' },
    { code: 'TND', name: 'Tunisian Dinar', symbol: 'د.ت' },
    { code: 'QAR', name: 'Qatari Riyal', symbol: 'ر.ق' },
    { code: 'SAR', name: 'Saudi Riyal', symbol: 'ر.س' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
    { code: 'OMR', name: 'Omani Rial', symbol: 'ر.ع.' },
    { code: 'BHD', name: 'Bahraini Dinar', symbol: '.د.ب' },
    { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك' },
    { code: 'JOD', name: 'Jordanian Dinar', symbol: 'د.ا' },
    { code: 'LBP', name: 'Lebanese Pound', symbol: 'ل.ل' },
    { code: 'SYP', name: 'Syrian Pound', symbol: 'ل.س' },
    { code: 'IQD', name: 'Iraqi Dinar', symbol: 'ع.د' },
    { code: 'IRR', name: 'Iranian Rial', symbol: '﷼' },
    { code: 'AFN', name: 'Afghan Afghani', symbol: '؋' },

  ]

  // Comprehensive list of world languages
  const worldLanguages = [
    { code: 'English', name: 'English' },
    { code: 'Spanish', name: 'Español' },
    { code: 'French', name: 'Français' },
    { code: 'German', name: 'Deutsch' },
    { code: 'Italian', name: 'Italiano' },
    { code: 'Portuguese', name: 'Português' },
    { code: 'Dutch', name: 'Nederlands' },
    { code: 'Russian', name: 'Русский' },
    { code: 'Chinese', name: '中文' },
    { code: 'Japanese', name: '日本語' },
    { code: 'Korean', name: '한국어' },
    { code: 'Arabic', name: 'العربية' },
    { code: 'Hindi', name: 'हिन्दी' },
    { code: 'Bengali', name: 'বাংলা' },
    { code: 'Urdu', name: 'اردو' },
    { code: 'Turkish', name: 'Türkçe' },
    { code: 'Polish', name: 'Polski' },
    { code: 'Ukrainian', name: 'Українська' },
    { code: 'Romanian', name: 'Română' },
    { code: 'Bulgarian', name: 'Български' },
    { code: 'Czech', name: 'Čeština' },
    { code: 'Hungarian', name: 'Magyar' },
    { code: 'Slovak', name: 'Slovenčina' },
    { code: 'Slovenian', name: 'Slovenščina' },
    { code: 'Croatian', name: 'Hrvatski' },
    { code: 'Serbian', name: 'Српски' },
    { code: 'Bosnian', name: 'Bosanski' },
    { code: 'Macedonian', name: 'Македонски' },
    { code: 'Albanian', name: 'Shqip' },
    { code: 'Greek', name: 'Ελληνικά' },
    { code: 'Swedish', name: 'Svenska' },
    { code: 'Norwegian', name: 'Norsk' },
    { code: 'Danish', name: 'Dansk' },
    { code: 'Finnish', name: 'Suomi' },
    { code: 'Icelandic', name: 'Íslenska' },
    { code: 'Estonian', name: 'Eesti' },
    { code: 'Latvian', name: 'Latviešu' },
    { code: 'Lithuanian', name: 'Lietuvių' },
    { code: 'Thai', name: 'ไทย' },
    { code: 'Vietnamese', name: 'Tiếng Việt' },
    { code: 'Indonesian', name: 'Bahasa Indonesia' },
    { code: 'Malay', name: 'Bahasa Melayu' },
    { code: 'Filipino', name: 'Filipino' },
    { code: 'Khmer', name: 'ខ្មែរ' },
    { code: 'Lao', name: 'ລາວ' },
    { code: 'Burmese', name: 'မြန်မာ' },
    { code: 'Mongolian', name: 'Монгол' },
    { code: 'Kazakh', name: 'Қазақ' },
    { code: 'Uzbek', name: 'O\'zbek' },
    { code: 'Kyrgyz', name: 'Кыргызча' },
    { code: 'Tajik', name: 'Тоҷикӣ' },
    { code: 'Turkmen', name: 'Türkmençe' },
    { code: 'Azerbaijani', name: 'Azərbaycan' },
    { code: 'Georgian', name: 'ქართული' },
    { code: 'Armenian', name: 'Հայերեն' },
    { code: 'Hebrew', name: 'עברית' },
    { code: 'Persian', name: 'فارسی' },
    { code: 'Kurdish', name: 'کوردی' },
    { code: 'Pashto', name: 'پښتو' },
    { code: 'Dari', name: 'دری' },
    { code: 'Uyghur', name: 'ئۇيغۇرچە' },
    { code: 'Tibetan', name: 'བོད་ཡིག' },
    { code: 'Nepali', name: 'नेपाली' },
    { code: 'Sinhala', name: 'සිංහල' },
    { code: 'Dhivehi', name: 'ދިވެހިބަހުން' },
    { code: 'Maldivian', name: 'ދިވެހިބަހުން' },
    { code: 'Swahili', name: 'Kiswahili' },
    { code: 'Yoruba', name: 'Yorùbá' },
    { code: 'Igbo', name: 'Igbo' },
    { code: 'Hausa', name: 'Hausa' },
    { code: 'Amharic', name: 'አማርኛ' },
    { code: 'Oromo', name: 'Afaan Oromoo' },
    { code: 'Somali', name: 'Soomaali' },
    { code: 'Tigrinya', name: 'ትግርኛ' },
    { code: 'Kinyarwanda', name: 'Ikinyarwanda' },
    { code: 'Kirundi', name: 'Ikirundi' },
    { code: 'Lingala', name: 'Lingála' },
    { code: 'Kikongo', name: 'Kikongo' },
    { code: 'Tshiluba', name: 'Tshiluba' }
  ]

  // State for dropdowns
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false)
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [filteredCurrencies, setFilteredCurrencies] = useState(worldCurrencies)
  const [filteredLanguages, setFilteredLanguages] = useState(worldLanguages)
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.currency-dropdown') && !target.closest('.language-dropdown')) {
        setShowCurrencyDropdown(false)
        setShowLanguageDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Helper function to get currency symbol
  const getCurrencySymbol = (currencyCode: string) => {
    const currency = worldCurrencies.find(c => c.code === currencyCode)
    return currency ? currency.symbol : currencyCode
  }

  // Logo upload handler
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setInvoiceData(prev => ({
          ...prev,
          company: { ...prev.company, logo: e.target?.result as string }
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const tabs = [
    { id: 'create', name: 'Create Invoice', icon: FileText },
    { id: 'preview', name: 'Preview', icon: Eye }
  ]

  const addItem = () => {
    const newItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    }
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }))
    
    // Recalculate totals when adding items
    setTimeout(() => calculateTotal(), 0)
  }

  const removeItem = (id: string) => {
    if (invoiceData.items.length > 1) {
      setInvoiceData(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== id)
      }))
      
      // Recalculate totals when removing items
      setTimeout(() => calculateTotal(), 0)
    }
  }

  const updateItem = (id: string, field: string, value: any) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }
          if (field === 'quantity' || field === 'rate') {
            // Ensure numeric values for calculations
            const quantity = Number(updatedItem.quantity) || 0
            const rate = Number(updatedItem.rate) || 0
            updatedItem.amount = quantity * rate
          }
          return updatedItem
        }
        return item
      })
    }))
    
    // Recalculate totals when items change
    setTimeout(() => calculateTotal(), 0)
  }

  const updateField = (section: string, field: string, value: string) => {
    setInvoiceData(prev => {
      const currentSection = prev[section as keyof typeof prev]
      if (currentSection && typeof currentSection === 'object') {
        return {
      ...prev,
      [section]: {
            ...currentSection,
        [field]: value
      }
        }
      }
      return prev
    })
  }

  const updateInvoiceField = (field: string, value: string) => {
    setInvoiceData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Recalculate totals when tax or discount rates change
    if (field === 'taxRate' || field === 'discountRate') {
      setTimeout(() => calculateTotal(), 0)
    }
  }

  const calculateTotal = () => {
    const subtotal = invoiceData.items.reduce((sum, item) => {
      const amount = Number(item.amount) || 0
      return sum + amount
    }, 0)
    
    const taxAmount = (subtotal * (invoiceData.taxRate / 100)) || 0
    const discountAmount = (subtotal * (invoiceData.discountRate / 100)) || 0
    const total = subtotal + taxAmount - discountAmount
    
    // Update the state with calculated values
    setInvoiceData(prev => ({
      ...prev,
      subtotal,
      taxAmount,
      discountAmount,
      total
    }))
    
    return total
  }

  // Generate QR Code
  const generateQRCode = async () => {
    setIsGeneratingQR(true)
    try {
      // Generate share link first
      const shareUrl = await generateShareLink()
      
      const qrData = {
        invoiceNumber: invoiceData.invoiceNumber,
        company: invoiceData.company.name,
        client: invoiceData.client.name,
        total: invoiceData.total,
        dueDate: invoiceData.dueDate,
        url: shareUrl,
        // Include the actual shareable URL for easy access
        shareLink: shareUrl
      }
      
      // Avoid overly long payloads; some QR renderers fail on huge data URLs
      const payload = JSON.stringify(qrData)
      const qrDataUrl = await QRCode.toDataURL(payload, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      setQrCodeDataUrl(qrDataUrl)
      setShowQRModal(true)
    } catch (error) {
      console.error('Error generating QR code:', error)
      toast.error('Failed to generate QR code')
    } finally {
      setIsGeneratingQR(false)
    }
  }

  // Download PDF functionality
  const downloadPDF = async () => {
    setIsGeneratingPDF(true)
    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'),
        import('html2canvas'),
      ])
      // Capture the on-screen styled preview so PDF matches customization
      const invoiceElement = document.getElementById('invoice-preview')
      if (!invoiceElement) {
        toast.error('Invoice PDF preview element not found')
        return
      }

      const canvas = await html2canvas(invoiceElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      // Add margins to the PDF (20mm on all sides)
      const margin = 20
      const imgWidth = 210 - (margin * 2) // 170mm width with margins
      const pageHeight = 295 - (margin * 2) // 255mm height with margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = margin

      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + margin
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`invoice-${invoiceData.invoiceNumber}.pdf`)
      toast.success('PDF downloaded successfully!')
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('Failed to generate PDF')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  // Copy to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy:', error)
      toast.error('Failed to copy to clipboard')
    }
  }

  // Generate backend-backed share link
  const generateShareLink = async (): Promise<string> => {
    const res = await fetch('/api/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoice: invoiceData, design: designOptions })
    })
    if (!res.ok) {
      toast.error('Failed to create share link')
      throw new Error('Share failed')
    }
    const { id } = await res.json()
    const url = `${window.location.origin}/invoice/view/${id}`
    setShareLink(url)
    return url
  }

  // Share via email
  const shareViaEmail = () => {
    const subject = `Invoice ${invoiceData.invoiceNumber} from ${invoiceData.company.name}`
    const body = `Please find attached invoice ${invoiceData.invoiceNumber} for ${invoiceData.total.toFixed(2)} ${invoiceData.currency}.\n\nDue Date: ${invoiceData.dueDate}\n\nThank you for your business.`
    const mailtoLink = `mailto:${invoiceData.client.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailtoLink)
  }

  // Share via WhatsApp
  const shareViaWhatsApp = () => {
    const text = `Invoice ${invoiceData.invoiceNumber} from ${invoiceData.company.name} - ${invoiceData.total.toFixed(2)} ${invoiceData.currency}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(whatsappUrl, '_blank')
  }

  // Share via social media
  const shareViaSocial = async (platform: string) => {
    const text = `Invoice ${invoiceData.invoiceNumber} from ${invoiceData.company.name}`
    const url = await generateShareLink()
    
    let shareUrl = ''
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        break
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Advanced Invoice Builder</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <style dangerouslySetInnerHTML={{ __html: fontCss }} />
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700 shadow-medium'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
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
          {activeTab === 'create' && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="card"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Create Invoice
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Number</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter invoice number (e.g., INV-001)"
                    value={invoiceData.invoiceNumber || ''}
                    onChange={(e) => updateInvoiceField('invoiceNumber', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Issue Date</label>
                  <input
                    type="date"
                    className="input-field"
                    placeholder="Select issue date"
                    value={invoiceData.issueDate || ''}
                    onChange={(e) => updateInvoiceField('issueDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    className="input-field"
                    placeholder="Select due date"
                    value={invoiceData.dueDate || ''}
                    onChange={(e) => updateInvoiceField('dueDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <div className="relative currency-dropdown">
                    <input
                      type="text"
                      placeholder="Select currency (e.g., USD, EUR, GBP)"
                      className="input-field w-full"
                      value={invoiceData.currency ? `${worldCurrencies.find(c => c.code === invoiceData.currency)?.name} (${worldCurrencies.find(c => c.code === invoiceData.currency)?.symbol})` : ''}
                      onClick={() => setShowCurrencyDropdown(true)}
                      readOnly
                    />
                    {showCurrencyDropdown && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        <input
                          type="text"
                          placeholder="Type to search currencies..."
                          className="w-full p-3 border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onChange={(e) => {
                            const searchTerm = e.target.value.toLowerCase()
                            const filtered = worldCurrencies.filter(currency => 
                              currency.name.toLowerCase().includes(searchTerm) || 
                              currency.code.toLowerCase().includes(searchTerm)
                            )
                            setFilteredCurrencies(filtered)
                          }}
                        />
                        <div className="max-h-48 overflow-y-auto">
                          {filteredCurrencies.map(currency => (
                            <div
                              key={currency.code}
                              className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                              onClick={() => {
                                updateInvoiceField('currency', currency.code)
                                setShowCurrencyDropdown(false)
                              }}
                            >
                              <div className="font-medium">{currency.name}</div>
                              <div className="text-sm text-gray-500">{currency.code} ({currency.symbol})</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Select from {worldCurrencies.length} world currencies</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Type</label>
                  <select
                    className="input-field"
                    value={invoiceData.invoiceType || ''}
                    onChange={(e) => updateInvoiceField('invoiceType', e.target.value)}
                  >
                    <option value="" disabled>Select invoice type</option>
                    <option value="standard">Standard Invoice</option>
                    <option value="recurring">Recurring Invoice</option>
                    <option value="proforma">Proforma Invoice</option>
                    <option value="credit">Credit Note</option>
                    <option value="debit">Debit Note</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <div className="relative language-dropdown">
                    <input
                      type="text"
                      placeholder="Select language (e.g., English, Spanish, French)"
                      className="input-field w-full"
                      value={invoiceData.language || ''}
                      onClick={() => setShowLanguageDropdown(true)}
                      readOnly
                    />
                    {showLanguageDropdown && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        <input
                          type="text"
                          placeholder="Type to search languages..."
                          className="w-full p-3 border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onChange={(e) => {
                            const searchTerm = e.target.value.toLowerCase()
                            const filtered = worldLanguages.filter(lang => 
                              lang.name.toLowerCase().includes(searchTerm) || 
                              lang.code.toLowerCase().includes(searchTerm)
                            )
                            setFilteredLanguages(filtered)
                          }}
                        />
                        <div className="max-h-48 overflow-y-auto">
                          {filteredLanguages.map(lang => (
                            <div
                              key={lang.code}
                              className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                              onClick={() => {
                                updateInvoiceField('language', lang.code)
                                setShowLanguageDropdown(false)
                              }}
                            >
                              <div className="font-medium">{lang.name}</div>
                              <div className="text-sm text-gray-500">{lang.code}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Select from {worldLanguages.length} world languages</p>
                </div>
              </div>

                            {/* Company Information Section */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Company Information
                </h3>
                
                {/* Company Logo and Basic Info Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Logo Upload Square Box */}
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        className="input-field w-full h-24 flex items-center justify-center text-center"
                        onChange={handleLogoUpload}
                      />
                      {invoiceData.company.logo && (
                        <button
                          onClick={() => setInvoiceData(prev => ({ ...prev, company: { ...prev.company, logo: '' } }))}
                          className="absolute top-2 right-2 text-red-600 hover:text-red-800 p-1 rounded-lg hover:bg-red-50"
                          title="Remove Logo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    {invoiceData.company.logo && (
                      <div className="mt-2">
                        <img src={invoiceData.company.logo} alt="Company Logo" className="w-20 h-20 object-contain rounded-lg border border-gray-200 mx-auto" />
                      </div>
                    )}
                  </div>
                  
                  {/* Company Name and Email */}
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="Enter your company name"
                        value={invoiceData.company.name}
                        onChange={(e) => updateField('company', 'name', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        className="input-field"
                        placeholder="Enter company email address"
                        value={invoiceData.company.email}
                        onChange={(e) => updateField('company', 'email', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Other Company Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Enter tax identification number"
                      value={invoiceData.company.taxId}
                      onChange={(e) => updateField('company', 'taxId', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      className="input-field"
                      placeholder="Enter company phone number"
                      value={invoiceData.company.phone}
                      onChange={(e) => updateField('company', 'phone', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Enter street address"
                      value={invoiceData.company.address}
                      onChange={(e) => updateField('company', 'address', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Enter city name"
                      value={invoiceData.company.city}
                      onChange={(e) => updateField('company', 'city', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Enter state or province"
                      value={invoiceData.company.state}
                      onChange={(e) => updateField('company', 'state', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ZIP/Postal Code</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Enter ZIP or postal code"
                      value={invoiceData.company.zip}
                      onChange={(e) => updateField('company', 'zip', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Enter country name"
                      value={invoiceData.company.country}
                      onChange={(e) => updateField('company', 'country', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Client Information Section */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Client Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Client Name *</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Enter client or customer name"
                      value={invoiceData.client.name}
                      onChange={(e) => updateField('client', 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Enter client tax ID"
                      value={invoiceData.client.taxId}
                      onChange={(e) => updateField('client', 'taxId', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      className="input-field"
                      placeholder="Enter client email address"
                      value={invoiceData.client.email}
                      onChange={(e) => updateField('client', 'email', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      className="input-field"
                      placeholder="Enter client phone number"
                      value={invoiceData.client.phone}
                      onChange={(e) => updateField('client', 'phone', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Enter client street address"
                      value={invoiceData.client.address}
                      onChange={(e) => updateField('client', 'address', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Enter client city name"
                      value={invoiceData.client.city}
                      onChange={(e) => updateField('client', 'city', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Enter client state or province"
                      value={invoiceData.client.state}
                      onChange={(e) => updateField('client', 'state', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ZIP/Postal Code</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Enter client ZIP or postal code"
                      value={invoiceData.client.zip}
                      onChange={(e) => updateField('client', 'zip', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Enter client country name"
                      value={invoiceData.client.country}
                      onChange={(e) => updateField('client', 'country', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Items & Services Section */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Items & Services
                </h3>
                
                <div className="space-y-4">
                  {invoiceData.items.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-200 rounded-lg">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="Enter item or service description"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                        <input
                          type="number"
                          className="input-field"
                          min="1"
                          placeholder="Enter quantity"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rate ({getCurrencySymbol(invoiceData.currency)})</label>
                        <input
                          type="number"
                          className="input-field"
                          min="0"
                          step="0.01"
                          placeholder="Enter rate per unit"
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value))}
                        />
                      </div>
                      <div className="flex items-end">
                        <div className="w-full">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                          <div className="input-field bg-gray-50 text-gray-700">
                            {getCurrencySymbol(invoiceData.currency)} {item.amount.toFixed(2)}
                          </div>
                        </div>
                        {invoiceData.items.length > 1 && (
                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-2 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                            title="Remove Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <button
                    onClick={addItem}
                    className="btn-secondary w-full py-3 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Item or Service
                  </button>
                </div>

                {/* Tax and Discount Section */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                    <input
                      type="number"
                      className="input-field"
                      min="0"
                      max="100"
                      step="0.01"
                      placeholder="Enter tax rate"
                      value={invoiceData.taxRate}
                      onChange={(e) => updateInvoiceField('taxRate', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount Rate (%)</label>
                    <input
                      type="number"
                      className="input-field"
                      min="0"
                      max="100"
                      step="0.01"
                      placeholder="Enter discount rate"
                      value={invoiceData.discountRate}
                      onChange={(e) => updateInvoiceField('discountRate', e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">
                      {getCurrencySymbol(invoiceData.currency)} {invoiceData.subtotal.toFixed(2)}
                    </span>
                  </div>
                  {invoiceData.taxRate > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tax ({invoiceData.taxRate}%):</span>
                      <span className="font-medium text-red-600">
                        +{getCurrencySymbol(invoiceData.currency)} {invoiceData.taxAmount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {invoiceData.discountRate > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Discount ({invoiceData.discountRate}%):</span>
                      <span className="font-medium text-green-600">
                        -{getCurrencySymbol(invoiceData.currency)} {invoiceData.discountAmount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-lg font-semibold border-t pt-3">
                    <span>Total Amount:</span>
                    <span className="text-primary-600">
                      {getCurrencySymbol(invoiceData.currency)} {invoiceData.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Settings Section */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Additional Settings
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                                            <textarea
                          className="input-field"
                          rows={3}
                          placeholder="Enter additional notes or terms for the client"
                          value={invoiceData.notes}
                          onChange={(e) => setInvoiceData(prev => ({ ...prev, notes: e.target.value }))}
                        />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Terms & Conditions</label>
                    <textarea
                      className="input-field"
                      rows={3}
                      placeholder="Enter payment terms and conditions"
                      value={invoiceData.terms}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, terms: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="mt-6"></div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex justify-center">
                  <button 
                    className="btn-primary text-lg px-8 py-4 flex items-center gap-2"
                    onClick={() => setActiveTab('preview')}
                  >
                    <Eye className="w-5 h-5" />
                    Generate Invoice
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'company-info' && (
            <motion.div
              key="company-info"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="card"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Building className="w-5 h-5" />
                Company Information
                <div className="ml-auto flex gap-2">
                  {invoiceData.currency && (
                    <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      Currency: {getCurrencySymbol(invoiceData.currency)} {invoiceData.currency}
                    </span>
                  )}
                  {invoiceData.language && (
                    <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      Language: {invoiceData.language}
                    </span>
                  )}
                </div>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Your Company Name"
                    value={invoiceData.company.name}
                    onChange={(e) => updateField('company', 'name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Tax Identification Number"
                    value={invoiceData.company.taxId}
                    onChange={(e) => updateField('company', 'taxId', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="contact@company.com"
                    value={invoiceData.company.email}
                    onChange={(e) => updateField('company', 'email', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    className="input-field"
                    placeholder="+1 (555) 123-4567"
                    value={invoiceData.company.phone}
                    onChange={(e) => updateField('company', 'phone', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Street Address"
                    value={invoiceData.company.address}
                    onChange={(e) => updateField('company', 'address', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="City"
                    value={invoiceData.company.city}
                    onChange={(e) => updateField('company', 'city', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="State or Province"
                    value={invoiceData.company.state}
                    onChange={(e) => updateField('company', 'state', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ZIP/Postal Code</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="ZIP or Postal Code"
                    value={invoiceData.company.zip}
                    onChange={(e) => updateField('company', 'zip', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Country"
                    value={invoiceData.company.country}
                    onChange={(e) => updateField('company', 'country', e.target.value)}
                  />
                </div>
                                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
                   <div className="flex items-center gap-4">
                     <input
                       type="file"
                       accept="image/*"
                       className="input-field flex-1"
                       onChange={handleLogoUpload}
                     />
                     {invoiceData.company.logo && (
                       <button
                         onClick={() => setInvoiceData(prev => ({ ...prev, company: { ...prev.company, logo: '' } }))}
                         className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50"
                         title="Remove Logo"
                       >
                         <Trash2 className="w-5 h-5" />
                       </button>
                     )}
                   </div>
                   {invoiceData.company.logo && (
                     <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                       <p className="text-sm text-gray-600 mb-2">Logo Preview:</p>
                       <img src={invoiceData.company.logo} alt="Company Logo" className="w-20 h-20 object-contain rounded-lg border border-gray-200" />
                     </div>
                   )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'client-info' && (
            <motion.div
              key="client-info"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="card"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Client Information
                <div className="ml-auto flex gap-2">
                  {invoiceData.currency && (
                    <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      Currency: {getCurrencySymbol(invoiceData.currency)} {invoiceData.currency}
                    </span>
                  )}
                  {invoiceData.language && (
                    <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      Language: {invoiceData.language}
                    </span>
                  )}
                </div>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client Name *</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Client or Company Name"
                    value={invoiceData.client.name}
                    onChange={(e) => updateField('client', 'name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="client@email.com"
                    value={invoiceData.client.email}
                    onChange={(e) => updateField('client', 'email', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    className="input-field"
                    placeholder="+1 (555) 123-4567"
                    value={invoiceData.client.phone}
                    onChange={(e) => updateField('client', 'phone', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Client Tax ID"
                    value={invoiceData.client.taxId}
                    onChange={(e) => updateField('client', 'taxId', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Street Address"
                    value={invoiceData.client.address}
                    onChange={(e) => updateField('client', 'address', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="City"
                    value={invoiceData.client.city}
                    onChange={(e) => updateField('client', 'city', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="State or Province"
                    value={invoiceData.client.state}
                    onChange={(e) => updateField('client', 'state', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ZIP/Postal Code</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="ZIP or Postal Code"
                    value={invoiceData.client.zip}
                    onChange={(e) => updateField('client', 'zip', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Country"
                    value={invoiceData.client.country}
                    onChange={(e) => updateField('client', 'country', e.target.value)}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'items-services' && (
            <motion.div
              key="items-services"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="card"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Items & Services
                <div className="ml-auto flex gap-2">
                  {invoiceData.currency && (
                    <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      Currency: {getCurrencySymbol(invoiceData.currency)} {invoiceData.currency}
                    </span>
                  )}
                  {invoiceData.language && (
                    <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      Language: {invoiceData.language}
                    </span>
                  )}
                </div>
              </h2>
              
              <div className="mb-6">
                <button
                  onClick={addItem}
                  className="btn-secondary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </button>
              </div>

              <div className="space-y-4">
                {invoiceData.items.map((item, index) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="Item description"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                        <input
                          type="number"
                          className="input-field"
                          min="0"
                          step="0.01"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rate</label>
                        <div className="relative">
                        <input
                          type="number"
                            className="input-field pr-12"
                          min="0"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                        />
                          {invoiceData.currency && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <span className="text-gray-500 text-sm">
                                {getCurrencySymbol(invoiceData.currency)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                      <div className="flex gap-2">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          disabled={invoiceData.items.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-sm text-gray-500">
                        Item #{index + 1} - {getCurrencySymbol(invoiceData.currency)} {item.amount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-primary-50 rounded-lg">
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-900">
                    Total: {getCurrencySymbol(invoiceData.currency)} {calculateTotal().toFixed(2)}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="card"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Invoice Settings
                <div className="ml-auto flex gap-2">
                  {invoiceData.currency && (
                    <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      Currency: {getCurrencySymbol(invoiceData.currency)} {invoiceData.currency}
                    </span>
                  )}
                  {invoiceData.language && (
                    <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      Language: {invoiceData.language}
                    </span>
                  )}
                </div>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Display Options</h3>
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={designOptions.showLogo}
                        onChange={(e) => setDesignOptions(prev => ({ ...prev, showLogo: e.target.checked }))}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">Include Company Logo</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={false}
                        onChange={() => {}}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">Include QR Code for Payment</span>
                    </label>
                    {/* Watermark controls moved to Customize page */}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Additional Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                      <textarea
                        className="input-field"
                        rows={3}
                        placeholder="Additional notes for the client"
                        value={invoiceData.notes}
                        onChange={(e) => setInvoiceData(prev => ({ ...prev, notes: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Terms & Conditions</label>
                      <textarea
                        className="input-field"
                        rows={3}
                        placeholder="Payment terms and conditions"
                        value={invoiceData.terms}
                        onChange={(e) => setInvoiceData(prev => ({ ...prev, terms: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Invoice Preview
              </h2>
                <div className="flex items-center gap-2">
                  
                <button 
                  className="btn-primary"
                  onClick={downloadPDF}
                  disabled={isGeneratingPDF}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}
                </button>
                <button 
                  className="btn-secondary"
                  onClick={generateQRCode}
                  disabled={isGeneratingQR}
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  {isGeneratingQR ? 'Generating QR...' : 'QR Code'}
                </button>
                <button 
                  className="btn-secondary" 
                  onClick={() => {
                    generateShareLink()
                    setShowShareModal(true)
                  }}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                    Share
                </button>
                </div>
              </div>

              {/* Responsive layout: Side panel + Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-[320px,1fr] gap-6">
                {/* Side Customization Panel (desktop) */}
                <div className="hidden lg:block">
                  <div className="border border-gray-200 rounded-xl p-4 sticky top-24">
                    <div className="flex items-center gap-2 mb-3">
                      <Palette className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-semibold text-gray-900">Design Panel</span>
                </div>
                    <div className="space-y-6">
                      {/* Watermark toggle and controls at the end of the side panel */}
                      {/* Theme */}
                      <div>
                        <div className="flex items-center gap-2 mb-2 text-gray-700 text-sm font-medium">
                          <Palette className="w-4 h-4" /> Theme
                        </div>
                        <select className="input-field" value={designOptions.theme} onChange={(e) => applyTheme(e.target.value as DesignOptions['theme'])}>
                          <option value="modern">Modern</option>
                          <option value="classic">Classic</option>
                          <option value="minimal">Minimal</option>
                          <option value="creative">Creative</option>
                        </select>
              </div>

                      {/* Colors */}
                      <div>
                        <div className="flex items-center gap-2 mb-2 text-gray-700 text-sm font-medium">
                          <Palette className="w-4 h-4" /> Colors
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <label className="text-xs text-gray-600">Primary Color
                            <input type="color" className="w-full h-10 mt-1 rounded border border-gray-200" value={designOptions.primaryColor} onChange={(e) => setDesignOptions(prev => ({ ...prev, primaryColor: e.target.value }))} />
                          </label>
                          <label className="text-xs text-gray-600">Text Color
                            <input type="color" className="w-full h-10 mt-1 rounded border border-gray-200" value={designOptions.textColor} onChange={(e) => setDesignOptions(prev => ({ ...prev, textColor: e.target.value }))} />
                          </label>
                          <label className="text-xs text-gray-600">Background
                            <input type="color" className="w-full h-10 mt-1 rounded border border-gray-200" value={designOptions.backgroundColor} onChange={(e) => setDesignOptions(prev => ({ ...prev, backgroundColor: e.target.value }))} />
                          </label>
                          <label className="text-xs text-gray-600">Borders
                            <input type="color" className="w-full h-10 mt-1 rounded border border-gray-200" value={designOptions.borderColor} onChange={(e) => setDesignOptions(prev => ({ ...prev, borderColor: e.target.value }))} />
                          </label>
                        </div>
                      </div>

                      {/* Typography */}
                      <div>
                        <div className="flex items-center gap-2 mb-2 text-gray-700 text-sm font-medium">
                          <Type className="w-4 h-4" /> Typography
                        </div>
                        <label className="text-xs text-gray-600 block mb-2">Font Family
                          <select value={designOptions.fontFamily} onChange={(e) => setDesignOptions(prev => ({ ...prev, fontFamily: e.target.value }))} className="mt-1 input-field">
                            {fontOptions.map(f => (
                              <option key={f} value={f}>{f}</option>
                            ))}
                          </select>
                        </label>
                        <label className="text-xs text-gray-600 block mb-2">Base Font Size
                          <select className="mt-1 input-field" value={designOptions.baseFontSize} onChange={(e) => setDesignOptions(prev => ({ ...prev, baseFontSize: parseInt(e.target.value) }))}>
                            {sizeChoices.map(s => <option key={s} value={s}>{s}px</option>)}
                          </select>
                        </label>
                        <label className="text-xs text-gray-600 block">Line Height
                          <select className="mt-1 input-field" value={designOptions.lineHeight} onChange={(e) => setDesignOptions(prev => ({ ...prev, lineHeight: parseFloat(e.target.value) }))}>
                            {lineHeightChoices.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </label>
                      </div>

                      {/* Layout */}
                      <div>
                        <div className="flex items-center gap-2 mb-2 text-gray-700 text-sm font-medium">
                          <Layout className="w-4 h-4" /> Layout
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <label className="text-xs text-gray-600">Radius
                            <select className="mt-1 input-field" value={designOptions.borderRadius} onChange={(e) => setDesignOptions(prev => ({ ...prev, borderRadius: parseInt(e.target.value) }))}>
                              {radiusChoices.map(s => <option key={s} value={s}>{s}px</option>)}
                            </select>
                          </label>
                          <label className="text-xs text-gray-600">Spacing
                            <select className="mt-1 input-field" value={designOptions.spacing} onChange={(e) => setDesignOptions(prev => ({ ...prev, spacing: parseInt(e.target.value) }))}>
                              {spacingChoices.map(s => <option key={s} value={s}>{s}px</option>)}
                            </select>
                          </label>
                          <label className="text-xs text-gray-600 col-span-2">Header Alignment
                            <select value={designOptions.headerAlignment} onChange={(e) => setDesignOptions(prev => ({ ...prev, headerAlignment: e.target.value as DesignOptions['headerAlignment'] }))} className="mt-1 input-field">
                              <option value="left">Left</option>
                              <option value="center">Center</option>
                              <option value="right">Right</option>
                            </select>
                          </label>
                          <label className="text-xs text-gray-600 col-span-2">Logo Position
                            <select value={designOptions.logoPosition} onChange={(e) => setDesignOptions(prev => ({ ...prev, logoPosition: e.target.value as DesignOptions['logoPosition'] }))} className="mt-1 input-field">
                              <option value="left">Left</option>
                              <option value="center">Center</option>
                              <option value="right">Right</option>
                            </select>
                          </label>
                          <label className="text-xs text-gray-600 col-span-2">Logo Size
                            <select className="mt-1 input-field" value={designOptions.logoSize} onChange={(e) => setDesignOptions(prev => ({ ...prev, logoSize: e.target.value as DesignOptions['logoSize'] }))}>
                              <option value="sm">Small</option>
                              <option value="md">Medium</option>
                              <option value="lg">Large</option>
                            </select>
                          </label>
                          <label className="text-xs text-gray-600 col-span-2">Show Company Logo
                            <select className="mt-1 input-field" value={designOptions.showLogo ? 'on' : 'off'} onChange={(e) => setDesignOptions(prev => ({ ...prev, showLogo: e.target.value === 'on' }))}>
                              <option value="on">On</option>
                              <option value="off">Off</option>
                            </select>
                          </label>
                          <label className="text-xs text-gray-600 col-span-2">Section Dividers
                            <select className="mt-1 input-field" value={designOptions.showDividers ? 'on' : 'off'} onChange={(e) => setDesignOptions(prev => ({ ...prev, showDividers: e.target.value === 'on' }))}>
                              <option value="on">On</option>
                              <option value="off">Off</option>
                            </select>
                          </label>
                          <label className="text-xs text-gray-600 col-span-2">Accent Style
                            <select className="mt-1 input-field" value={designOptions.accentStyle} onChange={(e) => setDesignOptions(prev => ({ ...prev, accentStyle: e.target.value as DesignOptions['accentStyle'] }))}>
                              <option value="none">None</option>
                              <option value="top-line">Top Line</option>
                              <option value="top-bar">Top Bar</option>
                            </select>
                          </label>
                          <label className="text-xs text-gray-600">Paper Size
                            <select className="mt-1 input-field" value={designOptions.paperSize} onChange={(e) => setDesignOptions(prev => ({ ...prev, paperSize: e.target.value as DesignOptions['paperSize'] }))}>
                              <option value="A4">A4</option>
                              <option value="Letter">Letter</option>
                            </select>
                          </label>
                          <label className="text-xs text-gray-600">Table Style
                            <select className="mt-1 input-field" value={designOptions.tableStyle} onChange={(e) => setDesignOptions(prev => ({ ...prev, tableStyle: e.target.value as DesignOptions['tableStyle'] }))}>
                              <option value="minimal">Minimal</option>
                              <option value="striped">Striped</option>
                              <option value="borders">Borders</option>
                            </select>
                          </label>
                          <label className="text-xs text-gray-600">Currency Position
                            <select className="mt-1 input-field" value={designOptions.currencyPosition} onChange={(e) => setDesignOptions(prev => ({ ...prev, currencyPosition: e.target.value as DesignOptions['currencyPosition'] }))}>
                              <option value="before">Before</option>
                              <option value="after">After</option>
                            </select>
                          </label>
                          <label className="text-xs text-gray-600">Decimals
                            <select className="mt-1 input-field" value={designOptions.decimals} onChange={(e) => setDesignOptions(prev => ({ ...prev, decimals: (e.target.value === '0' ? 0 : 2) }))}>
                              <option value="2">2</option>
                              <option value="0">0</option>
                            </select>
                          </label>
                          <label className="text-xs text-gray-600 col-span-2">Date Format
                            <select className="mt-1 input-field" value={designOptions.dateFormat} onChange={(e) => setDesignOptions(prev => ({ ...prev, dateFormat: e.target.value as DesignOptions['dateFormat'] }))}>
                              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                              <option value="DD Mon YYYY">DD Mon YYYY</option>
                            </select>
                          </label>
                          {/* Include Watermark toggle inside Design Panel under Date Format */}
                          <label className="flex items-center gap-3 cursor-pointer col-span-2">
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                              checked={invoiceData.includeWatermark}
                              onChange={(e) => setInvoiceData(prev => ({ ...prev, includeWatermark: e.target.checked }))}
                            />
                            <span className="text-sm font-medium text-gray-700">Include Watermark</span>
                          </label>
                          <label className={`text-xs text-gray-600 col-span-2 ${invoiceData.includeWatermark ? '' : 'opacity-50 pointer-events-none'}`}>Watermark Text
                            <select className="mt-1 input-field" value={designOptions.watermarkText} onChange={(e) => setDesignOptions(prev => ({ ...prev, watermarkText: e.target.value }))}>
                              {['Invoice Meta', 'Paid', 'Draft', 'Confidential'].map(w => <option key={w} value={w}>{w}</option>)}
                            </select>
                          </label>
                          <label className={`text-xs text-gray-600 col-span-2 ${invoiceData.includeWatermark ? '' : 'opacity-50 pointer-events-none'}`}>Watermark Opacity
                            <select className="mt-1 input-field" value={designOptions.watermarkOpacity} onChange={(e) => setDesignOptions(prev => ({ ...prev, watermarkOpacity: (e.target.value === '0.3' ? 0.3 : e.target.value === '0.2' ? 0.2 : 0.1) }))}>
                              <option value="0.1">10%</option>
                              <option value="0.2">20%</option>
                              <option value="0.3">30%</option>
                            </select>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview Column */}
                <div>
                  <div className="w-full overflow-auto">
                    <div
                      id="invoice-preview"
                      className="relative"
                      style={{
                        margin: 20,
                        minHeight: designOptions.paperSize === 'A4' ? '297mm' : '279mm',
                        width: designOptions.paperSize === 'A4' ? '210mm' : '216mm',
                        backgroundColor: designOptions.backgroundColor,
                        color: designOptions.textColor,
                        fontFamily: `var(--invoice-font, ${resolveFontStack(designOptions.fontFamily)})`,
                        fontSize: designOptions.baseFontSize,
                        lineHeight: designOptions.lineHeight,
                        border: `1px solid ${designOptions.borderColor}`,
                        borderRadius: designOptions.borderRadius
                      }}
                    >
                      <div style={{ padding: designOptions.spacing }} className="bg-white rounded-lg">
                {/* Watermark Overlay */}
                {invoiceData.includeWatermark && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10" style={{ opacity: designOptions.watermarkOpacity }}>
                            <div className="text-6xl font-bold" style={{ color: designOptions.primaryColor }}>
                              {designOptions.watermarkText}
                    </div>
                  </div>
                )}

                        {/* Header */}
                        <div className="mb-8">
                          {designOptions.accentStyle !== 'none' && (
                            <div
                              className={designOptions.accentStyle === 'top-bar' ? 'h-3 mb-4 rounded' : 'h-px mb-4'}
                              style={{ backgroundColor: designOptions.primaryColor }}
                            />
                          )}
                          <div className={`flex items-center ${designOptions.headerAlignment === 'center' ? 'justify-center' : designOptions.headerAlignment === 'right' ? 'justify-end' : 'justify-start'} gap-4 mb-2`}>
                            {designOptions.showLogo && invoiceData.company.logo && (
                              <img
                                src={invoiceData.company.logo}
                                alt="Company Logo"
                                className="object-contain"
                                style={{
                                  width: designOptions.logoSize === 'sm' ? 40 : designOptions.logoSize === 'md' ? 64 : 96,
                                  height: designOptions.logoSize === 'sm' ? 40 : designOptions.logoSize === 'md' ? 64 : 96,
                                  order: designOptions.logoPosition === 'left' ? 0 : designOptions.logoPosition === 'center' ? 1 : 2
                                }}
                              />
                            )}
                            <div className="text-center">
                              <h1 className="font-bold" style={{ color: designOptions.primaryColor, fontSize: designOptions.baseFontSize + 8 }}>INVOICE</h1>
                              <p className="opacity-70">#{invoiceData.invoiceNumber}</p>
                              {invoiceData.invoiceType && <p className="text-xs opacity-70 mt-1">{invoiceData.invoiceType}</p>}
                            </div>
                  </div>
                </div>

                        {/* From / To */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                          <div style={{ paddingLeft: 8 }}>
                            <h3 className="font-semibold mb-3" style={{ color: designOptions.primaryColor }}>From:</h3>
                            <div className="text-sm opacity-90 space-y-1">
                              <p className="font-medium">{invoiceData.company.name || 'Your Company Name'}</p>
                              {invoiceData.company.taxId && <p>Tax ID: {invoiceData.company.taxId}</p>}
                              {invoiceData.company.email && <p style={{ color: designOptions.primaryColor }}>{invoiceData.company.email}</p>}
                              {invoiceData.company.phone && <p>{invoiceData.company.phone}</p>}
                              <p>{invoiceData.company.address || 'Company Address'}</p>
                              <p>{invoiceData.company.city}, {invoiceData.company.state} {invoiceData.company.zip}</p>
                              <p>{invoiceData.company.country}</p>
                            </div>
                  </div>
                          <div style={{ paddingRight: 8 }}>
                            <h3 className="font-semibold mb-3" style={{ color: designOptions.primaryColor }}>To:</h3>
                            <div className="text-sm opacity-90 space-y-1">
                              <p className="font-medium">{invoiceData.client.name || 'Client Name'}</p>
                              {invoiceData.client.taxId && <p>Tax ID: {invoiceData.client.taxId}</p>}
                              {invoiceData.client.email && <p style={{ color: designOptions.primaryColor }}>{invoiceData.client.email}</p>}
                              {invoiceData.client.phone && <p>{invoiceData.client.phone}</p>}
                              <p>{invoiceData.client.address || 'Client Address'}</p>
                              <p>{invoiceData.client.city}, {invoiceData.client.state} {invoiceData.client.zip}</p>
                              <p>{invoiceData.client.country}</p>
                            </div>
                  </div>
                </div>

                        {/* Dates */}
                        <div className="mb-8" style={{ paddingLeft: 8, paddingRight: 8 }}>
                          <div className="flex justify-between text-sm opacity-80 mb-2">
                            <span>Issue Date: {formatDateSafe(invoiceData.issueDate)}</span>
                            <span>Due Date: {formatDateSafe(invoiceData.dueDate)}</span>
                  </div>
                </div>

                        {/* Divider */}
                        {designOptions.showDividers && <div style={{ borderTop: `1px solid ${designOptions.borderColor}` }} className="my-4" />}

                {/* Items Table */}
                        <div className="mb-8" style={{ paddingLeft: 8, paddingRight: 8 }}>
                          <table className="w-full text-sm" style={designOptions.tableStyle === 'borders' ? { border: `1px solid ${designOptions.borderColor}`, borderCollapse: 'collapse' as const } : undefined}>
                    <thead>
                              <tr style={{ borderBottom: `1px solid ${designOptions.borderColor}` }}>
                        <th className="text-left py-3 px-2">Description</th>
                        <th className="text-right py-3 px-2">Qty</th>
                        <th className="text-right py-3 px-2">Rate</th>
                        <th className="text-right py-3 px-2">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceData.items.map((item, index) => (
                                <tr
                                  key={item.id}
                                  style={{
                                    borderBottom: designOptions.tableStyle !== 'minimal' ? `1px solid ${designOptions.borderColor}` : 'none',
                                    backgroundColor: designOptions.tableStyle === 'striped' && index % 2 === 1 ? '#F9FAFB' : 'transparent'
                                  }}
                                >
                                  <td className="py-3 px-2" style={designOptions.tableStyle === 'borders' ? { borderRight: `1px solid ${designOptions.borderColor}` } : undefined}>{item.description || `Item ${index + 1}`}</td>
                                  <td className="text-right py-3 px-2" style={designOptions.tableStyle === 'borders' ? { borderRight: `1px solid ${designOptions.borderColor}` } : undefined}>{item.quantity}</td>
                                  <td className="text-right py-3 px-2" style={designOptions.tableStyle === 'borders' ? { borderRight: `1px solid ${designOptions.borderColor}` } : undefined}>{formatAmount(item.rate)}</td>
                                  <td className="text-right py-3 px-2">{formatAmount(item.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                        <div className="text-right mb-8" style={{ paddingLeft: 8, paddingRight: 8 }}>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                              <span>{formatAmount(invoiceData.subtotal)}</span>
                    </div>
                    {invoiceData.taxRate > 0 && (
                              <div className="flex justify-between" style={{ color: '#ef4444' }}>
                        <span>Tax ({invoiceData.taxRate}%):</span>
                                <span>+{formatAmount(invoiceData.taxAmount)}</span>
                      </div>
                    )}
                    {invoiceData.discountRate > 0 && (
                              <div className="flex justify-between" style={{ color: '#10b981' }}>
                        <span>Discount ({invoiceData.discountRate}%):</span>
                                <span>-{formatAmount(invoiceData.discountAmount)}</span>
                      </div>
                    )}
                            <div className="flex justify-between text-lg font-bold pt-3" style={{ borderTop: `1px solid ${designOptions.borderColor}` }}>
                      <span>Total:</span>
                              <span style={{ color: designOptions.primaryColor }}>{formatAmount(invoiceData.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Notes and Terms */}
                {(invoiceData.notes || invoiceData.terms) && (
                          <div className="mt-8 pt-6" style={{ borderTop: `1px solid ${designOptions.borderColor}`, paddingLeft: 8, paddingRight: 8 }}>
                    {invoiceData.notes && (
                      <div className="mb-4">
                                <h4 className="font-semibold mb-2" style={{ color: designOptions.primaryColor }}>Notes:</h4>
                                <p className="text-sm opacity-90">{invoiceData.notes}</p>
                      </div>
                    )}
                    {invoiceData.terms && (
                      <div>
                                <h4 className="font-semibold mb-2" style={{ color: designOptions.primaryColor }}>Terms & Conditions:</h4>
                                <p className="text-sm opacity-90">{invoiceData.terms}</p>
                      </div>
                    )}
                  </div>
                )}

                        {/* Footer intentionally left blank for clean PDF */}
                      </div>
                    </div>
                  </div>

                  {/* Mobile: Floating customize button */}
                  <button
                    className="fixed bottom-6 right-6 lg:hidden btn-primary rounded-full shadow-lg px-4 py-3 flex items-center gap-2"
                    onClick={() => setIsDesignPanelOpen(true)}
                  >
                    <Palette className="w-4 h-4" />
                    Customize
                  </button>
                </div>
              </div>

              {/* Back row */}
              <div className="flex justify-between items-center mt-8 pt-6" style={{ borderTop: '1px solid #e5e7eb' }}>
                <button 
                  className="btn-secondary text-lg px-6 py-3 flex items-center gap-2"
                  onClick={() => setActiveTab('create')}
                >
                  <FileText className="w-5 h-5" />
                  Back to Create
                </button>
                <div className="text-sm text-gray-500">
                  Ready to generate your invoice
                </div>
              </div>

              {/* Hidden PDF Preview Element - No watermark or footer */}
              <div id="invoice-pdf-preview" className="sr-only" style={{ margin: '20px', minHeight: '297mm', width: '210mm' }}>
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    {invoiceData.company.logo && (
                      <img src={invoiceData.company.logo} alt="Company Logo" className="w-16 h-16 object-contain" />
                    )}
                    <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">INVOICE</h1>
                  <p className="text-gray-600">#{invoiceData.invoiceNumber}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="pl-4">
                    <h3 className="font-semibold text-gray-900 mb-3">From:</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="font-medium">{invoiceData.company.name || 'Your Company Name'}</p>
                      {invoiceData.company.email && <p className="text-blue-600">{invoiceData.company.email}</p>}
                      <p>{invoiceData.company.address || 'Company Address'}</p>
                      <p>{invoiceData.company.city}, {invoiceData.company.state} {invoiceData.company.zip}</p>
                      <p>{invoiceData.company.country}</p>
                    </div>
                  </div>
                  <div className="pr-4">
                    <h3 className="font-semibold text-gray-900 mb-3">To:</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="font-medium">{invoiceData.client.name || 'Client Name'}</p>
                      {invoiceData.client.email && <p className="text-blue-600">{invoiceData.client.email}</p>}
                      <p>{invoiceData.client.address || 'Client Address'}</p>
                      <p>{invoiceData.client.city}, {invoiceData.client.state} {invoiceData.client.zip}</p>
                      <p>{invoiceData.client.country}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-8 px-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Issue Date: {invoiceData.issueDate}</span>
                    <span>Due Date: {invoiceData.dueDate}</span>
                  </div>
                </div>

                {/* Items Table */}
                <div className="mb-8 px-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2">Description</th>
                        <th className="text-right py-3 px-2">Qty</th>
                        <th className="text-right py-3 px-2">Rate</th>
                        <th className="text-right py-3 px-2">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceData.items.map((item, index) => (
                        <tr key={item.id} className="border-b border-gray-100">
                          <td className="py-3 px-2">{item.description || `Item ${index + 1}`}</td>
                          <td className="text-right py-3 px-2">{item.quantity}</td>
                          <td className="text-right py-3 px-2">{getCurrencySymbol(invoiceData.currency)} {item.rate.toFixed(2)}</td>
                          <td className="text-right py-3 px-2">{getCurrencySymbol(invoiceData.currency)} {item.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="text-right px-4 mb-8">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{getCurrencySymbol(invoiceData.currency)} {invoiceData.subtotal.toFixed(2)}</span>
                    </div>
                    {invoiceData.taxRate > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Tax ({invoiceData.taxRate}%):</span>
                        <span>+{getCurrencySymbol(invoiceData.currency)} {invoiceData.taxAmount.toFixed(2)}</span>
                      </div>
                    )}
                    {invoiceData.discountRate > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({invoiceData.discountRate}%):</span>
                        <span>-{getCurrencySymbol(invoiceData.currency)} {invoiceData.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold border-t pt-3">
                      <span>Total:</span>
                      <span>{getCurrencySymbol(invoiceData.currency)} {invoiceData.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Notes and Terms */}
                {(invoiceData.notes || invoiceData.terms) && (
                  <div className="mt-8 pt-6 border-t border-gray-200 px-4">
                    {invoiceData.notes && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Notes:</h4>
                        <p className="text-sm text-gray-600">{invoiceData.notes}</p>
                      </div>
                    )}
                    {invoiceData.terms && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Terms & Conditions:</h4>
                        <p className="text-sm text-gray-600">{invoiceData.terms}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Drawer for Design Panel */}
              {isDesignPanelOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                  <div className="absolute inset-0 bg-black/40" onClick={() => setIsDesignPanelOpen(false)}></div>
                  <div className="absolute inset-y-0 right-0 w-[88%] max-w-sm bg-white shadow-xl p-4 overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Palette className="w-5 h-5" />
                        <span className="font-semibold">Customize</span>
                      </div>
                      <button onClick={() => setIsDesignPanelOpen(false)} className="text-gray-500 hover:text-gray-700">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-6">
                      {/* Theme */}
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">Theme</div>
                        <select className="input-field" value={designOptions.theme} onChange={(e) => applyTheme(e.target.value as DesignOptions['theme'])}>
                          <option value="modern">Modern</option>
                          <option value="classic">Classic</option>
                          <option value="minimal">Minimal</option>
                          <option value="creative">Creative</option>
                        </select>
                      </div>

                      {/* Colors */}
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">Colors</div>
                        <label className="text-xs text-gray-600 block mb-2">Primary Color
                          <input type="color" className="w-full h-10 mt-1 rounded border border-gray-200" value={designOptions.primaryColor} onChange={(e) => setDesignOptions(prev => ({ ...prev, primaryColor: e.target.value }))} />
                        </label>
                        <label className="text-xs text-gray-600 block mb-2">Text Color
                          <input type="color" className="w-full h-10 mt-1 rounded border border-gray-200" value={designOptions.textColor} onChange={(e) => setDesignOptions(prev => ({ ...prev, textColor: e.target.value }))} />
                        </label>
                        <label className="text-xs text-gray-600 block mb-2">Background
                          <input type="color" className="w-full h-10 mt-1 rounded border border-gray-200" value={designOptions.backgroundColor} onChange={(e) => setDesignOptions(prev => ({ ...prev, backgroundColor: e.target.value }))} />
                        </label>
                        <label className="text-xs text-gray-600 block mb-2">Borders
                          <input type="color" className="w-full h-10 mt-1 rounded border border-gray-200" value={designOptions.borderColor} onChange={(e) => setDesignOptions(prev => ({ ...prev, borderColor: e.target.value }))} />
                        </label>
                      </div>

                      {/* Typography */}
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">Typography</div>
                        <label className="text-xs text-gray-600 block mb-2">Font Family
                          <select value={designOptions.fontFamily} onChange={(e) => setDesignOptions(prev => ({ ...prev, fontFamily: e.target.value }))} className="mt-1 input-field">
                            {fontOptions.map(f => (
                              <option key={f} value={f}>{f}</option>
                            ))}
                          </select>
                        </label>
                        <label className="text-xs text-gray-600 block mb-2">Base Font Size
                          <select className="mt-1 input-field" value={designOptions.baseFontSize} onChange={(e) => setDesignOptions(prev => ({ ...prev, baseFontSize: parseInt(e.target.value) }))}>
                            {sizeChoices.map(s => <option key={s} value={s}>{s}px</option>)}
                          </select>
                        </label>
                        <label className="text-xs text-gray-600 block">Line Height
                          <select className="mt-1 input-field" value={designOptions.lineHeight} onChange={(e) => setDesignOptions(prev => ({ ...prev, lineHeight: parseFloat(e.target.value) }))}>
                            {lineHeightChoices.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </label>
                      </div>

                      {/* Layout & Behavior */}
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">Layout</div>
                        <label className="text-xs text-gray-600 block mb-2">Radius
                          <select className="mt-1 input-field" value={designOptions.borderRadius} onChange={(e) => setDesignOptions(prev => ({ ...prev, borderRadius: parseInt(e.target.value) }))}>
                            {radiusChoices.map(s => <option key={s} value={s}>{s}px</option>)}
                          </select>
                        </label>
                        <label className="text-xs text-gray-600 block mb-2">Spacing
                          <select className="mt-1 input-field" value={designOptions.spacing} onChange={(e) => setDesignOptions(prev => ({ ...prev, spacing: parseInt(e.target.value) }))}>
                            {spacingChoices.map(s => <option key={s} value={s}>{s}px</option>)}
                          </select>
                        </label>
                        <label className="text-xs text-gray-600 block mb-2">Header Alignment
                          <select value={designOptions.headerAlignment} onChange={(e) => setDesignOptions(prev => ({ ...prev, headerAlignment: e.target.value as DesignOptions['headerAlignment'] }))} className="mt-1 input-field">
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                            <option value="right">Right</option>
                          </select>
                        </label>
                        <label className="text-xs text-gray-600 block mb-2">Logo Position
                          <select value={designOptions.logoPosition} onChange={(e) => setDesignOptions(prev => ({ ...prev, logoPosition: e.target.value as DesignOptions['logoPosition'] }))} className="mt-1 input-field">
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                            <option value="right">Right</option>
                          </select>
                        </label>
                        <label className="text-xs text-gray-600 block mb-2">Logo Size
                          <select className="mt-1 input-field" value={designOptions.logoSize} onChange={(e) => setDesignOptions(prev => ({ ...prev, logoSize: e.target.value as DesignOptions['logoSize'] }))}>
                            <option value="sm">Small</option>
                            <option value="md">Medium</option>
                            <option value="lg">Large</option>
                          </select>
                        </label>
                        <label className="text-xs text-gray-600 block mb-2">Section Dividers
                          <select className="mt-1 input-field" value={designOptions.showDividers ? 'on' : 'off'} onChange={(e) => setDesignOptions(prev => ({ ...prev, showDividers: e.target.value === 'on' }))}>
                            <option value="on">On</option>
                            <option value="off">Off</option>
                          </select>
                        </label>
                        <label className="text-xs text-gray-600 block mb-2">Accent Style
                          <select className="mt-1 input-field" value={designOptions.accentStyle} onChange={(e) => setDesignOptions(prev => ({ ...prev, accentStyle: e.target.value as DesignOptions['accentStyle'] }))}>
                            <option value="none">None</option>
                            <option value="top-line">Top Line</option>
                            <option value="top-bar">Top Bar</option>
                          </select>
                        </label>
                        <label className="text-xs text-gray-600 block mb-2">Paper Size
                          <select className="mt-1 input-field" value={designOptions.paperSize} onChange={(e) => setDesignOptions(prev => ({ ...prev, paperSize: e.target.value as DesignOptions['paperSize'] }))}>
                            <option value="A4">A4</option>
                            <option value="Letter">Letter</option>
                          </select>
                        </label>
                        <label className="text-xs text-gray-600 block mb-2">Table Style
                          <select className="mt-1 input-field" value={designOptions.tableStyle} onChange={(e) => setDesignOptions(prev => ({ ...prev, tableStyle: e.target.value as DesignOptions['tableStyle'] }))}>
                            <option value="minimal">Minimal</option>
                            <option value="striped">Striped</option>
                            <option value="borders">Borders</option>
                          </select>
                        </label>
                        <label className="text-xs text-gray-600 block mb-2">Currency Position
                          <select className="mt-1 input-field" value={designOptions.currencyPosition} onChange={(e) => setDesignOptions(prev => ({ ...prev, currencyPosition: e.target.value as DesignOptions['currencyPosition'] }))}>
                            <option value="before">Before</option>
                            <option value="after">After</option>
                          </select>
                        </label>
                        <label className="text-xs text-gray-600 block mb-2">Decimals
                          <select className="mt-1 input-field" value={designOptions.decimals} onChange={(e) => setDesignOptions(prev => ({ ...prev, decimals: parseInt(e.target.value) as 0 | 2 }))}>
                            <option value={2}>2</option>
                            <option value={0}>0</option>
                          </select>
                        </label>
                        <label className="text-xs text-gray-600 block mb-2">Date Format
                          <select className="mt-1 input-field" value={designOptions.dateFormat} onChange={(e) => setDesignOptions(prev => ({ ...prev, dateFormat: e.target.value as DesignOptions['dateFormat'] }))}>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="DD Mon YYYY">DD Mon YYYY</option>
                          </select>
                        </label>
                        <label className="text-xs text-gray-600 block mb-2">Watermark Text
                          <select className="mt-1 input-field" value={designOptions.watermarkText} onChange={(e) => setDesignOptions(prev => ({ ...prev, watermarkText: e.target.value }))}>
                            {['Invoice Meta', 'Paid', 'Draft', 'Confidential'].map(w => <option key={w} value={w}>{w}</option>)}
                          </select>
                        </label>
                        <label className="text-xs text-gray-600 block mb-2">Watermark Opacity
                          <select className="mt-1 input-field" value={designOptions.watermarkOpacity} onChange={(e) => setDesignOptions(prev => ({ ...prev, watermarkOpacity: parseFloat(e.target.value) as 0.1 | 0.2 | 0.3 }))}>
                            <option value={0.1}>10%</option>
                            <option value={0.2}>20%</option>
                            <option value={0.3}>30%</option>
                          </select>
                        </label>
                        <label className="text-xs text-gray-600 block">Show Company Logo
                          <select className="mt-1 input-field" value={designOptions.showLogo ? 'on' : 'off'} onChange={(e) => setDesignOptions(prev => ({ ...prev, showLogo: e.target.value === 'on' }))}>
                            <option value="on">On</option>
                            <option value="off">Off</option>
                          </select>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Share Invoice</h3>
            <div className="space-y-3">
              <button 
                className="w-full btn-secondary flex items-center justify-center gap-2"
                onClick={shareViaEmail}
              >
                <Mail className="w-4 h-4" />
                Send via Email
              </button>
              <button 
                className="btn-secondary flex items-center justify-center gap-2"
                onClick={shareViaWhatsApp}
              >
                <Phone className="w-4 h-4" />
                Share via WhatsApp
              </button>
              <button 
                className="btn-secondary flex items-center justify-center gap-2"
                onClick={() => shareViaSocial('twitter')}
              >
                <Twitter className="w-4 h-4" />
                Share on Twitter
              </button>
              <button 
                className="btn-secondary flex items-center justify-center gap-2"
                onClick={() => shareViaSocial('facebook')}
              >
                <Facebook className="w-4 h-4" />
                Share on Facebook
              </button>
              <button 
                className="btn-secondary flex items-center justify-center gap-2"
                onClick={() => shareViaSocial('linkedin')}
              >
                <Linkedin className="w-4 h-4" />
                Share on LinkedIn
              </button>
              <div className="border-t pt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Share Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="flex-1 input-field text-sm"
                    placeholder="Share link will appear here"
                  />
                  <button
                    onClick={() => copyToClipboard(shareLink)}
                    className="btn-secondary px-3 py-2"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full mt-4 px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">QR Code</h3>
            <div className="text-center mb-4">
              {qrCodeDataUrl && (
                <img src={qrCodeDataUrl} alt="Invoice QR Code" className="mx-auto mb-4" />
              )}
              <p className="text-sm text-gray-600 mb-4">
                Scan this QR code to view the invoice details
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (qrCodeDataUrl) {
                    const link = document.createElement('a')
                    link.download = `invoice-qr-${invoiceData.invoiceNumber}.png`
                    link.href = qrCodeDataUrl
                    link.click()
                  }
                }}
                className="btn-primary flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Download QR
              </button>
              <button
                onClick={() => copyToClipboard(qrCodeDataUrl)}
                className="btn-secondary flex-1"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Image
              </button>
            </div>
            <button
              onClick={() => setShowQRModal(false)}
              className="w-full mt-4 px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
      
      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  )
} 