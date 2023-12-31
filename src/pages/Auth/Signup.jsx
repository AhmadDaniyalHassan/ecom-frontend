import React, { useState } from 'react'
import axios from 'axios'
import Layout from "../../components/layout/Layout"
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/auth'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

const Signup = () => {

    const [auth, setAuth] = useAuth()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [role, setRole] = useState('')

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formdata = new FormData();
        formdata.append("name", name);
        formdata.append("email", email);
        formdata.append("password", password);
        formdata.append("phone", phone);
        formdata.append("address", address);
        formdata.append("role", role);

        try {
            const response = await axios.post("https://backend-ecom-9zf7.onrender.com/api/user/signup",
                { name, email, password, phone, address, role });
            if (response && response.data.success) {
                toast.success('Signup Successful');
                navigate('/login')
            }
        } catch (error) {
            console.log("Error from signup api", error)
            toast.error('Error Signup');
        }

    }
    const handleNavigation = () => {
        if (auth.user) {
            navigate("/")
        }
    }
    handleNavigation()
    return (
        <>
            <Header />
            <ToastContainer />
            <div className=' signup-bg mt-4'>
                <div className='signup'>
                    <div className=' p-2 signup-wrapper'>
                        <h3 className='mb-3 text-center'>Signup Page</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <input required value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter Your Name' type="text" className="form-control" />
                                <div className="form-text"></div>
                            </div>

                            <div className="mb-3">
                                <input required value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter Your Email' type="email" className="form-control" />
                                <div id="emailHelp" className="form-text"></div>
                            </div>

                            <div className="mb-3">
                                <input required value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter Your Password' type="password" className="form-control" />
                            </div>

                            <div className="mb-3">
                                <input required value={phone} onChange={(e) => setPhone(e.target.value)} type="text" placeholder='Enter Your Phone Number' className="form-control" />
                                <div className="form-text"></div>
                            </div>

                            <div className="mb-3">
                                <input required value={address} onChange={(e) => setAddress(e.target.value)} placeholder='Enter Your Home Address' type="text" className="form-control" />
                                <div className="form-text"></div>
                            </div>
                            <div style={{ textAlign: 'center' }} className="mb-3">
                                <input name='role' value={1} onChange={(e) => setRole(e.target.value)} type="radio" />Admin &nbsp;
                                <input name='role' value={0} onChange={(e) => setRole(e.target.value)} type="radio" />User
                                <div className="form-text"></div>
                            </div>

                            <div className='text-center'>
                                <button type="submit" className="btn btn-primary mb-3">Sign Up</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Signup