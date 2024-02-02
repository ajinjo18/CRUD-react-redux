import React, { useState } from 'react'
import {BrowserRouter as Router , Routes , Route} from 'react-router-dom'


import Login from '../Components/LoginSignup/LoginSignup'
import User_Home from '../Pages/User_Home'
import AdminLogin from '../Components/AdminLogin/AdminLogin'
import Admin_Home from '../Pages/Admin_Home'


const MainRoutes = () => {

 

  return (
    <div>
      <Router>
        <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/home' element={<User_Home />} />
            <Route path='/admin' element={<AdminLogin />} />
            <Route path='/adminhome' element={<Admin_Home />} />
        </Routes>
      </Router>
    </div>
  )
}

export default MainRoutes
