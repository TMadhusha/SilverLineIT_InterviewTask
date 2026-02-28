import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen w-screen bg-gradient-to-r from-purple-400 to-indigo-300 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Course Content Upload System
        </h1>
        <p className="text-gray-600 mb-8">
          Upload and manage your course materials
        </p>
        <Link
          to="/files" 
          className="bg-purple-800 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Go to Files
        </Link>
      </div>
    </div>
  )
}
