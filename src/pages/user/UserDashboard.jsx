import React, { useState } from 'react'
import Layout from "../../components/layout/Layout"
import UserMenu from '../../components/layout/UserMenu'
import { useAuth } from '../../context/auth'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Dashboard = () => {
    const navigate = useNavigate();
    const [unsubscribeLoading, setUnsubscribeLoading] = useState(false);
    const [auth, setAuth] = useAuth()

    const handleUnsubscribe = async () => {
        try {
            setUnsubscribeLoading(true);

            // Make an API request to unsubscribe
            const response = await axios.post('http://localhost:8000/api/user/unsubscribe-newsletter', {
                userId: auth?.user._id,
            });


            // Update the local auth state to reflect the new newsletter subscription status
            setAuth({
                ...auth,
                user: {
                    ...auth.user,
                    newsletterSubscribed: false,
                },
            });

            // You might also want to display a success message to the user
        } catch (error) {
            console.error('Error unsubscribing from the newsletter:', error);
            // Handle the error and possibly display an error message to the user
        } finally {
            setUnsubscribeLoading(false);
        }
    };

    return (

        < Layout title="Dashboard - User-Panel" >
            <button style={{ marginTop: 25, marginLeft: 40 }} className='btn btn-primary' onClick={() => navigate(-1)}>Go Back</button>

            <div className='container-fluid m-3 p-3'>
                <div className='row'>
                    <div className='col-md-2 mt-1'>
                        <UserMenu />
                    </div>
                    <div className='col md-9 small-user-dashboard' style={{ marginTop: '21px', marginLeft: '10px' }}>
                        <div className='card w-100 p-2 ' style={{ backgroundColor: '#E8E8E8' }}>
                            <h4>Name:<span className='h5'> {auth?.user.name}</span></h4>
                            <h4>Email:<span className='h5'> {auth?.user.email}</span></h4>
                            <h4>Address: <span className='h5'>{auth?.user.address}</span></h4>
                            {auth?.user.newsletterSubscribed && (
                                <button
                                    className={`btn btn-danger ${unsubscribeLoading && 'disabled'}`}
                                    onClick={handleUnsubscribe}
                                    disabled={unsubscribeLoading}
                                >
                                    {unsubscribeLoading ? 'Unsubscribing...' : 'Unsubscribe from Newsletter'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout >
    )
}

export default Dashboard