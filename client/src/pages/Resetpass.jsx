import React, { useContext, useState, useEffect, useRef } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContextValue.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'

const Resetpass = () => {
  const { backendUrl } = useContext(AppContext)
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [newpass, setNewpass] = useState('')
  const [isemailsent, setIsemailsent] = useState(false)
  const [otp, setOtp] = useState('')
  const [isotpsubmited, setIsotpsubmited] = useState(false)
  const inputRefs = useRef([])

  useEffect(() => {
    axios.defaults.withCredentials = true
  }, [])

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
  }

  const onSubmitemail = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', {
        email,
      })
      data.success ? toast.success(data.message) : toast.error(data.message)
      if (data.success) setIsemailsent(true)
    } catch (error) {
      toast.error(error?.message || 'Failed to send OTP')
    }
  }

  const onSubmitOtp = async (e) => {
    e.preventDefault()
    const otpArray = inputRefs.current.map((ref) => ref?.value ?? '')
    setOtp(otpArray.join(''))
    setIsotpsubmited(true)
  }

  const onSubmitnewpass = async (e) => {
    e.preventDefault()
    try {
      const otpValue = otp || inputRefs.current.map((ref) => ref?.value ?? '').join('')
      const { data } = await axios.post(backendUrl + '/api/auth/resetpass', {
        email,
        otp: otpValue,
        newpass,
      })
      data.success ? toast.success(data.message) : toast.error(data.message)
      if (data.success) navigate('/login')
    } catch (error) {
      toast.error(error?.message || 'Failed to reset password')
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

      {/* Centered content */}
      <div className="w-full max-w-md mx-4 flex flex-col items-center">
        {!isemailsent && (
          <form
            onSubmit={onSubmitemail}
            className="bg-slate-900 p-8 rounded-xl shadow-xl w-full text-sm"
          >
            <h1 className="text-white text-2xl font-semibold text-center mb-4">
              Reset Password
            </h1>
            <p className="text-center mb-6 text-indigo-300">
              Enter your email to reset your password
            </p>
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.email} alt="email" className="w-5 h-5 shrink-0" />
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="bg-transparent outline-none border-none w-full text-white placeholder:text-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full font-medium"
              >
                Submit
              </button>
            </div>
          </form>
        )}

        {!isotpsubmited && isemailsent && (
          <form
            onSubmit={onSubmitOtp}
            className="bg-slate-900 p-8 rounded-xl shadow-xl w-full text-sm"
          >
            <h1 className="text-white text-2xl font-semibold text-center mb-4">
              Reset Password OTP
            </h1>
            <p className="text-center mb-6 text-indigo-300">
              Enter the 6-digit OTP sent to your email address.
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
              className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full font-medium"
            >
              Submit
            </button>
          </form>
        )}

        {isotpsubmited && isemailsent && (
          <form
            onSubmit={onSubmitnewpass}
            className="bg-slate-900 p-8 rounded-xl shadow-xl w-full text-sm"
          >
            <h1 className="text-white text-2xl font-semibold text-center mb-4">
              New Password
            </h1>
            <p className="text-center mb-6 text-indigo-300">
              Enter your new password
            </p>
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.lock_icon} alt="lock" className="w-5 h-5 shrink-0" />
              <input
                type="password"
                placeholder="Enter your new password"
                required
                className="bg-transparent outline-none border-none w-full text-white placeholder:text-gray-400"
                value={newpass}
                onChange={(e) => setNewpass(e.target.value)}
              />
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full font-medium"
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default Resetpass
