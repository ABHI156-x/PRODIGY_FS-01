import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/header'


const Home = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-cover bg-center"
style={{ backgroundImage: 'url(/bg_img.png)' }}>
      <Navbar />
      <main className="flex flex-col items-center justify-center flex-1 w-full">
        <Header />
      </main>
    </div>
  )
}


export default Home