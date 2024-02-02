import React, { useRef, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import './UserHome.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import { useSelector, useDispatch } from 'react-redux'
import { userLogout,setUserData } from '../../Redux/userData/userDataSlice';

const UserHome = () => {

  const userData = useSelector(state => state.userData.value)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [imageChanged, setImageChanged] = useState(false)

  const [userName, setUserName] = useState(userData?.name)
  const [userEmail, setUserEmail] = useState(userData?.email)
  const [userLocation, setUserLocation] = useState(userData?.location)
  const [userOccupation, setUserOccupation] = useState(userData?.occupation)

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [locationError, setLocationError] = useState('');
  const [occupationError, setOccupationError] = useState('');

  const validateName = () => {
    if (!userName) {
      setNameError('Name is required');
      return true;
    } 
    else {
      setNameError('');
      return false;
    }
  };
    
  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      setEmailError('Valid email is required');
      return true;
    } 
    else {
      setEmailError('');
      return false;
    }
  };
    
  const validateLocation = () => {
    if (!userLocation) {
      setLocationError('Location is required');
      return true;
    } 
    else {
      setLocationError('');
      return false;
    }
  };
    
  const validateOccupation = () => {
    if (!userOccupation) {
      setOccupationError('Occupation is required');
      return true;
    } 
    else {
      setOccupationError('');
      return false;
    }
  };


  const updateDataInput = () => {
    setUserName(userData?.name);
    setUserEmail(userData?.email);
    setUserLocation(userData?.location);
    setUserOccupation(userData?.occupation);
  };
    
  const handleSubmit = async () => {
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isLocationValid = validateLocation();
    const isOccupationValid = validateOccupation();

    if (!isNameValid && !isEmailValid && !isLocationValid && !isOccupationValid) {
      const updateData = {
        name: userName,
        email: userEmail,
        location: userLocation,
        occupation: userOccupation,
      }

      const email = sessionStorage.getItem('email');

      const response = await axios.post('http://localhost:3001/editprofile',{updateData,email})

      localStorage.setItem('token', response.data.token);
      sessionStorage.removeItem('email')
      sessionStorage.setItem('email',response.data.user.email)

      setImageChanged(true)
      
    } 
    else {
      console.log('Validation error. Please check your inputs.');
    }
  };



  useEffect(() => {
    const fetchData = async () => {
      const email = sessionStorage.getItem('email');
      try {
        const response = await axios.post('http://localhost:3001/profileimage', { email });

        dispatch(setUserData({value:response.data}))
        updateDataInput()
        setImageChanged(false)

      } 
      catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };
    fetchData();

  }, [imageChanged]);
      

  useEffect(()=>{
    const token = localStorage.getItem('token')
    if (token) {
      const isTokenValid = jwtDecode(token);
      if (isTokenValid) {
        navigate('/home')
      } else {
        dispatch(userLogout())
        navigate('/')
      }
    } else {
      dispatch(userLogout())
      navigate('/')
    }
    
  },[])

  const handleEditProfile = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async(event) => {
    
    const selectedFile = event.target.files[0];
    const formData = new FormData();
    formData.append('file', selectedFile);

    const email = sessionStorage.getItem('email')

    await axios.post('http://localhost:3001/profilepicture',formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: {
          email: email,
        },
    })
    setImageChanged(true)
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('email')
    dispatch(userLogout())
    navigate('/')
  };

  // Create a ref to the input element to trigger the file dialog
  const fileInputRef = useRef(null);

  return (
    <div className="wrapper">
      <div className="user-card">
        <div className="user-card-img">
          <input
            name='profilepicture'
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          <button className="edit-profile-button-top" onClick={handleEditProfile}>
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <img
            src={`http://localhost:3001/img/${userData?.profilePicture}`}
            alt=""
          />
        </div>
        <div className="user-card-info">
          <h2>{userData?.name}</h2>
          <p>
            <span>Email:</span> {userData?.email}
          </p>
          <p>
            <span>Location:</span> {userData?.location}
          </p>
          <p>
            <span>Occupation:</span> {userData?.occupation}
          </p>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>  

          <button type="button" className="edit-button" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Edit
          </button>

            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Edit user details</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">
                                Username
                                </label>
                                <input
                                type="text"
                                className="form-control"
                                id="username"
                                value={userName}
                                onBlur={validateName}
                                onChange={(e) => setUserName(e.target.value)}
                                />
                                {nameError && <div style={{ color: 'red', height: '5px' }}>{nameError}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">
                                Email
                                </label>
                                <input
                                type="text"
                                className="form-control"
                                id="email"
                                value={userEmail}
                                onBlur={validateEmail}
                                onChange={(e) => setUserEmail(e.target.value)}
                                />
                                {emailError && <div style={{ color: 'red', height: '5px' }}>{emailError}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="Location" className="form-label">
                                Location
                                </label>
                                <input
                                type="text"
                                className="form-control"
                                id="Location"
                                value={userLocation}
                                onBlur={validateLocation}
                                onChange={(e) => setUserLocation(e.target.value)}
                                />
                                {locationError && <div style={{ color: 'red', height: '5px' }}>{locationError}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="Occupation" className="form-label">
                                Occupation
                                </label>
                                <input
                                type="text"
                                className="form-control"
                                id="Occupation"
                                value={userOccupation}
                                onBlur={validateOccupation}
                                onChange={(e) => setUserOccupation(e.target.value)}
                                />
                                {occupationError && <div style={{ color: 'red', height: '5px' }}>{occupationError}</div>}
                            </div>
                        </form>

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button onClick={handleSubmit} type="button" data-bs-dismiss="modal" class="btn btn-primary">Save changes</button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
