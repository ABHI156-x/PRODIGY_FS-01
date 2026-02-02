import React, { useState, useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContextValue.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
  const navigate = useNavigate()
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext)

  const [state, setState] = useState('Sign Up')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      axios.defaults.withCredentials = true

      if (state === 'Sign Up') {
        const { data } = await axios.post(
          backendUrl + '/api/auth/register',
          { name, email, password }
        )

        if (data.success) {
          setIsLoggedIn(true)
          await getUserData()
          navigate('/')
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(
          backendUrl + '/api/auth/login',
          { email, password }
        )

        if (data.success) {
          setIsLoggedIn(true)
          await getUserData()
          navigate('/')
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong')
    }
  }

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-blue-200 to-purple-400 flex flex-col items-center">
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
      <div className="flex items-center justify-center min-h-screen w-full px-4">
        <div className="bg-slate-900/90 backdrop-blur p-8 rounded-xl shadow-xl w-[360px] max-w-[90%] text-indigo-300 text-sm">

          <h2 className="text-3xl font-semibold text-white text-center mb-2">
            {state === 'Sign Up' ? 'Create Account' : 'Login'}
          </h2>

          <p className="text-center text-sm mb-6 text-indigo-400">
            {state === 'Sign Up'
              ? 'Create your account to get started'
              : 'Login to your existing account'}
          </p>

          <form onSubmit={onSubmitHandler}>
            {state === 'Sign Up' && (
              <div className="flex items-center gap-3 rounded-full px-5 py-2.5 mb-4 bg-[#333A5C]">
                <img src={assets.person_icon} alt="" className="w-4 h-4 opacity-80" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-transparent outline-none w-full text-sm text-white placeholder-gray-400"
                  type="text"
                  placeholder="Full Name"
                  required
                />
              </div>
            )}

            <div className="flex items-center gap-3 rounded-full px-5 py-2.5 mb-4 bg-[#333A5C]">
              <img src={assets.mail_icon} alt="" className="w-4 h-4 opacity-80" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent outline-none w-full text-sm text-white placeholder-gray-400"
                type="email"
                placeholder="Email Id"
                required
              />
            </div>

            <div className="flex items-center gap-3 rounded-full px-5 py-2.5 mb-2 bg-[#333A5C]">
              <img src={assets.lock_icon} alt="" className="w-4 h-4 opacity-80" />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent outline-none w-full text-sm text-white placeholder-gray-400"
                type="password"
                placeholder="Password"
                required
              />
            </div>

            <p
              onClick={() => navigate('/resetpass')}
              className="text-xs text-indigo-400 hover:text-indigo-300 mb-6 cursor-pointer"
            >
              Forgot Password?
            </p>

            <button className="w-full py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition">
              {state}
            </button>
          </form>

          <p className="text-gray-400 text-center text-xs mt-6">
            {state === 'Sign Up' ? (
              <>
                Already have an account?{' '}
                <span
                  onClick={() => setState('Login')}
                  className="text-indigo-400 hover:text-indigo-300 cursor-pointer font-medium"
                >
                  Login Here
                </span>
              </>
            ) : (
              <>
                Don&apos;t have an account?{' '}
                <span
                  onClick={() => setState('Sign Up')}
                  className="text-indigo-400 hover:text-indigo-300 cursor-pointer font-medium"
                >
                  Sign Up
                </span>
              </>
            )}
          </p>

        </div>
      </div>
    </div>
  )
}

export default Login
