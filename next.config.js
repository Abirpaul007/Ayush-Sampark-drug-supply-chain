/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['cloudinary', 'nodemailer', 'pdfkit'],
  },
}

module.exports = nextConfig