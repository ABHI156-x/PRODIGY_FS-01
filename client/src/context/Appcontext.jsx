import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from './AppContextValue.jsx'

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    axios.defaults.withCredentials = true
  }, [])

  const getUserData = useCallback(async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/data', {
        withCredentials: true,
      })
      if (data.success) {
        setUserData(data.userData)
      }
    } catch (error) {
      toast.error(error?.message || 'Failed to load user data')
    }
  }, [backendUrl])

  const getAuthState = useCallback(async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/auth/is-auth', {
        withCredentials: true,
      })
      if (data.success) {
        setIsLoggedIn(true)
        await getUserData()
      } else {
        setIsLoggedIn(false)
        setUserData(null)
      }
    } catch {
      setIsLoggedIn(false)
      setUserData(null)
    }
  }, [backendUrl, getUserData])

  useEffect(() => {
    const run = async () => {
      await getAuthState()
    }
    run()
  }, [getAuthState])

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  }

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}
