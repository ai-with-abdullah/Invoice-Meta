/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  experimental: {
    serverComponentsExternalPackages: ['jspdf', 'html2canvas'],
  },
}

module.exports = nextConfig 