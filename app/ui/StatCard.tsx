'use client'

import { ElementType } from 'react'

interface StatCardProps {
  name: string
  value: number | string
  icon: ElementType
  color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'orange'
}

const colorClasses = {
  blue: 'bg-blue-500/10 text-blue-500',
  green: 'bg-green-500/10 text-green-500',
  red: 'bg-red-500/10 text-red-500',
  yellow: 'bg-yellow-500/10 text-yellow-500',
  purple: 'bg-purple-500/10 text-purple-500',
  orange: 'bg-orange-500/10 text-orange-500',
}

export function StatCard({ name, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{name}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>
        <div className={`rounded-full p-3 ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
} 