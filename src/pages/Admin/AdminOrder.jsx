import React, { useState, useEffect } from 'react'
import AdminMenu from '../../components/layout/AdminMenu'
import Layout from '../../components/layout/Layout'
import axios from 'axios'
import { useAuth } from '../../context/auth'
import moment from 'moment'
import { Select } from 'antd'
import { Option } from 'antd/es/mentions'
import { useNavigate } from 'react-router-dom'

const AdminOrder = () => {
    const navigate = useNavigate()

    const [status, setStatus] = useState(["Not Process", "Processing", "Shipped", "Delivered", "Cancelled"])
    const [changeStatus, setChangeStatus] = useState("")
    const [orders, setOrders] = useState([])
    const [auth, setAuth] = useAuth()

    const getOrders = async () => {
        try {
            const { data } = await axios.get('http://localhost:8000/api/user/all-orders')
            console.log(data)
            setOrders(data)
        } catch (error) { console.log(error) }
    }

    const handleDelete = async (orderId) => {
        try {
            const { data } = await axios.delete(`http://localhost:8000/api/user/delete-order/${orderId}`);

            getOrders(); // Refresh the order list after deletion
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (auth?.token) getOrders()

    }, [auth?.token])

    const handleChange = async (orderId, value) => {
        try {
            const { data } = await axios.put(`http://localhost:8000/api/user/order-status/${orderId}`, { status: value })
            getOrders()
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <Layout title={'Admin Orders'}>
            <button style={{ marginTop: 65, marginLeft: 15, marginBottom: 15 }} className='btn btn-primary' onClick={() => navigate(-1)}>Go Back</button>

            <div className='container-fluid m-1 p-3'>
                <div className="row">
                    <div className="col-md-2">
                        <AdminMenu />
                    </div>
                    <div className='col-md-10'>
                        <h2 className="text-center">Admin All Orders</h2>
                        {orders?.map((o, i) => (
                            <div key={i} className='border shadow my-4 p-3'>
                                <div className="table-responsive">
                                    <table className='table'>
                                        <thead>
                                            <tr className='text-center'>
                                                <th scope='col'>#</th>
                                                <th scope='col'>Status</th>
                                                <th scope='col'>Buyer</th>
                                                <th scope='col'>Email</th>
                                                <th scope='col'>Address</th>
                                                <th scope='col'>Phone</th>
                                                <th scope='col'>Order Date</th>
                                                <th scope='col'>Payment Status</th>
                                                <th scope='col'>Payment Method</th>
                                                <th scope='col'>Total Products</th>
                                                <th scope='col'>Grand Total</th>
                                                <th scope='col'>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className='text-center'>
                                                <td>{i + 1}</td>
                                                <td>
                                                    <Select defaultValue={o?.status} bordered={false} onChange={(value, orderId) => handleChange(o._id, value)}>
                                                        {status.map((s, i) => (
                                                            <Option key={i} value={s}>{s}</Option>
                                                        ))}
                                                    </Select>
                                                </td>
                                                <td>{o?.purchaser?.name}</td>
                                                <td>{o?.purchaser?.email}</td>
                                                <td>{o?.purchaser?.address}</td>
                                                <td>{o?.purchaser?.phone}</td>
                                                <td>{moment(o?.createdAt).format('MMMM Do YYYY, h:mm a')}</td>
                                                <td>{o?.payment?.success ? "Success" : "Failed"}</td>
                                                <td>{o?.paymentMethod}</td>
                                                <td>{o?.products?.length}</td>
                                                <td>{o?.total}</td>
                                                <td>
                                                    <button className='btn btn-danger mx-4 my-2' onClick={() => handleDelete(o._id)}>
                                                        Delete Order
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="container mt-1">
                                    <h3 className='mx-2 my-0'>Products</h3>
                                    <div className='d-flex flex-wrap'>
                                        {o.products.map((prod, k) => (
                                            <div className='card m-2' key={k} style={{ width: '19rem' }}>
                                                <img
                                                    style={{ margin: "auto", width: '80%', height: 'auto', objectFit: 'cover', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}
                                                    src={prod.images[0]} className='card-img-top' alt={prod.name}
                                                />
                                                <div className='card-body'>
                                                    <p className='card-title'><b>Name: </b> {prod.name}</p>
                                                    <p className='card-text'><b>Quantity Of Each Order Product: </b> {prod.quantity}</p>
                                                    <p className='card-text'><b>Price Without Shipment: </b> {prod.total || (Number(prod.price) * prod.quantity)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout >
    )
}

export default AdminOrder