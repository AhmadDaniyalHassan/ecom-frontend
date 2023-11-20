import React, { useState, useEffect } from 'react'
import Layout from '../../components/layout/Layout'
import AdminMenu from '../../components/layout/AdminMenu'
import axios from 'axios'
import { Select } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
const { Option } = Select

const UpdateProduct = () => {
    const navigate = useNavigate()
    const params = useParams()

    const [categories, setCategories] = useState([])
    const [images, setImages] = useState([])
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [in_stock, setIn_stock] = useState(Boolean)
    const [category, setCategory] = useState('')
    const [prevImages, setPrevImages] = useState([]);
    // const [review, setReview] = useState('')
    const [id, setId] = useState('')


    const getSingleProduct = async () => {
        try {

            const { data } = await axios.get(`https://backend-ecom-9zf7.onrender.com/api/product/single-product/${params.slug}`)
            if (data?.success) {
                setName(data?.product.name)
                setDescription(data?.product.description)
                setPrice(data?.product.price)
                setCategory(data?.product.category._id)
                setId(data?.product._id)
                setPrevImg(data?.product.image[0])
            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getSingleProduct()
        //eslint-disable-next-line
    }, [])

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
            const formData = new FormData()
            formData.append('name', name)
            formData.append('description', description)
            formData.append('price', price)
            images && formData.append('images', images)
            formData.append('category', category)
            formData.append('in_stock', in_stock)
            // formData.append('rating', rating)
            // formData.append('review', review)

            const { data } = axios.put(`https://backend-ecom-9zf7.onrender.com/api/product/update-product/${id}`, formData)
            if (!data) {
                console.log(data)
                console.log('Updated Success')
                toast.success('Product Updated Successfully')
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message || 'Error In Updating Product');
        }

    }
    return (
        <Layout title='Update Product'>
            <button style={{ marginTop: 60, marginLeft: 15 }} className='btn btn-primary' onClick={() => navigate(-1)}>Go Back</button>
            <ToastContainer />
            <div className='container-fluid m-2 p-2'>
                <div className='row'>
                    <div className='col-md-3 mt-2'>
                        <AdminMenu />
                    </div>
                    <div className='col-md-9'>
                        <h2 className="text-center">Update Product</h2>
                        <div className='m-1'></div>
                        <form onSubmit={handleSubmit}>
                            <Select
                                bordered={false}
                                placeholder="Select a Category"
                                size='large'
                                showSearch
                                className='form-select mb-3'
                                onChange={(value) => { setCategory(value) }}
                                value={category}
                            >
                                {categories?.map((item) => (
                                    <Option value={item._id} key={item._id}>{item.name}</Option>
                                ))}
                            </Select>
                            <div className='mb-3'>
                                <label className='btn btn-outline-secondary col-md-12'>
                                    {images.length > 0 ? `${images.length} files selected` : 'Upload Product Images'}
                                    <input type='file' name='images' accept='images/*' hidden onChange={(e) => setImages(e.target.files)} multiple />
                                </label>
                            </div>
                            <div className='mb-3'>
                                {images.length > 0 ? (
                                    <div className='text-center'>
                                        {Array.from(images).map((file, index) => (
                                            <img key={index} src={URL.createObjectURL(file)} alt={`product image ${index + 1}`} className='img img-responsive' height='150px'></img>
                                        ))}
                                    </div>
                                ) : (
                                    <div className='text-center'>
                                        {prevImages.map((image, index) => (
                                            <img key={index} src={image} alt={`product image ${index + 1}`} className='img img-responsive' height='150px'></img>
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
                                <Select
                                    bordered={false}
                                    placeholder="Select Shipping Status"
                                    size='large'
                                    showSearch
                                    className='form-select mb-3'
                                    onChange={(value) => { setIn_stock(value) }}
                                    value={in_stock ? true : false}
                                >
                                    <Option value={true}>Yes Available</Option>
                                    <Option value={false}>Not Available</Option>
                                </Select>
                            </div>
                            <div className='mb-3'>
                                <button type='submit' className='btn btn-primary'>Update Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default UpdateProduct