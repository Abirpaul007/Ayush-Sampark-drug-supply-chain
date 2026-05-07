import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ethers } from 'ethers'

interface BlockchainState {
  provider: ethers.BrowserProvider | null
  signer: ethers.Signer | null
  address: string | null
  chainId: number | null
  contract: any | null
  loading: boolean
  error: string | null
}

const initialState: BlockchainState = {
  provider: null,
  signer: null,
  address: null,
  chainId: null,
  contract: null,
  loading: false,
  error: null,
}

const blockchainSlice = createSlice({
  name: 'blockchain',
  initialState,
  reducers: {
    setProvider: (state, action: PayloadAction<ethers.BrowserProvider | null>) => {
      state.provider = action.payload
    },
    setSigner: (state, action: PayloadAction<ethers.Signer | null>) => {
      state.signer = action.payload
    },
    setAddress: (state, action: PayloadAction<string | null>) => {
      state.address = action.payload
    },
    setChainId: (state, action: PayloadAction<number | null>) => {
      state.chainId = action.payload
    },
    setContract: (state, action: PayloadAction<any | null>) => {
      state.contract = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    resetState: (state) => {
      state.provider = null
      state.signer = null
      state.address = null
      state.chainId = null
      state.contract = null
      state.error = null
    },
  },
})

export const {
  setProvider,
  setSigner,
  setAddress,
  setChainId,
  setContract,
  setLoading,
  setError,
  resetState,
} = blockchainSlice.actions

export default blockchainSlice.reducer 