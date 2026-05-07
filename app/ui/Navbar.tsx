'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Features', href: '/features' },
  { name: 'Contact Us', href: '/contact' },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm' 
          : 'bg-white border-b border-gray-100'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <img src="/logo.png" alt="Logo" className="h-40 w-40 object-contain" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  pathname === item.href
                    ? 'text-gray-900 bg-gray-100'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              href="/sign-in"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 rounded-full hover:bg-gray-50"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-gray-900 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Register
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-full p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="bg-white border-t border-gray-200 shadow-lg">
            <div className="px-6 py-6 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 ${
                    pathname === item.href
                      ? 'text-gray-900 bg-gray-100'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link
                  href="/sign-in"
                  className="block px-4 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block bg-gray-900 text-white px-4 py-3 rounded-xl text-base font-medium hover:bg-gray-800 transition-all duration-200 shadow-sm text-center"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
} 