import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import './App.css'
import authService from "./appwrite/auth"
import {login, logout} from "./store/authSlice"
import { Footer, Header } from './components'
import { Outlet } from 'react-router-dom'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    authService.getCurrentUser()
    .then((userData) => {
      if (userData) {
        dispatch(login({userData}))
      } else {
        dispatch(logout())
      }
    })
    .finally(() => setLoading(false))
  }, [])
  
  return !loading ? (
    <div className='min-h-full flex flex-col bg-gradient-to-b from-gray-800 via-gray-900 to-black
'>
      <Header />
      <main className='flex-grow pl-16 mt-4'> {/* Added padding-left to account for sidebar */}
        <Outlet />
      </main>
      <Footer />
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-pulse text-2xl font-semibold text-gray-600">Loading...</div>
    </div>
  )
}

export default App