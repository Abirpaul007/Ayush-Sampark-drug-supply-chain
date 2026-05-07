import { NextRequest, NextResponse } from 'next/server'

// Mock inventory database - replace with actual database
let mockInventory = [
  {
    id: '1',
    drugId: '1',
    drugName: 'Paracetamol 500mg',
    location: 'Warehouse A',
    quantity: 5000,
    minStockLevel: 100,
    maxStockLevel: 10000,
    expiryDate: '2025-12-31',
    batchNumber: 'BATCH123',
    supplier: 'MediSupply Co.',
    costPrice: 0.20,
    sellingPrice: 0.25,
    status: 'active',
    lastUpdated: '2024-03-15T10:00:00Z',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    drugId: '2',
    drugName: 'Amoxicillin 250mg',
    location: 'Warehouse B',
    quantity: 3000,
    minStockLevel: 200,
    maxStockLevel: 8000,
    expiryDate: '2025-06-30',
    batchNumber: 'BATCH124',
    supplier: 'PharmaTech Inc.',
    costPrice: 0.40,
    sellingPrice: 0.50,
    status: 'active',
    lastUpdated: '2024-03-14T10:00:00Z',
    createdAt: '2024-01-20T10:00:00Z',
  },
  {
    id: '3',
    drugId: '3',
    drugName: 'Ibuprofen 400mg',
    location: 'Warehouse A',
    quantity: 4000,
    minStockLevel: 150,
    maxStockLevel: 9000,
    expiryDate: '2025-09-15',
    batchNumber: 'BATCH125',
    supplier: 'Global Meds Ltd.',
    costPrice: 0.30,
    sellingPrice: 0.35,
    status: 'active',
    lastUpdated: '2024-03-13T10:00:00Z',
    createdAt: '2024-02-01T10:00:00Z',
  },
  {
    id: '4',
    drugId: '4',
    drugName: 'Omeprazole 20mg',
    location: 'Warehouse C',
    quantity: 2000,
    minStockLevel: 100,
    maxStockLevel: 5000,
    expiryDate: '2025-11-30',
    batchNumber: 'BATCH126',
    supplier: 'MediSupply Co.',
    costPrice: 1.00,
    sellingPrice: 1.20,
    status: 'active',
    lastUpdated: '2024-03-12T10:00:00Z',
    createdAt: '2024-02-10T10:00:00Z',
  },
  {
    id: '5',
    drugId: '5',
    drugName: 'Metformin 500mg',
    location: 'Warehouse B',
    quantity: 1500,
    minStockLevel: 75,
    maxStockLevel: 4000,
    expiryDate: '2025-08-20',
    batchNumber: 'BATCH127',
    supplier: 'PharmaTech Inc.',
    costPrice: 0.65,
    sellingPrice: 0.80,
    status: 'active',
    lastUpdated: '2024-03-11T10:00:00Z',
    createdAt: '2024-02-15T10:00:00Z',
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get('location')
    const status = searchParams.get('status')
    const lowStock = searchParams.get('lowStock')
    const expiringSoon = searchParams.get('expiringSoon')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    let filteredInventory = [...mockInventory]

    // Apply filters
    if (location) {
      filteredInventory = filteredInventory.filter(item => item.location === location)
    }

    if (status) {
      filteredInventory = filteredInventory.filter(item => item.status === status)
    }

    if (lowStock === 'true') {
      filteredInventory = filteredInventory.filter(item => item.quantity <= item.minStockLevel)
    }

    if (expiringSoon === 'true') {
      const thirtyDaysFromNow = new Date()
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
      filteredInventory = filteredInventory.filter(item => new Date(item.expiryDate) <= thirtyDaysFromNow)
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedInventory = filteredInventory.slice(startIndex, endIndex)

    return NextResponse.json({
      inventory: paginatedInventory,
      pagination: {
        page,
        limit,
        total: filteredInventory.length,
        totalPages: Math.ceil(filteredInventory.length / limit),
      },
    })
  } catch (error) {
    console.error('Get inventory error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const inventoryData = await request.json()

    // Validate required fields
    const requiredFields = ['drugId', 'drugName', 'location', 'quantity', 'supplier']
    for (const field of requiredFields) {
      if (!inventoryData[field]) {
        return NextResponse.json(
          { message: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Create new inventory item
    const newInventoryItem = {
      id: (mockInventory.length + 1).toString(),
      ...inventoryData,
      minStockLevel: inventoryData.minStockLevel || 100,
      maxStockLevel: inventoryData.maxStockLevel || 10000,
      status: 'active',
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }

    mockInventory.push(newInventoryItem)

    return NextResponse.json({
      inventory: newInventoryItem,
      message: 'Inventory item created successfully',
    })
  } catch (error) {
    console.error('Create inventory error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 