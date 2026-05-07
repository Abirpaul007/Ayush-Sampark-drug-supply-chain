'use client'

import { useEffect, useState } from 'react'
import {  FiUsers} from 'react-icons/fi';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/ui/table'
import { Badge } from '@/app/ui/badge'
import { Button } from '@/app/ui/button'
import {
  Activity,
  UserPlus,
  Users,
  CalendarDays,
  MailCheck,
  Shield,
  Power,
} from 'lucide-react'

interface UserType {
  _id: string
  name: string
  email: string
  role: 'ADMIN' | 'HOSPITAL' | 'PHARMACY' | 'VENDOR'
  isEmailVerified: boolean
  isVerified: boolean
  createdAt: string
  updatedAt: string
  status?: 'active' | 'inactive'
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserType[]>([])
  const [newThisMonth, setNewThisMonth] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMIN' | 'HOSPITAL' | 'PHARMACY' | 'VENDOR'>('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 25

  useEffect(() => {
    fetch('/api/admin-users')
      .then((res) => res.json())
      .then((data: UserType[]) => {
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

        const newUsers = data.filter(user => new Date(user.createdAt) >= startOfMonth)
        setNewThisMonth(newUsers.length)

        const enriched = data.map(user => ({
          ...user,
          status: (new Date(user.updatedAt) >= twentyFourHoursAgo ? 'active' : 'inactive') as 'active' | 'inactive',
        }))

        setUsers(enriched)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch users:', err)
        setLoading(false)
      })
  }, [])

  const filteredUsers = users.filter(user =>
    (roleFilter === 'ALL' || user.role === roleFilter) &&
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleRejectClick = async (userId: string) => {
  const confirmed = confirm('Are you sure you want to reject this user application?')
  if (!confirmed) return

  try {
    const res = await fetch('/api/reject-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    })

    const result = await res.json()

    if (res.ok) {
      alert('User application rejected successfully.')

      // Optionally, remove from UI or refetch
      setUsers(prev => prev.filter(u => u._id !== userId))
    } else {
      alert('Failed to reject user: ' + result.message)
    }
  } catch (err) {
    console.error('Error rejecting user:', err)
    alert('An error occurred while rejecting the user.')
  }
}

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-600 to-blue-700 rounded-xl shadow-lg p-6 mb-8">
  <div className="space-y-2">
    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center">
      <FiUsers className="mr-3 text-slate-300" />
      User Management
    </h1>
    <p className="text-slate-300">
      Manage system users and their permissions
    </p>
  </div>
</div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '--' : users.length}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Users
            </CardTitle>
            <Activity className="h-4 w-4 text-red-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '--' : users.filter(u => u.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Active in last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              New This Month
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-blue-800" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '--' : newThisMonth}</div>
            <p className="text-xs text-muted-foreground">New registrations</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Verified Emails
            </CardTitle>
            <MailCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '--' : users.filter(u => u.isEmailVerified).length}
            </div>
            <p className="text-xs text-muted-foreground">Email verified users</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="px-0 sm:px-6">
          <div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4 flex-wrap">
            <div>
              <CardTitle className="text-lg font-semibold">User Directory</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage all system users and their permissions
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                placeholder="Search by name or email"
                className="border px-3 py-1 rounded-md text-sm"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
              />
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value as any)
                  setCurrentPage(1)
                }}
                className="border px-3 py-1 rounded-md text-sm"
              >
                <option value="ALL">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="HOSPITAL">Hospital</option>
                <option value="PHARMACY">Pharmacy</option>
                <option value="VENDOR">Vendor</option>
              </select>
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                Add New User
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.map((user) => (
                    <TableRow key={user._id} className="hover:bg-muted/50">
                      <TableCell className="font-medium text-muted-foreground">
                        {user._id.slice(-5)}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{user.name}</div>
                        {user.isVerified && (
                          <Badge variant="secondary" className="mt-1">
                            Verified
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === 'ADMIN'
                              ? 'default'
                              : ['HOSPITAL', 'PHARMACY', 'VENDOR'].includes(user.role)
                              ? 'secondary'
                              : 'outline'
                          }
                          className="gap-1"
                        >
                          <Shield className="h-3 w-3" />
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.status === 'active' ? 'success' : 'secondary'}
                          className="gap-1"
                        >
                          <div
                            className={`h-2 w-2 rounded-full ${
                              user.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                            }`}
                          />
                          {user.status?.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(user.updatedAt).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
  <Button
    variant="destructive"
    size="sm"
    onClick={() => handleRejectClick(user._id)}
  >
    Invalidate
  </Button>
</TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center px-4 py-2 text-sm text-muted-foreground">
                  <p>
                    Showing {(currentPage - 1) * itemsPerPage + 1}–
                    {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
