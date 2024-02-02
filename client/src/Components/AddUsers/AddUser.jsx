import axios from 'axios'
import React, { useContext, useState } from 'react'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AdminMsg } from '../ContextStore/AdminContext';
import { userAdded } from '../ContextStore/UserAdded';

const AddUser = () => {

    const { msg, addToMsg } = useContext(AdminMsg)
    const { isUserAdded,changeToUserAdded } = useContext(userAdded)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [location, setLocation] = useState('')

    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [locationError, setLocationError] = useState('');


    const data = {
        name: name,
        email: email,
        location: location,
        password: email
    }
    

    const validateName = () => {
        if (!name) {
          setNameError('Name required');
          return true
        } 
        else {
          setNameError('');
          return false
        }
    };
    
    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          setEmailError('Valid email required.');
          return true
        }
        else {
          setEmailError('');
          return false
        }
    };
    
    const validateLocation = () => {
        if (!location) {
            setLocationError('Location required');
            return true
        } 
        else {
            setLocationError('');
            return false
        }
    };
    
    
    const addUser = async () =>{

        const vn = validateName();
        const ve = validateEmail();
        const vl = validateLocation();

        if (!vn && !ve && !vl) {
            try {
                const response = await axios.post('http://localhost:3001/admin/adduser', { data });
        
                if (response.data.message === 'User signed up successfully') {
                    console.log('User signed up successfully:', response);
                    changeToUserAdded(true)
                    setName('')
                    setEmail('')
                    setLocation('')
                    addToMsg('Successfully Registered');
                } else {
                    console.error('Unexpected response:', response);
                }
            } 
            catch (error) {
                console.log('Error during signup:', error);
        
                if (error.response && error.response.data.message === 'User Exist') {
                    console.log('User Exist:', error.response);
                    addToMsg('User Exist');
                } else {
                    console.error('Unexpected error:', error);
                }
            }
        }
        else{
            console.log('validation error');
        }
    
    }




  return (
    <div style={{background:'blue', padding:'20px', borderRadius:'20px'}} className="col-md-4">
        <ToastContainer />
        <h3>ADD USER</h3>
        <div className="mb-3">
            <input
            className="form-control"
            type="text"
            name="name"
            placeholder="Name"
            value={name}
            onBlur={validateName}
            onChange={(e) => setName(e.target.value)}
            />
        </div>
        {nameError && <div style={{color:'red',height:'5px', marginTop: '-20px'}} className="error">{nameError}</div>}<br/>

        <div className="mb-3">
            <input
            className="form-control"
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onBlur={validateEmail}
            onChange={(e) => setEmail(e.target.value)}
            />
        </div>
        {emailError && <div style={{color:'red',height:'5px', marginTop: '-20px'}} className="error">{emailError}</div>}<br/>

        <div className="mb-3">
            <input
            className="form-control"
            type="text"
            name="Location"
            placeholder="Location"
            value={location}
            onBlur={validateLocation}
            onChange={(e) => setLocation(e.target.value)}
            />
        </div>
        {locationError && <div style={{color:'red',height:'5px', marginTop: '-20px'}} className="error">{locationError}</div>}<br/>

        <button onClick={addUser} className="btn btn-secondary form-control">
            SUBMIT
        </button>
    </div>
  )
}

export default AddUser
