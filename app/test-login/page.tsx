'use client'

import { useState } from 'react'
import { Button } from '@/app/ui/button'
import { Input } from '@/app/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/ui/card'
import { Label } from '@/app/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/ui/select'

export default function TestLoginPage() {
  const [testResults, setTestResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testRegistration = async () => {
    setIsLoading(true)
    addResult('Testing registration...')
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          role: 'HOSPITAL',
        }),
      })

      const data = await response.json()
      
      if (response.ok) {
        addResult(`✅ Registration successful: ${data.message}`)
      } else {
        addResult(`❌ Registration failed: ${data.message}`)
      }
    } catch (error) {
      addResult(`❌ Registration error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testLogin = async () => {
    setIsLoading(true)
    addResult('Testing login...')
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
          rememberMe: false,
        }),
      })

      const data = await response.json()
      
      if (response.ok) {
        addResult(`✅ Login successful: ${data.user.name} (${data.user.role})`)
      } else {
        addResult(`❌ Login failed: ${data.message}`)
      }
    } catch (error) {
      addResult(`❌ Login error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testExistingUserLogin = async () => {
    setIsLoading(true)
    addResult('Testing existing user login...')
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@drugchain.com',
          password: 'password',
          rememberMe: false,
        }),
      })

      const data = await response.json()
      
      if (response.ok) {
        addResult(`✅ Existing user login successful: ${data.user.name} (${data.user.role})`)
      } else {
        addResult(`❌ Existing user login failed: ${data.message}`)
      }
    } catch (error) {
      addResult(`❌ Existing user login error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const clearResults = () => {
    setTestResults([])
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Authentication Test</h1>
          <p className="text-muted-foreground">
            Test the registration and login functionality
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Test Registration</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={testRegistration} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Testing...' : 'Test Registration'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Login (New User)</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={testLogin} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Testing...' : 'Test Login'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Login (Existing User)</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={testExistingUserLogin} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Testing...' : 'Test Existing Login'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Test Results</CardTitle>
              <Button variant="outline" onClick={clearResults}>
                Clear Results
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {testResults.length === 0 ? (
                <p className="text-muted-foreground">No test results yet. Run a test to see results.</p>
              ) : (
                testResults.map((result, index) => (
                  <div key={index} className="text-sm font-mono bg-gray-100 p-2 rounded">
                    {result}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 