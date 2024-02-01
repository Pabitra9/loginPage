import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './Components/Shared/AuthContext'
import Router from './Router'

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
