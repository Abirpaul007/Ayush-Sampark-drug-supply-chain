import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongodb'
import Medicine from '@/lib/models/medicine'
import { Types } from 'mongoose'

// GET: List/search drugs with pagination and filters
export async function GET(request: NextRequest) {
  await connectDB()
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const manufacturer = searchParams.get('manufacturer')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const query: any = {}
    if (category) query.category = category
    if (manufacturer) query.manufacturer = manufacturer
    if (search) {
      query.$or = [
        { brandName: { $regex: search, $options: 'i' } },
        { genericName: { $regex: search, $options: 'i' } },
      ]
    }

    const total = await Medicine.countDocuments(query)
    const drugs = await Medicine.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({
      drugs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get drugs error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Add a new drug
export async function POST(request: NextRequest) {
  await connectDB()
  try {
    const drugData = await request.json()
    // Validate required fields
    const requiredFields = [
      'brandName',
      'genericName',
      'category',
      'dosageForm',
      'strength',
      'batchNumber',
      'expiryDate',
      'stockQuantity',
      'mrp',
    ]
    for (const field of requiredFields) {
      if (!drugData[field]) {
        return NextResponse.json(
          { message: `${field} is required` },
          { status: 400 }
        )
      }
    }
    const newDrug = await Medicine.create(drugData)
    return NextResponse.json({
      drug: newDrug,
      message: 'Drug created successfully',
    })
  } catch (error) {
    console.error('Create drug error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT: Update a drug by ID
export async function PUT(request: NextRequest) {
  await connectDB()
  try {
    const { id, ...updateData } = await request.json()
    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Valid drug id is required' }, { status: 400 })
    }
    const updatedDrug = await Medicine.findByIdAndUpdate(id, updateData, { new: true })
    if (!updatedDrug) {
      return NextResponse.json({ message: 'Drug not found' }, { status: 404 })
    }
    return NextResponse.json({ drug: updatedDrug, message: 'Drug updated successfully' })
  } catch (error) {
    console.error('Update drug error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE: Remove a drug by ID (expects ?id=...)
export async function DELETE(request: NextRequest) {
  await connectDB()
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Valid drug id is required' }, { status: 400 })
    }
    const deletedDrug = await Medicine.findByIdAndDelete(id)
    if (!deletedDrug) {
      return NextResponse.json({ message: 'Drug not found' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Drug deleted successfully' })
  } catch (error) {
    console.error('Delete drug error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 