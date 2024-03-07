import { configureStore } from '@reduxjs/toolkit'
import userReducer from './UserSlice'
import searchReducer from './SearchSlice'
import authenticationReducer from './AuthenticationSlice'
import dataBasedOnIdReducer from './DataBasedOnIdSlice'

export const store = configureStore({
  reducer: {
    user : userReducer,
    search : searchReducer,
    authentication : authenticationReducer,
    dataBasedOnId : dataBasedOnIdReducer
  },
});