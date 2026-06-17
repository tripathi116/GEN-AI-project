import { useAuth } from "../hooks/useAuth";
import {Navigate} from "react-router"
import React from 'react'

const Protected = ({children}) => {
  const {loading, user} = useAuth()

  if (loading){
    return (
      <main className="relative w-screen h-screen overflow-hidden bg-transparent text-white font-sans flex items-center justify-center select-none">
        <div className="relative z-10 w-full max-w-md px-6">
          <div className="liquid-glass border border-white/20 rounded-2xl p-8 flex flex-col items-center justify-center py-12 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mb-6"></div>
            <h1 className="text-xl font-medium text-white mb-2">Loading...</h1>
            <p className="text-sm text-gray-400">Preparing your workspace.</p>
          </div>
        </div>
      </main>
    )
  }

  if(!user){
    return <Navigate to={'/login'}/>
  }

  return children
}

export default Protected
