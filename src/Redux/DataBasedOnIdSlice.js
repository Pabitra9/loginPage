import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    userDataBasedOnId : []
}

export const dataBasedOnIdSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    addUserDataBasedOnId : (state, action) => {
        state.userDataBasedOnId  = [action.payload];
    },
    
  },
})

// Action creators are generated for each case reducer function
export const { addUserDataBasedOnId } = dataBasedOnIdSlice.actions

export default dataBasedOnIdSlice.reducer