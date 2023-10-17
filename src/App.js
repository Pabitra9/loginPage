import React from 'react'
import LoginPage from './Components/LoginPage'
import Dashboard from './Dashboard'
import { BrowserRouter } from 'react-router-dom'
import Router from './Router'
const App = () => {
  return (
    <BrowserRouter>
    <Router/>
    </BrowserRouter>
  )
}

export default App