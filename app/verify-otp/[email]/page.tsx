'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Input } from '@/app/ui/input'
import { Button } from '@/app/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/ui/card'
import { ReloadIcon } from '@radix-ui/react-icons'
import Cookies from 'js-cookie';

export default function VerifyOtpPage({ params }: { params: { email: string } }) {
  const router = useRouter()
  const [otp, setOtp] = useState('')
  const [message, setMessage] = useState({ text: '', type: '' })
  const [loading, setLoading] = useState(false)
  const [resendDisabled, setResendDisabled] = useState(true)
  const [countdown, setCountdown] = useState(120)
  const [isClient, setIsClient] = useState(false)

  const email = decodeURIComponent(params.email)
  
  // Helper function to get email-specific storage key
  const getCountdownStorageKey = () => `otp_countdown_${email}`;

  useEffect(() => {
    setIsClient(true);

    if (!email) {
      router.replace('/register')
      return
    }

    // Clear any previous countdown for other users
    if (typeof window !== 'undefined') {
      // Clear all countdown keys that don't match current email
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('otp_countdown_') && key !== getCountdownStorageKey()) {
          sessionStorage.removeItem(key)
        }
      })
    }

    // Initialize countdown for current user
    const storedCountdown = typeof window !== 'undefined' 
      ? sessionStorage.getItem(getCountdownStorageKey())
      : null;
      
    const parsedCountdown = storedCountdown ? parseInt(storedCountdown, 10) : 0;
    const initialCountdown = parsedCountdown > 0 ? parsedCountdown : 120;
    setCountdown(initialCountdown);
    setResendDisabled(initialCountdown > 0);

    const timer = setInterval(() => {
      setCountdown(prev => {
        const newCountdown = prev - 1;
        if (newCountdown <= 0) {
          clearInterval(timer);
          setResendDisabled(false);
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem(getCountdownStorageKey());
          }
          return 0;
        }
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(getCountdownStorageKey(), newCountdown.toString());
        }
        return newCountdown;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ text: '', type: '' })

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })

      const data = await res.json()
      if (res.ok) {
        setMessage({ text: 'Account verified successfully! Redirecting...', type: 'success' })
        Cookies.remove('just-registered');
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem(getCountdownStorageKey());
        }
        setTimeout(() => router.push('/sign-in'), 2000)
      } else {
        setMessage({ text: data.message || 'Verification failed.', type: 'error' })
      }
    } catch {
      setMessage({ text: 'Something went wrong.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setLoading(true)
    setMessage({ text: '', type: '' })
    setResendDisabled(true)
    setCountdown(120)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(getCountdownStorageKey(), '120');
    }

    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()
      if (res.ok) {
        setMessage({ text: 'New OTP sent!', type: 'success' })
      } else {
        setMessage({ text: data.message || 'Failed to resend OTP.', type: 'error' })
        setResendDisabled(false)
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem(getCountdownStorageKey());
        }
      }
    } catch {
      setMessage({ text: 'Something went wrong.', type: 'error' })
      setResendDisabled(false)
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(getCountdownStorageKey());
      }
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl overflow-hidden border-0">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-1"></div>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-gray-800">
            Verify Your Account
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            We've sent a 6-digit code to your registered email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2">
              <Input
                type="text"
                name="otp"
                placeholder="Enter verification code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="py-2 h-12 text-center text-lg font-medium tracking-wider border-gray-300 focus-visible:ring-indigo-500"
                maxLength={6}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 focus-visible:ring-indigo-500"
              disabled={loading}
            >
              {loading ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Account'
              )}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-gray-600">Didn't receive code?</span>{' '}
            <button
              onClick={handleResendOtp}
              disabled={resendDisabled || loading}
              className={`font-medium ${resendDisabled ? 'text-gray-400' : 'text-indigo-600 hover:text-indigo-800'}`}
            >
              {isClient ? (
                resendDisabled ? `Resend in ${formatTime(countdown)}` : 'Resend OTP'
              ) : (
                'Resend OTP'
              )}
            </button>
          </div>

          {message.text && (
            <div
              className={`p-3 rounded-md text-center text-sm ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800'
                  : 'bg-red-50 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}