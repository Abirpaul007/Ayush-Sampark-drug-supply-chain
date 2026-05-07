import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type DrugCategory = 'ANTIBIOTICS' | 'ANALGESICS' | 'ANTIVIRAL' | 'VACCINES' | 'INSULIN' | 'OTHER'
export type OrderStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED'

interface Drug {
  id: string
  name: string
  category: DrugCategory
  description?: string
  manufacturer: string
  batchNumber: string
  expiryDate: string
  quantity: number
  location?: string
}

interface InventoryState {
  drugs: Drug[]
  requests: {
    id: string
    drugId: string
    quantity: number
    urgency: boolean
    status: OrderStatus
    notes?: string
    createdAt: string
    updatedAt: string
  }[]
  loading: boolean
  error: string | null
}

const initialState: InventoryState = {
  drugs: [],
  requests: [],
  loading: false,
  error: null,
}

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setDrugs: (state, action: PayloadAction<Drug[]>) => {
      state.drugs = action.payload
    },
    addDrug: (state, action: PayloadAction<Drug>) => {
      state.drugs.push(action.payload)
    },
    updateDrug: (state, action: PayloadAction<Drug>) => {
      const index = state.drugs.findIndex((drug) => drug.id === action.payload.id)
      if (index !== -1) {
        state.drugs[index] = action.payload
      }
    },
    removeDrug: (state, action: PayloadAction<string>) => {
      state.drugs = state.drugs.filter((drug) => drug.id !== action.payload)
    },
    setRequests: (state, action: PayloadAction<InventoryState['requests']>) => {
      state.requests = action.payload
    },
    addRequest: (state, action: PayloadAction<InventoryState['requests'][0]>) => {
      state.requests.push(action.payload)
    },
    updateRequest: (state, action: PayloadAction<InventoryState['requests'][0]>) => {
      const index = state.requests.findIndex((req) => req.id === action.payload.id)
      if (index !== -1) {
        state.requests[index] = action.payload
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const {
  setDrugs,
  addDrug,
  updateDrug,
  removeDrug,
  setRequests,
  addRequest,
  updateRequest,
  setLoading,
  setError,
} = inventorySlice.actions

export default inventorySlice.reducer 