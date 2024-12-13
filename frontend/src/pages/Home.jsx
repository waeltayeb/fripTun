import React from 'react'
import Navbar from '../components/Navbar'

import Banner from '../components/Banner'
import Features from '../components/features'
import Categories from '../components/Categories'
import NewArrivals from '../components/NewArrivals'
import Recomended from '../components/Recomended'
import PubImage from '../components/PubImage'
import Footer from '../components/Footer'

function Home() {
  return (
    <>
    <Navbar/>
    <Banner />
    <Features />
    <Categories />
    <NewArrivals />
    <PubImage />
    <Recomended />
    <Footer />


    </>
  )
}

export default Home
