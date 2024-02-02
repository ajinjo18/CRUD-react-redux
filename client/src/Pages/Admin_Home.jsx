import React, { useState } from 'react'
import AdminHome from '../Components/AdminHome/AdminHome'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AdminMsg } from '../Components/ContextStore/AdminContext'
import { userAdded } from '../Components/ContextStore/UserAdded';


const Admin_Home = () => {

  const [msg, setMsg] = useState('')
  const [isUserAdded, setIsUserAdded] = useState(false)

  const changeToUserAdded = (e) => {
    setIsUserAdded(e)
  }

  const addToMsg = (m) => {

    if(m == 'Successfully Registered' ) {
      msg(toast('Successfully Registered'))
    }
    else if(m== 'Successfully Updated'){
      msg(toast('Successfully Updated'))
    }
    else if(m=='User Deleted'){
      msg(toast('User Deleted Successfully'))
    } 
    else{
      toast.error("User Exist", {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    }
  }

  return (
    <div>
      <AdminMsg.Provider value={{msg,addToMsg}}  >
        <userAdded.Provider value={{isUserAdded,changeToUserAdded}} >
         <AdminHome />
        </userAdded.Provider>
      </AdminMsg.Provider>

    </div>
  )
}

export default Admin_Home

