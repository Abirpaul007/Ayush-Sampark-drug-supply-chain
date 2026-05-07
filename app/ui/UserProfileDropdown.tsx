'use client'

import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { logout } from '@/lib/features/auth/authSlice'
import { useRouter } from 'next/navigation'

interface MenuItem {
  label: string
  href: string
  roles?: string[]
}

const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    roles: ['ADMIN', 'HOSPITAL', 'PHARMACY', 'VENDOR'],
  },
  {
    label: 'Profile Settings',
    href: '/settings/profile',
    roles: ['ADMIN', 'HOSPITAL', 'PHARMACY', 'VENDOR'],
  },
  {
    label: 'Inventory Management',
    href: '/inventory',
    roles: ['PHARMACY', 'VENDOR'],
  },
  {
    label: 'Order Management',
    href: '/orders',
    roles: ['HOSPITAL', 'PHARMACY', 'VENDOR'],
  },
  {
    label: 'Supply Chain Analytics',
    href: '/analytics',
    roles: ['ADMIN', 'VENDOR'],
  },
  {
    label: 'User Management',
    href: '/users',
    roles: ['ADMIN'],
  },
]

export function UserProfileDropdown() {
  const dispatch = useDispatch()
  const router = useRouter()
  const user = useSelector((state: RootState) => state.auth.user)

  if (!user) return null

  const filteredMenuItems = menuItems.filter(
    item => !item.roles || item.roles.includes(user.role)
  )

  const handleLogout = () => {
    dispatch(logout())
    router.push('/sign-in')
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="flex items-center gap-2 rounded-md p-2 hover:bg-accent hover:text-accent-foreground">
        <UserCircleIcon className="h-6 w-6" />
        <span className="hidden md:inline-block">{user.name}</span>
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
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-popover shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="p-1">
            <div className="mb-1 px-2 py-1.5 text-sm font-medium">
              {user.name}
              <div className="text-xs text-muted-foreground">{user.role}</div>
            </div>
            <div className="my-1 border-t" />
            {filteredMenuItems.map((item) => (
              <Menu.Item key={item.href}>
                {({ active }) => (
                  <button
                    onClick={() => router.push(item.href)}
                    className={`${
                      active ? 'bg-accent text-accent-foreground' : ''
                    } flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    {item.label}
                  </button>
                )}
              </Menu.Item>
            ))}
            <div className="my-1 border-t" />
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleLogout}
                  className={`${
                    active ? 'bg-accent text-accent-foreground' : ''
                  } flex w-full items-center rounded-md px-2 py-2 text-sm text-red-500`}
                >
                  Logout
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
} 