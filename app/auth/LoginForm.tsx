'use client'

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { login } from '@/lib/store/slices/authSlice'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // TODO: Implement actual login logic
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      
      if (!response.ok) throw new Error('Login failed')
      
      const data = await response.json()
      dispatch(login(data))
      router.push('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center">Login</h1>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
      >
        Login
      </button>
    </form>
  )
} 