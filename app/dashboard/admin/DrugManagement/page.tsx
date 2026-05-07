'use client'

import { useEffect, useState } from 'react'
import {  FaPills } from 'react-icons/fa';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/ui/table'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/app/ui/card'
import { Input } from '@/app/ui/input'
import { Button } from '@/app/ui/button'
import { Search, Download, ChevronLeft, ChevronRight, AlertCircle, CalendarClock } from 'lucide-react'
import { Badge } from '@/app/ui/badge'

interface InventoryItem {
  _id: string
  batchNumber: string
  expiryDate: string
  stockQuantity: number
  mrp: number
  offerPrice: number
  medicineId: {
    brandName: string
    genericName: string
    dosageForm: string
    packSize: string
  }
}

export default function VendorInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [filtered, setFiltered] = useState<InventoryItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const itemsPerPage = 40

  useEffect(() => {
    setIsLoading(true)
    fetch('/api/admin-inventory')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Filter out expired items
          const validItems = data.inventory.filter((item: InventoryItem) => {
            const expiry = new Date(item.expiryDate)
            return expiry > new Date()
          })
          setInventory(validItems)
          setFiltered(validItems)
        }
      })
      .catch(error => console.error('Error fetching inventory:', error))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    const lower = searchTerm.toLowerCase()
    const results = inventory.filter(item =>
      item.medicineId?.brandName?.toLowerCase().includes(lower) ||
      item.medicineId?.genericName?.toLowerCase().includes(lower) ||
      item.batchNumber.toLowerCase().includes(lower)
    )
    setFiltered(results)
    setPage(1)
  }, [searchTerm, inventory])

  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage)
  const totalPages = Math.ceil(filtered.length / itemsPerPage)

  const handleExportCSV = () => {
    const rows = [
      ['Brand Name', 'Generic Name', 'Dosage Form', 'Pack Size', 'Batch No.', 'Expiry', 'Stock', 'MRP', 'Offer Price'],
      ...filtered.map(item => [
        item.medicineId.brandName,
        item.medicineId.genericName,
        item.medicineId.dosageForm,
        item.medicineId.packSize,
        item.batchNumber,
        new Date(item.expiryDate).toLocaleDateString(),
        item.stockQuantity,
        item.mrp,
        item.offerPrice
      ])
    ]
    const csvContent = rows.map(e => e.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', `vendor_inventory_${new Date().toISOString().split('T')[0]}.csv`)
    link.click()
  }

  const isExpiringSoon = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const in30Days = new Date()
    in30Days.setDate(today.getDate() + 30)
    return date <= in30Days && date > today
  }

  const isLowStock = (quantity: number) => quantity < 10
  const isCriticalStock = (quantity: number) => quantity < 5

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-600 to-blue-600 rounded-xl shadow-lg p-6 mb-8">
  <div className="flex items-center justify-between">
    <div className="flex items-center">
      <FaPills className="mr-3 text-blue-200 text-2xl" />
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
        Drug Inventory
      </h1>
    </div>
    
    <div className="flex items-center space-x-2">
      <Button 
        variant="outline" 
        onClick={handleExportCSV}
        className="bg-white bg-opacity-90 hover:bg-opacity-100 text-white-700 hover:text-blue-800 border-blue-300 hover:border-blue-400 flex items-center"
      >
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>
    </div>
  </div>
</div>

      <Card className="border-none shadow-sm">
        <CardHeader className="px-6 pt-6 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-lg">Medicine Stock</CardTitle>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by brand, generic name or batch..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[180px]">Brand Name</TableHead>
                  <TableHead>Generic Name</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Pack</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">MRP</TableHead>
                  <TableHead className="text-right">Offer Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.length > 0 ? (
                  paginated.map(item => (
                    <TableRow key={item._id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        {item.medicineId?.brandName}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.medicineId?.genericName}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {item.medicineId?.dosageForm}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.medicineId?.packSize}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {item.batchNumber}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {isExpiringSoon(item.expiryDate) && (
                            <span className="flex items-center" title="Expiring soon">
                              <CalendarClock className="h-4 w-4 text-yellow-500" />
                            </span>
                          )}
                          <span className={isExpiringSoon(item.expiryDate) ? 'text-yellow-600' : ''}>
                            {new Date(item.expiryDate).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge 
                          variant={isCriticalStock(item.stockQuantity) ? 'destructive' : 
                                  isLowStock(item.stockQuantity) ? 'warning' : 'outline'}
                        >
                          {item.stockQuantity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.mrp)}
                      </TableCell>
                      <TableCell className="text-right font-medium text-green-600">
                        {formatCurrency(item.offerPrice)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      {searchTerm ? 'No results found' : 'No inventory available'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{(page - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(page * itemsPerPage, filtered.length)}
            </span>{' '}
            of <span className="font-medium">{filtered.length}</span> items
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center justify-center w-10 text-sm font-medium">
              {page}/{totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || isLoading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      {filtered.length > 0 && (
        <div className="flex items-center space-x-4 rounded-lg border p-4 bg-blue-50">
          <AlertCircle className="h-5 w-5 text-blue-600" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-blue-600">Inventory Summary</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <span className="w-24 text-muted-foreground">Total Items:</span>
                <span className="font-medium">{filtered.length}</span>
              </div>
              <div className="flex items-center">
                <span className="w-24 text-muted-foreground">Low Stock:</span>
                <span className="font-medium">
                  {filtered.filter(item => isLowStock(item.stockQuantity)).length}
                </span>
              </div>
              <div className="flex items-center">
                <span className="w-24 text-muted-foreground">Expiring Soon:</span>
                <span className="font-medium">
                  {filtered.filter(item => isExpiringSoon(item.expiryDate)).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}