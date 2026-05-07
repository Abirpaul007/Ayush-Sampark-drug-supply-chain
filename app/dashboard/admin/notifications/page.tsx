 'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/app/ui/card'
import { Badge } from '@/app/ui/badge'
import { Button } from '@/app/ui/button'
import { Bell, Check, X, AlertTriangle, Info, Mail } from 'lucide-react'

const mockNotifications = [
  {
    id: '1',
    type: 'alert',
    title: 'Low Stock Alert',
    message: 'Paracetamol 500mg is running low in City General Hospital',
    timestamp: '2024-03-15T10:30:00Z',
    read: false,
    priority: 'high',
  },
  {
    id: '2',
    type: 'info',
    title: 'New Order Received',
    message: 'Order #ORD001 has been placed by St. Mary Medical Center',
    timestamp: '2024-03-15T09:15:00Z',
    read: false,
    priority: 'medium',
  },
  {
    id: '3',
    type: 'success',
    title: 'Delivery Confirmed',
    message: 'Shipment #SHP002 has been delivered successfully',
    timestamp: '2024-03-15T08:45:00Z',
    read: true,
    priority: 'low',
  },
  {
    id: '4',
    type: 'warning',
    title: 'Expiry Warning',
    message: 'Amoxicillin 250mg will expire in 30 days',
    timestamp: '2024-03-15T08:00:00Z',
    read: false,
    priority: 'high',
  },
  {
    id: '5',
    type: 'info',
    title: 'New User Registration',
    message: 'New pharmacy user registered: pharmacy@newclinic.com',
    timestamp: '2024-03-14T16:30:00Z',
    read: true,
    priority: 'medium',
  },
]

export default function NotificationsPage() {
  const getIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            Manage and view system notifications
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
          <Button variant="outline">
            <X className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockNotifications.length}</div>
            <p className="text-xs text-muted-foreground">
              All notifications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {mockNotifications.filter(n => !n.read).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {mockNotifications.filter(n => n.priority === 'high').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Urgent actions needed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockNotifications.filter(n => 
                new Date(n.timestamp).toDateString() === new Date().toDateString()
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">
              New today
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start space-x-4 p-4 rounded-lg border ${
                  notification.read ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <div className="flex-shrink-0 mt-1">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-sm font-medium ${
                      notification.read ? 'text-gray-600' : 'text-gray-900'
                    }`}>
                      {notification.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(notification.priority)}>
                        {notification.priority}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(notification.timestamp)}
                      </span>
                    </div>
                  </div>
                  <p className={`text-sm mt-1 ${
                    notification.read ? 'text-gray-500' : 'text-gray-700'
                  }`}>
                    {notification.message}
                  </p>
                </div>
                <div className="flex-shrink-0 flex space-x-2">
                  {!notification.read && (
                    <Button variant="outline" size="sm">
                      <Check className="h-3 w-3" />
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}