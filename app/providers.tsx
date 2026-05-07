'use client'

import { Provider } from 'react-redux'
import { store } from '@/lib/store'
import { ThemeProvider } from '@/app/providers/ThemeProvider'
import { SessionProvider } from 'next-auth/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Provider store={store}>
        <ThemeProvider defaultTheme="light">
          {children}
        </ThemeProvider>
      </Provider>
    </SessionProvider>
  )
}
