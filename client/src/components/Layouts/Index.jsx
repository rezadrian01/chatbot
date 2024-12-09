import React from 'react'
import Navbar from '../Navbar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
    return (
        <div className="mx-auto w-full lg:w-5/6 bg-stone-50 shadow-lg p-4 ">
            <Navbar />
            <Outlet />
        </div>
    )
}

export default Layout