import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContextValue.jsx'

const Header = () => {
    const {userData}= useContext(AppContext)
  return (
    <div className="flex flex-col items-center justify-center mt-28 px-4 text-center text-gray-600 flex-1">
        <img
          src={assets.header_img}
          alt=""
          className='w-32 h-32 rounded-full mb-5 shadow-sm'
        />

        <h1 className='flex items-center gap-2 text-base sm:text-lg font-normal mb-2 text-gray-500'>

            Hey {userData ? userData.name  : "Developer"}!
            <img
              className='w-6 aspect-square'
              src={assets.hand_wave}
              alt=""
              
            />
         </h1>

        <h2 className='text-xl sm:text-2xl font-medium mb-3 text-gray-700'>
            WELCOME TO OUR APP
        </h2>

        <p className='mb-6 max-w-md text-sm sm:text-base text-gray-500 leading-relaxed'>
            Let's start with a quick product tour and we will have you up and running in no time!
        </p>

        <button className="bg-gray-100 border border-gray-300 px-5 py-2.5 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-all">
            Get Started
        </button>
    </div>
  )
}

export default Header
