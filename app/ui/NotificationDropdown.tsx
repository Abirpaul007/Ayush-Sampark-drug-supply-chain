'use client'

import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { BellIcon } from '@heroicons/react/24/outline'

interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: 'info' | 'success' | 'warning' | 'error'
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Request',
    message: 'Hospital A has requested 100 units of Paracetamol',
    time: '5 minutes ago',
    read: false,
    type: 'info',
  },
  {
    id: '2',
    title: 'Delivery Confirmed',
    message: 'Shipment #1234 has been delivered to Hospital B',
    time: '1 hour ago',
    read: true,
    type: 'success',
  },
  {
    id: '3',
    title: 'Low Stock Alert',
    message: 'Stock of Amoxicillin is running low',
    time: '2 hours ago',
    read: false,
    type: 'warning',
  },
]

export function NotificationDropdown() {
  const unreadCount = mockNotifications.filter(n => !n.read).length

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="relative rounded-md p-2 hover:bg-accent hover:text-accent-foreground">
        <BellIcon className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
            {unreadCount}
          </span>
        )}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-popover shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="p-2">
            <div className="mb-2 px-2 py-1 text-sm font-semibold">Notifications</div>
            <div className="max-h-[300px] overflow-y-auto">
              {mockNotifications.map((notification) => (
                <Menu.Item key={notification.id}>
                  {({ active }) => (
                    <div
                      className={`${
                        active ? 'bg-accent' : ''
                      } ${
                        !notification.read ? 'bg-accent/50' : ''
                      } flex cursor-pointer items-start gap-3 rounded-md px-2 py-2 text-sm`}
                    >
                      <div className={`mt-1 h-2 w-2 flex-none rounded-full ${
                        notification.type === 'info' ? 'bg-blue-500' :
                        notification.type === 'success' ? 'bg-green-500' :
                        notification.type === 'warning' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`} />
                      <div className="flex-1">
                        <div className="font-medium">{notification.title}</div>
                        <div className="text-muted-foreground">{notification.message}</div>
                        <div className="mt-1 text-xs text-muted-foreground">{notification.time}</div>
                      </div>
                    </div>
                  )}
                </Menu.Item>
              ))}
            </div>
            {mockNotifications.length > 0 && (
              <div className="mt-2 border-t pt-2">
                <button className="w-full rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                  Mark all as read
                </button>
              </div>
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
} 