import React, { useState, useEffect } from 'react'
import Layout from '../../components/layout/Layout'
import UserMenu from '../../components/layout/UserMenu'
import axios from 'axios'
import { useAuth } from '../../context/auth'
import { useNavigate } from 'react-router-dom'

const UserProfile = () => {
    const navigate = useNavigate()


    const [auth, setAuth] = useAuth()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')


    const handleSubmit = async (e) => {
        e.preventDefault()

        const formdata = new FormData();
        formdata.append("name", name);
        formdata.append("email", email);
        formdata.append("password", password);
        formdata.append("phone", phone);
        formdata.append("address", address);

        try {
            const { data } = await axios.put("https://backend-ecom-9zf7.onrender.com/api/user/profile",
                { name, email, password, phone, address });
            if (data?.error) {
                console.log(data?.error, "error coming from update function")
            } else {
                setAuth({ ...auth, user: data?.updateUser })

                let ls = localStorage.getItem("auth")
                ls = JSON.parse(ls)
                ls.user = data?.updateUser

                localStorage.setItem("auth", JSON.stringify(ls))
                console.log("user updated successfully")

            }
        } catch (error) {
            console.log("Error from signup api", error)
        }

    }

    useEffect(() => {
        const { email, name, phone, address } = auth?.user
        setName(name)
        setEmail(email)
        setPhone(phone)
        setAddress(address)
    }, [auth?.user])

    return (
        <Layout title='User-Profile' description='Profile Page'>
            <button style={{ marginTop: 25, marginLeft: 40 }} className='btn btn-primary' onClick={() => navigate(-1)}>Go Back</button>

            <div className='container-fluid m-3 p-3'>
                <div className='row'>
                    <div className='col-md-2 mt-5'>
                        <UserMenu />
                    </div>
                    <div className='col md-9 '>
                        <div className='mx-3 mt-0'>
                            <div className='p-2'>
                                <h2 className='mb-0 text-center'>Update User Profile</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <h6 className="mx-1 mb-1 ">Name</h6>
                                        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter Your Name' type="text" className="form-control" />
                                    </div>

                                    <div className="mb-3">
                                        <h6 className="mx-1 mb-1">Email</h6>
                                        <input required value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter Your Email' type="email" className="form-control" />
                                    </div>

                                    <div className="mb-3">
                                        <h6 className="mx-1 mb-1">Password</h6>
                                        <input required value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter Your Password' type="password" className="form-control" />
                                    </div>

                                    <div className="mb-3">
                                        <h6 className="mx-1 mb-1">Phone Number</h6>
                                        <input required value={phone} onChange={(e) => setPhone(e.target.value)} type="text" placeholder='Enter Your Phone Number' className="form-control" />

                                    </div>

                                    <div className="mb-3">
                                        <h6 className="mx-1 mb-1">Address</h6>
                                        <input required value={address} onChange={(e) => setAddress(e.target.value)} placeholder='Enter Your Home Address' type="text" className="form-control" />

                                    </div>
                                    <div className='text-center'>
                                        <button type="submit" className="btn btn-primary mb-3">Update Profile</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default UserProfile