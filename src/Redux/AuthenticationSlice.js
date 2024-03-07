import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    userAuthentication : []
}

export const authenticationSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    addAuthentication : (state, action) => {
        state.userAuthentication  = [action.payload];
    },
    
  },
})

// Action creators are generated for each case reducer function
export const { addAuthentication } = authenticationSlice.actions

export default authenticationSlice.reducer