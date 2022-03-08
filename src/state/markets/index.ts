/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'

const initialState = { 
  sortOrder: {
    field: 'RecentlyListed',
    direction: 'desc'
  },
  collectionType: {
    field: 'All',
    direction: 'asc'
  },
 }

export const MarketsSlice = createSlice({
  name: 'Markets',
  initialState,
  reducers: {
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload
    },
    setCollectionType: (state, action) => {
      state.collectionType = action.payload
    },
  },
})

// Actions
export const { setSortOrder, setCollectionType } = MarketsSlice.actions

export default MarketsSlice.reducer
