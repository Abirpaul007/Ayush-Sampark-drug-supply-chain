import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Mock user database - replace with actual database
const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@drugchain.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'ADMIN',
  },
  {
    id: '2',
    name: 'Hospital Staff',
    email: 'hospital@drugchain.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'HOSPITAL',
  },
  {
    id: '3',
    name: 'Pharmacy Staff',
    email: 'pharmacy@drugchain.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'PHARMACY',
  },
  {
    id: '4',
    name: 'Vendor Staff',
    email: 'vendor@drugchain.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'VENDOR',
  },
]

// Mock reset tokens storage - replace with actual database
const resetTokens = new Map<string, { userId: string; expiresAt: Date }>()

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      )
    }

    const user = mockUsers.find(u => u.email === email)

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        message: 'If an account with that email exists, a password reset link has been sent.',
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Store reset token
    resetTokens.set(resetToken, {
      userId: user.id,
      expiresAt,
    })

    // In a real application, you would send an email here
    // For now, we'll just log the reset link
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`
    console.log('Password reset link:', resetLink)

    return NextResponse.json({
      message: 'If an account with that email exists, a password reset link has been sent.',
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 