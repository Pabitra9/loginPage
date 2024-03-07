import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentSearchResult : []
}

export const searchSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    addSearchResult: (state, action) => {
        // Check if action.payload is empty
        if (Array.isArray(action.payload) && action.payload.length > 0) {
            state.currentSearchResult = [...action.payload];
        } else {
            state.currentSearchResult = [];
        }
    },
  },
});

// Action creators are generated for each case reducer function
 export const { addSearchResult } = searchSlice.actions


export default searchSlice.reducer