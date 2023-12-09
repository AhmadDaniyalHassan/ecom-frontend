import React, { useState, useEffect } from 'react'
import Layout from '../../components/layout/Layout'
import AdminMenu from '../../components/layout/AdminMenu'
import axios from 'axios'
import { Select } from 'antd'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
const { Option } = Select
const CreateProduct = () => {
    const navigate = useNavigate()

    const [categories, setCategories] = useState([])
    const [images, setImages] = useState([])
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [inStock, setIn_Stock] = useState(Boolean)
    const [category, setCategory] = useState('')
    const [loading, setLoading] = useState(false); // Added loading state


    const getAllCategory = async () => {
        try {

            const { data } = await axios.get('https://backend-ecom-9zf7.onrender.com/api/category/get-category')
            if (data?.success) {
                setCategories(data?.category)
            }

        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getAllCategory()

    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true); // Set loading to true when the form is submitted
            const formData = new FormData()
            formData.append('name', name)
            formData.append('description', description)
            formData.append('price', price)
            formData.append('images', images)
            formData.append('category', category)
            formData.append('in_stock', inStock)
            for (const file of images) {
                formData.append('images', file);
            }
            const { data } = await axios.post('https://backend-ecom-9zf7.onrender.com/api/product/create-product', formData)
            if (data?.success) {
                toast.success(data?.message || 'Product Created Successfully');
                navigate("/dashboard/admin/products");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message || 'Error In Creating Product');
        } finally {
            setLoading(false); // Set loading back to false after the request is complete
        }
    }
    return (

        <Layout title='Create Product'>
            <button style={{ marginTop: 65, marginLeft: 15, marginBottom: 15 }} className='btn btn-primary' onClick={() => navigate(-1)}>Go Back</button>
            <ToastContainer />
            <div className='container-fluid m-1 p-3'>
                <div className="row">
                    <div className="col-md-2">
                        <AdminMenu />
                    </div>
                    <div className='col-md-6'>
                        <h2 className="text-center">Add Products</h2>
                        <div className='m-1'></div>
                        <form onSubmit={handleSubmit}>
                            <Select bordered={false}
                                placeholder="Select a Category"
                                size='large'
                                showSearch className='form-select mb-3' onChange={(value) => { setCategory(value) }} >
                                {categories?.map((item) => (
                                    <Option value={item._id} key={item._id}>{item.name}</Option>
                                ))}
                            </Select>
                            <div className='mb-3'>
                                <label className='btn btn-outline-secondary col-md-12'>
                                    {images.length > 0 ? `${images.length} files selected` : "Upload Product Images"}
                                    <input type='file' name='images' accept='images/*' hidden onChange={(e) => setImages(e.target.files)} multiple />
                                </label>
                            </div>

                            <div className='mb-3'>
                                {images.length > 0 && (
                                    <div className='text-center'>
                                        {Array.from(images).map((file, index) => (
                                            <img key={index} src={URL.createObjectURL(file)} alt={`product image ${index + 1}`} className='img img-responsive' height='150px'></img>
                                        ))}
                                    </div>
                                )}
                            </div>


                            <div className='mb-3'>
                                <input type='text' alt='name' className='form-control' placeholder='Enter Product Name' value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className='mb-3'>
                                <input type='text' alt='decription' className='form-control' placeholder='Enter Product Description' value={description} onChange={(e) => setDescription(e.target.value)} />
                            </div>

                            <div className='mb-3'>
                                <input type='number' alt='price' className='form-control' placeholder='Enter Product Price' value={price} onChange={(e) => setPrice(e.target.value)} />
                            </div>
                            <div className='mb-3'>
                                <Select bordered={false} placeholder="Select Shipping Status" size='large' showSearch className='form-select mb-3' onChange={(value) => { setIn_Stock(value) }} >
                                    <Option value={false}>Not Available</Option>
                                    <Option value={true}>Yes Available</Option>
                                </Select>
                            </div>
                            <div className='mb-3'>
                                <button type='submit' className='btn btn-primary' disabled={loading}>
                                    {loading ? 'Loading...' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CreateProduct