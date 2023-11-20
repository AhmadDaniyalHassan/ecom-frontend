import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import UserMenu from '../../components/layout/UserMenu';
import axios from 'axios';
import { useAuth } from '../../context/auth';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();

    const getOrders = async () => {
        try {
            if (auth?.token) {
                const { data } = await axios.get('https://backend-ecom-9zf7.onrender.com/api/user/orders');
                setOrders(data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getOrders();
    }, [auth?.token]);

    return (
        <Layout title='User-Order' description='Order Page'>
            <button
                style={{ marginTop: 25, marginLeft: 40 }}
                className='btn btn-primary'
                onClick={() => navigate(-1)}
            >
                Go Back
            </button>

            <div className='container-fluid m-3 p-3'>
                <div className='row'>
                    <div className='col-md-2 mt-5'>
                        <UserMenu />
                    </div>
                    <div className='col-md-9'>
                        <h2 className='text-center'>All Orders</h2>
                        {orders.map((order, i) => (
                            <div key={i} className='border shadow m-3 '>
                                <div className='table-responsive'>
                                    <table className='table mt-2 '>
                                        <thead>
                                            <tr className='text-center'>
                                                <th scope='col'>#</th>
                                                <th scope='col'>Status</th>
                                                <th scope='col'>Buyer</th>
                                                <th scope='col'>Email</th>
                                                <th scope='col'>Order Date</th>
                                                <th scope='col'>Payment Status</th>
                                                <th scope='col'>Payment Method</th>
                                                <th scope='col'>Total Products</th>
                                                <th scope='col'>Grand Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className='text-center'>
                                                <td>{i + 1}</td>
                                                <td>{order?.status}</td>
                                                <td>{order?.purchaser?.name}</td>
                                                <td>{order?.purchaser?.email}</td>
                                                <td>{moment(order?.createdAt).format('MMMM Do YYYY, h:mm a')}</td>
                                                <td>{order?.payment?.success ? 'Success' : 'Failed'}</td>
                                                <td>{order?.paymentMethod}</td>
                                                <td>{order?.products.length}</td>
                                                <td>{order.total}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <h3 className='mx-4'>Products</h3>
                                {order.products.map((prod, k) => (
                                    <div className='flex d-flex' key={k}>
                                        <img style={{ padding: '4px', width: '9rem', height: '9rem', marginTop: '2px', borderRadius: '10px' }}
                                            src={prod.image} className='card-img-top mx-4 my-2' alt={prod.name} />
                                        <div>
                                            <p className='m-2'><b>Product Name: </b> {prod.name}</p>
                                            <p className='m-2'><b>Quantity Of Each Ordered Product: </b> {prod.quantity}</p>
                                            <p className='m-2'><b>Price Without Shipment: </b> {prod.total || (Number(prod.price) * prod.quantity)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Order;
