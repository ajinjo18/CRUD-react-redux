import React, { useState, useEffect } from 'react'
import './AdminLogin.css'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { adminlogged, adminLogout } from '../../Redux/adminLogged/adminLoggedSlice';
import { useDispatch, useSelector } from 'react-redux';

const AdminLogin = () => {

    const adminName = 'ajin'
    const adminPassword = 123
    
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const isAdminLogged = useSelector(state => state.adminLogged.value)

    console.log(1111,isAdminLogged);

    useEffect(() => {
        if (isAdminLogged) {
          navigate('/adminhome');
        }
      }, [isAdminLogged, navigate]);


    const [name, setName] = useState('')
    const [password, setPassword] = useState('')

    const submit = () => {
        if(name == adminName && password == adminPassword){
            navigate('/adminhome')
            dispatch(adminlogged({value:true}))
        }
        else{
            toast.error('Invalid Admin');
        }
    }


  return (
    <div>
        <ToastContainer/>

        <section className="vh-100 gradient-custom">
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                    <div className="card bg-dark text-white" style={{ borderRadius: '1rem' }}>
                    <div className="card-body p-5 text-center">

                        <div className="mb-md-5 mt-md-4 pb-5">

                        <h2 className="fw-bold mb-2 text-uppercase">Admin Login</h2>
                        <p className="text-white-50 mb-5">Please enter your login and password!</p>

                        <form>
                            <div className="form-outline form-white mb-4">
                            <input
                                type="email"
                                id="typeEmailX"
                                className="form-control form-control-lg"
                                onChange={(e) => setName(e.target.value)}
                            />
                            <label className="form-label" htmlFor="typeEmailX">Name</label>
                            </div>

                            <div className="form-outline form-white mb-4">
                            <input
                                type="password"
                                id="typePasswordX"
                                className="form-control form-control-lg"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <label className="form-label" htmlFor="typePasswordX">Password</label>
                            </div>

                            <button className="btn btn-outline-light btn-lg px-5" type="button" onClick={submit}>Login</button>
                        </form>

                        </div>

                    </div>
                    </div>
                </div>
                </div>
            </div>
        </section>
    </div>
  );
}


export default AdminLogin
