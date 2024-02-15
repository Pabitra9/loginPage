import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentSearchResult : []
}

export const searchSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    addSearchResult : (state, action) => {
        state.currentSearchResult = [action.payload];
    },
    
    
  },
})

// Action creators are generated for each case reducer function
 export const { addSearchResult } = searchSlice.actions


export default searchSlice.reducer