import React, { useEffect, useState } from 'react'
import Layout from '../../components/layout/Layout'
import { useNavigate } from 'react-router-dom'
import AdminMenu from '../../components/layout/AdminMenu'
import userProfile from '../user/UserProfile'
import axios from 'axios'

const Misc = () => {
    const [coupon, setCoupon] = useState([])
    const navigate = useNavigate()
    async function fetchData() {
        try {
            const response = await axios.get('http://localhost:8000/api/coupon/generate-coupon');
            const resp = response.data;


            // Now you can use the 'resp' variable to access the data from the response
            console.log(resp);

            // Do whatever you need to do with the data here
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    async function deleteData() {
        try {
            const response = await axios.delete('http://localhost:8000/api/coupon/delete-all-coupons');
            const resp = response.data;
            // Now you can use the 'resp' variable to access the data from the response
            setCoupon([]);


            // Do whatever you need to do with the data here
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const getCoupon = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/coupon/get-coupon');
            const cop = response.data;
            setCoupon(cop)
        } catch (error) {
            console.log(error);
        }
    }
    // Call the function to initiate the process
    useEffect(() => {
        getCoupon()
    }, [fetchData])

    return (
        <>
            <Layout>
                <button style={{ marginTop: 65, marginLeft: 15, marginBottom: 15 }} className='btn btn-primary' onClick={() => navigate(-1)}>Go Back</button>
                <div className='container-fluid m-3 p-3'>
                    <div className="row">
                        <div className="col-md-2 margin-admin">
                            <AdminMenu />
                        </div>
                        <div className='col-md-3 ' style={{ marginTop: '60px' }}>
                            <div className='mb-2'>
                                <button onClick={fetchData} className='btn btn-primary'>Generate Coupon</button>
                                <button onClick={deleteData} className='btn btn-danger' style={{ marginLeft: '10px' }}>Delete All Coupon</button>

                            </div>
                            {coupon?.map((product, id) => (
                                <div key={id} className='card w-50 p-2' >
                                    <p>{product.code}</p>
                                    <p>{product.generatedAt}</p>
                                    <p>{product.discount}</p>
                                    <p>{product.usedBy}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </Layout >
        </>
    )
}

export default Misc