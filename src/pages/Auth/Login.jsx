import React, { useState } from 'react'
import Layout from "../../components/layout/Layout"
import { useAuth } from '../../context/auth'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import Footer from '../../components/layout/Footer'
import Header from '../../components/layout/Header'
import loginimage from '../../assets/loginimage.webp'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [auth, setAuth] = useAuth()


  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post("https://backend-ecom-9zf7.onrender.com/api/user/login", { email, password });
      if (response.data) {
        // console.log("response coming from login api okay : ", response.data)
        setAuth({
          ...auth,
          user: response.data.user,
          token: response.data.token
        });
        localStorage.setItem('auth', JSON.stringify(response.data))
        toast.success('Login Successful');
        navigate(location.state || "/")
      }
    } catch (error) {
      toast.error('Error logging in');
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
      <div className='login mt-4'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-6'>
              {/* Left Column for Image */}
              <img
                src={loginimage}
                alt='Your Image'
                className='img-fluid rounded'
              />
            </div>
            <div className='col-md-6'>
              {/* Right Column for Login Form */}
              <div className='login-wrapper'>
                <h3 className='text-center mb-4'>Login Page</h3>
                <form onSubmit={handleSubmit}>
                  <div className='mb-3'>
                    <input
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder='Enter Your Email'
                      type='email'
                      className='form-control'
                    />
                    <div className='form-text'></div>
                  </div>
                  <div className='mb-3'>
                    <input
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder='Enter Your Password'
                      type='password'
                      className='form-control'
                    />
                    <div className='form-text'></div>
                  </div>
                  <div className='text-center'>
                    <button type='submit' className='btn btn-primary'>
                      Login
                    </button>
                  </div>
                  <div className='text-center'>
                    <button
                      className='forget-password btn btn-secondary mt-2'
                      onClick={() => {
                        navigate('/forgetpassword');
                      }}
                    >
                      forgot password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Login