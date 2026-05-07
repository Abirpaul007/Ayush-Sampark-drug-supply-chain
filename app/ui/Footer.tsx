import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                
                <h2 className="text-3xl font-light text-gray-900 mb-4">
                  <span className="font-black">Ayush Samparkh</span>
                  <br />
                </h2>
                
                <p className="text-gray-600 leading-relaxed max-w-md">
                  Ayush Samparkh leverages blockchain technology to create a transparent, 
                  secure, and efficient pharmaceutical supply chain management system 
                  for healthcare providers across India.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <FooterSocial icon="twitter" href="#" />
                <FooterSocial icon="linkedin" href="#" />
                <FooterSocial icon="github" href="#" />
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Links</h3>
              <div className="space-y-4">
                <FooterLink href="/" label="Homepage" />
                <FooterLink href="/about" label="About Platform" />
                <FooterLink href="/features" label="Key Features" />
                <FooterLink href="/contact" label="Contact Support" />
              </div>
            </div>
            
            {/* Resources */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6">Resources</h3>
              <div className="space-y-4">
                <FooterLink href="#" label="Documentation" />
                <FooterLink href="#" label="API Reference" />
                <FooterLink href="#" label="Privacy Policy" />
                <FooterLink href="#" label="Terms of Service" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-white">
        <div className="container mx-auto px-6 py-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              © {new Date().getFullYear()} Ayush Samparkh Platform. All rights reserved.
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="#" className="hover:text-gray-700 transition-colors">
                Status
              </Link>
              <Link href="#" className="hover:text-gray-700 transition-colors">
                Support
              </Link>
              <Link href="#" className="hover:text-gray-700 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
    >
      {label}
    </Link>
  );
}

function FooterSocial({ icon, href }: { icon: 'twitter' | 'linkedin' | 'github'; href: string }) {
  const icons: Record<string, JSX.Element> = {
    twitter: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.46 5.92c-.8.36-1.67.6-2.58.71a4.48 4.48 0 0 0 1.97-2.48 8.94 8.94 0 0 1-2.83 1.08A4.48 4.48 0 0 0 11.1 9.7c0 .35.04.7.1 1.03C7.72 10.6 4.8 8.97 2.88 6.6c-.38.65-.6 1.4-.6 2.2 0 1.52.77 2.86 1.95 3.65-.72-.02-1.4-.22-1.99-.55v.06c0 2.13 1.52 3.9 3.54 4.3-.37.1-.76.16-1.16.16-.28 0-.55-.03-.82-.08.56 1.74 2.18 3 4.1 3.03A8.98 8.98 0 0 1 2 20.13a12.7 12.7 0 0 0 6.88 2.02c8.26 0 12.78-6.84 12.78-12.77 0-.2 0-.41-.02-.61.88-.64 1.65-1.44 2.26-2.35z" />
      </svg>
    ),
    linkedin: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.88v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z" />
      </svg>
    ),
    github: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.66-.22.66-.48 0-.24-.01-.87-.01-1.7-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.1-1.46-1.1-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85.004 1.71.11 2.51.32 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .27.16.58.67.48A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10z" />
      </svg>
    ),
  };
  
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-12 h-12 bg-white border border-gray-200 rounded-2xl flex items-center justify-center text-gray-600 hover:text-gray-900 hover:border-gray-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      {icons[icon]}
    </Link>
  );
} 