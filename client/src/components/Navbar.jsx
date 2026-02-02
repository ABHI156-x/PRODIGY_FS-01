import React, { useContext, useEffect } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContextValue.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'

const Navbar = () => {
  const navigate = useNavigate()
  const { userData, backendUrl, setUserData, setIsLoggedIn } = useContext(AppContext)

  useEffect(() => {
    axios.defaults.withCredentials = true
  }, [])

  const sendVerificationotp = async () => {
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp')
      if (data.success) {
        navigate('/emailverify')
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error?.message || 'Failed to send OTP')
    }
  }

  const logout = async () => {
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/logout')
      if (data.success) {
        setIsLoggedIn(false)
        setUserData(null)
        navigate('/')
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error(err?.message || 'Logout failed')
    }
  }

  return (
    <div className="w-full flex justify-between items-center bg-white/90 backdrop-blur sm:p-6 sm:px-12 absolute top-0 left-0 right-0 z-10">
      {/* Logo - left */}
      <img src={assets.logo} alt="Logo" className="w-28 sm:w-32 cursor-pointer" onClick={() => navigate('/')} />
      {/* Button / user menu - right */}
      {userData ? (
        <div className="w-10 h-10 flex justify-center items-center rounded-full bg-black text-white font-medium relative group">
          {userData.name?.[0]?.toUpperCase()}
          <div className="absolute hidden group-hover:block top-full right-0 mt-1 z-20 min-w-[120px] rounded-lg overflow-hidden bg-white shadow-lg border border-gray-200">
            <ul className="list-none m-0 p-2 text-sm text-gray-800">
              {!userData.isAccountVerified && (
                <li
                  onClick={sendVerificationotp}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded"
                >
                  Verify email
                </li>
              )}
              <li
                onClick={logout}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded"
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-5 py-3 text-gray-800 hover:bg-gray-100 transition-all text-sm font-medium"
        >
          Login
          <img src={assets.arrow_icon} alt="" className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export default Navbar
