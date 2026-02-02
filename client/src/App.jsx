import React from 'react'
import { Routes , Route } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Emailverify from './pages/Emailverify.jsx'
import Resetpass from './pages/Resetpass.jsx'
import Home from './pages/Home.jsx'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


const App = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/emailverify" element={<Emailverify />} />
        <Route path="/resetpass" element={<Resetpass />} />
      </Routes>
    </div>
  )
}

export default App