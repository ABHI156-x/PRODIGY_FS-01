import React, { useContext, useEffect, useRef } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { AppContext } from '../context/AppContextValue.jsx'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Emailverify = () => {
  const navigate = useNavigate()
  const { backendUrl, isLoggedIn, userData, getUserData } = useContext(AppContext)
  const inputRefs = useRef([])

  useEffect(() => {
    axios.defaults.withCredentials = true
  }, [])

  useEffect(() => {
    if (isLoggedIn && userData?.isAccountVerified) {
      navigate('/')
    }
  }, [isLoggedIn, userData, navigate])

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeydown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value.length === 0 && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handlepaste = (e) => {
    const pasteData = e.clipboardData.getData('text')
    const pasteValues = pasteData.split('').slice(0, 6)
    pasteValues.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char
      }
    })
    if (pasteValues.length > 0 && inputRefs.current[pasteValues.length - 1]) {
      inputRefs.current[pasteValues.length - 1].focus()
    }
  }

  const onSubmitHandlers = async (e) => {
    e.preventDefault()
    try {
      const otpArray = inputRefs.current.map((ref) => ref?.value ?? '')
      const otp = otpArray.join('')
      const { data } = await axios.post(backendUrl + '/api/auth/verify-account', { otp })
      if (data.success) {
        toast.success(data.message)
        await getUserData()
        navigate('/')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error?.message || 'Verification failed')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-blue-200 to-purple-400 relative">
      {/* Top bar: logo left */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-6 z-10">
        <img
          onClick={() => navigate('/')}
          src={assets.logo}
          alt="logo"
          className="w-28 cursor-pointer"
        />
      </div>

      {/* Centered form */}
      <form
        onSubmit={onSubmitHandlers}
        className="bg-slate-900 p-8 rounded-xl shadow-xl w-full max-w-md text-sm mx-4"
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Email Verify OTP
        </h1>
        <p className="text-center mb-6 text-indigo-300">
          Enter the 6-digit OTP sent to your email address to verify your account.
        </p>
        <div className="flex justify-between gap-2 mb-8" onPaste={handlepaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type="text"
                maxLength={1}
                key={index}
                required
                className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md border border-transparent focus:border-indigo-500 focus:outline-none"
                ref={(el) => (inputRefs.current[index] = el)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeydown(e, index)}
              />
            ))}
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full font-medium hover:opacity-90 transition"
        >
          Verify Email
        </button>
      </form>
    </div>
  )
}

export default Emailverify
