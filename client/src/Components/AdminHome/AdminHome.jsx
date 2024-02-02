import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminHome.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit,faTrash } from '@fortawesome/free-solid-svg-icons';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { AdminMsg } from '../ContextStore/AdminContext';
import { userAdded } from '../ContextStore/UserAdded';

import AddUser from '../AddUsers/AddUser';

import { useDispatch, useSelector } from 'react-redux';
import { adminLogout } from '../../Redux/adminLogged/adminLoggedSlice';
import { useNavigate } from 'react-router-dom';


const App = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [users, setUsers] = useState([])

  const { msg, addToMsg } = useContext(AdminMsg)
  const {isUserAdded,changeToUserAdded} = useContext(userAdded)

  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userLocation, setUserLocation] = useState('')

  const MySwal = withReactContent(Swal);

  const isAdminLogged = useSelector(state => state.adminLogged.value)

    console.log(1111,isAdminLogged);

  useEffect(() => {
      if (isAdminLogged) {
        navigate('/adminhome');
      }
      else{
        navigate('/admin')
      }
    }, [isAdminLogged, navigate]);


  useEffect(() => {
    try{
      const fetchUsers = async () => {
        const data = await axios.get('http://localhost:3001/users')
        .then(res=>{
          setUsers(res.data.user)
        })
        .catch(err=>console.log(err))
      }
      fetchUsers()
      changeToUserAdded(false)
    }
    catch(err){
      console.log(err);
    }
  },[isUserAdded])

  const submit = async (userId) => {

    try{
      const data = {
        name: userName,
        email: userEmail,
        location: userLocation
      }

      const response = await axios.post('http://localhost:3001/admin/edituser',{data,userId})

      if (response.data.message === 'User updated successfully') {
        console.log('User updated successfully:', response);
        changeToUserAdded(true)
        addToMsg('Successfully Updated');
      } 
      else {
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

  const handleDelete = (userId) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(userId);
      }
    });
  };

  const deleteUser = async (id) => {
    try{
      const response = await axios.post('http://localhost:3001/admin/deleteuser',{id})

      if (response.data.message === 'User Deleted') {
        console.log('User Deleted:', response);
        changeToUserAdded(true)
        addToMsg('User Deleted');
      } 
      else {
        console.error('Unexpected response:', response);
      }

    }
    catch(err){
      console.log(err);
    }
  }


  const logout = () => {
    dispatch(adminLogout())
    navigate('/admin')
  }
  

  return (
    <>
      {msg && <ToastContainer />}
      <div style={{marginTop:'60px'}} className="container">
        <div className="row">
          <div style={{textAlign:'end', marginBottom:'20px'}}>
          <button onClick={logout} className='btn btn-danger' >logout</button>
          </div>

          <AddUser />
          
          <div style={{background:'grey', padding:'20px', borderRadius:'20px'}} className="col-md-8">
            <h3>USERS</h3>
            <table className="table table-striped">
              <thead>
                <tr style={{textAlign:'center'}}>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Location</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody style={{textAlign:'center'}}>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.location}</td>
                    <td>
                      <button data-bs-toggle="modal" data-bs-target={`#exampleModal${index}`} style={{marginRight:'5px'}} className='btn btn-secondary'>
                        <FontAwesomeIcon icon={faEdit} /> Edit
                      </button>

                      <div class="modal fade" id={`exampleModal${index}`} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                          <div class="modal-content">
                            <div class="modal-header">
                              <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                              <form style={{textAlign:'start'}}>
                                <div className="mb-3">
                                  <label htmlFor="name" className="form-label">Name</label>
                                  <input type="text" className="form-control" id="name" defaultValue={user.name} onChange={(e) => setUserName(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                  <label htmlFor="email" className="form-label">Email</label>
                                  <input type="email" className="form-control" id="email" defaultValue={user.email} onChange={(e) => setUserEmail(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                  <label htmlFor="location" className="form-label">Location</label>
                                  <input type="text" className="form-control" id="location" defaultValue={user.location} onChange={(e) => setUserLocation(e.target.value)} />
                                </div>
                              </form>
                            </div>
                            <div class="modal-footer">
                              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                              <button onClick={() => submit(user._id)} type="button" class="btn btn-primary" data-bs-dismiss="modal">Save changes</button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button onClick={() => handleDelete(user._id)} className='btn btn-danger'>
                        <FontAwesomeIcon icon={faTrash} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
