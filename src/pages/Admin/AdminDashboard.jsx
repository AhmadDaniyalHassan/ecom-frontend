import React from 'react'
import Layout from '../../components/layout/Layout'
import AdminMenu from '../../components/layout/AdminMenu'
import { useAuth } from '../../context/auth'
import { useNavigate } from 'react-router-dom'
const AdminDashboard = () => {
    const navigate = useNavigate();



    const [auth] = useAuth()
    return (
        <Layout>
            <button style={{ marginTop: 65, marginLeft: 15, marginBottom: 15 }} className='btn btn-primary' onClick={() => navigate(-1)}>Go Back</button>
            <div className='container-fluid m-1 p-3 '>
                <div className='row'>
                    <div className='col-md-2 margin-admin'>
                        <AdminMenu />
                    </div>
                    <div className='col-md-10' style={{ marginTop: '85px' }}>
                        <div className='card w-50 p-2' style={{ backgroundColor: '#E8E8E8' }}>
                            <h3>Name: {auth?.user?.name}</h3>
                            <h3>Email: {auth?.user?.email}</h3>
                            <h3>Address: {auth?.user?.address}</h3>
                            <h3>Role: {auth?.user?.role === 1 ? "Admin" : "User"}</h3>
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

        </Layout>
    )
}

export default AdminDashboard