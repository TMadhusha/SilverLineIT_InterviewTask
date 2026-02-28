import { useState } from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Files from './pages/Files'
import Home from './pages/Home'



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/files' element={<Files />} />
      </Routes>
    </BrowserRouter>
    
  )
}

export default App
