import React, { useState, useEffect } from 'react'
import Layout from '../../components/layout/Layout'
import AdminMenu from '../../components/layout/AdminMenu'
import axios from 'axios'
import CategoryForm from '../../components/Form/CategoryForm'
import { Modal } from "antd"
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
const CreateCategory = () => {
    const navigate = useNavigate()


    const [category, setCategory] = useState([])
    const [name, setName] = useState('')
    const [visible, setVisible] = useState(false)
    const [selected, setSelected] = useState(null)
    const [updatedName, setUpdatedName] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {

            const { data } = await axios.post('https://backend-ecom-9zf7.onrender.com/api/category/create-category', { name })
            if (data?.success) {
                setName(''); // Clear the input field
                getAllCategory();
                toast.success(data.message || 'Category Created Successfully');

            }
        } catch (error) {
            console.log(error)
            toast.error(data.message || 'Error In Creating Category');

        }
    }

    const getAllCategory = async () => {
        try {

            const { data } = await axios.get('https://backend-ecom-9zf7.onrender.com/api/category/get-category')
            if (data?.success) {
                setCategory(data?.category)
            }

        } catch (error) {
            console.log(error)
            toast.error(data.message || 'Error In Fetching Category');
        }
    }

    useEffect(() => {
        getAllCategory()

    }, [])

    const handleUpdateSubmit = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.put(`https://backend-ecom-9zf7.onrender.com/api/category/update-category/${selected._id}`, { name: updatedName })
            if (data.success) {
                setSelected(null)
                setUpdatedName('')
                setVisible(false)
                getAllCategory()
                toast.success(data.message || 'Category Updated Successfully')
            }

        } catch (error) {
            console.log(error)
            toast.error(data.message || 'Error In Updating Category');
        }
    }
    const handleDeleteSubmit = async (pid) => {
        try {
            const { data } = await axios.delete(`https://backend-ecom-9zf7.onrender.com/api/category/delete-category/${pid}`)
            if (data.success) {
                getAllCategory()
                toast.success(data.message || 'Category Deleted Successfully')
            }

        } catch (error) {
            console.log(error)
            toast.error(data.message || 'Error In Deleting Category');
        }
    }

    return (
        <Layout title='Create Category'>
            <button
                style={{ marginTop: 65, marginLeft: 15, marginBottom: 15 }}
                className='btn btn-primary'
                onClick={() => navigate(-1)}
            >
                Go Back
            </button>
            <ToastContainer />
            <div className='container-fluid m-1 p-3'>
                <div className="row">
                    <div className="col-md-2">
                        <AdminMenu />
                    </div>
                    <div className='col-md-6'>
                        <h2 className="text-center">Create Category</h2>
                        <div className='p-2 mt-3 mb-1'>
                            <CategoryForm handleSubmit={handleSubmit} value={name} setValue={setName} />
                        </div>
                        <div className='w-100'>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {category?.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.name}</td>
                                            <td style={{ display: 'flex', textAlign: "center" }}>
                                                <button
                                                    className='btn btn-primary ms-2'
                                                    onClick={() => {
                                                        setVisible(true);
                                                        setUpdatedName(item.name);
                                                        setSelected(item)
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className='btn btn-danger ms-2'
                                                    onClick={() => { handleDeleteSubmit(item._id) }}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Modal
                            onCancel={() => setVisible(false)}
                            footer={null}
                            open={visible}
                        >
                            <CategoryForm
                                value={updatedName}
                                handleSubmit={handleUpdateSubmit}
                                setValue={setUpdatedName}
                            />
                        </Modal>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CreateCategory