import { NextRequest, NextResponse } from 'next/server'

// Mock orders database - replace with actual database
let mockOrders = [
  {
    id: 'ORD001',
    hospitalId: '2',
    hospitalName: 'City General Hospital',
    vendorId: '4',
    vendorName: 'MediSupply Co.',
    items: [
      {
        drugId: '1',
        drugName: 'Paracetamol 500mg',
        quantity: 1000,
        unitPrice: 0.25,
        totalPrice: 250,
      },
      {
        drugId: '2',
        drugName: 'Amoxicillin 250mg',
        quantity: 500,
        unitPrice: 0.50,
        totalPrice: 250,
      },
    ],
    totalAmount: 500,
    status: 'pending',
    orderDate: '2024-03-15T10:30:00Z',
    expectedDelivery: '2024-03-20T10:00:00Z',
    actualDelivery: null,
    notes: 'Urgent order for emergency department',
    createdAt: '2024-03-15T10:30:00Z',
    updatedAt: '2024-03-15T10:30:00Z',
  },
  {
    id: 'ORD002',
    hospitalId: '2',
    hospitalName: 'St. Mary Medical Center',
    vendorId: '4',
    vendorName: 'PharmaTech Inc.',
    items: [
      {
        drugId: '3',
        drugName: 'Ibuprofen 400mg',
        quantity: 800,
        unitPrice: 0.35,
        totalPrice: 280,
      },
      {
        drugId: '4',
        drugName: 'Omeprazole 20mg',
        quantity: 300,
        unitPrice: 1.20,
        totalPrice: 360,
      },
    ],
    totalAmount: 640,
    status: 'processing',
    orderDate: '2024-03-14T15:45:00Z',
    expectedDelivery: '2024-03-19T10:00:00Z',
    actualDelivery: null,
    notes: 'Regular monthly order',
    createdAt: '2024-03-14T15:45:00Z',
    updatedAt: '2024-03-14T15:45:00Z',
  },
  {
    id: 'ORD003',
    hospitalId: '2',
    hospitalName: 'Regional Health Center',
    vendorId: '4',
    vendorName: 'Global Meds Ltd.',
    items: [
      {
        drugId: '5',
        drugName: 'Metformin 500mg',
        quantity: 600,
        unitPrice: 0.80,
        totalPrice: 480,
      },
    ],
    totalAmount: 480,
    status: 'shipped',
    orderDate: '2024-03-13T09:15:00Z',
    expectedDelivery: '2024-03-18T10:00:00Z',
    actualDelivery: null,
    notes: 'Diabetes medication order',
    createdAt: '2024-03-13T09:15:00Z',
    updatedAt: '2024-03-13T09:15:00Z',
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const hospitalId = searchParams.get('hospitalId')
    const vendorId = searchParams.get('vendorId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    let filteredOrders = [...mockOrders]

    // Apply filters
    if (status) {
      filteredOrders = filteredOrders.filter(order => order.status === status)
    }

    if (hospitalId) {
      filteredOrders = filteredOrders.filter(order => order.hospitalId === hospitalId)
    }

    if (vendorId) {
      filteredOrders = filteredOrders.filter(order => order.vendorId === vendorId)
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex)

    return NextResponse.json({
      orders: paginatedOrders,
      pagination: {
        page,
        limit,
        total: filteredOrders.length,
        totalPages: Math.ceil(filteredOrders.length / limit),
      },
    })
  } catch (error) {
    console.error('Get orders error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()

    // Validate required fields
    const requiredFields = ['hospitalId', 'hospitalName', 'vendorId', 'vendorName', 'items']
    for (const field of requiredFields) {
      if (!orderData[field]) {
        return NextResponse.json(
          { message: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Calculate total amount
    const totalAmount = orderData.items.reduce((sum: number, item: any) => {
      return sum + (item.quantity * item.unitPrice)
    }, 0)

    // Create new order
    const newOrder = {
      id: `ORD${String(mockOrders.length + 1).padStart(3, '0')}`,
      ...orderData,
      totalAmount,
      status: 'pending',
      orderDate: new Date().toISOString(),
      expectedDelivery: orderData.expectedDelivery || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      actualDelivery: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockOrders.push(newOrder)

    return NextResponse.json({
      order: newOrder,
      message: 'Order created successfully',
    })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 