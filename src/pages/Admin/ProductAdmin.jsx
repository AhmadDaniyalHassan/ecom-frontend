import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/layout/AdminMenu.jsx";
import Layout from "../../components/layout/Layout.jsx";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom'

const ProductAdmin = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate()

    // Get all products
    const getAllProducts = async () => {
        try {
            const { data } = await axios.get("http://localhost:8000/api/product/get-product");
            setProducts(data?.product);
        } catch (error) {
            console.log(error);
        }
    };

    // Lifecycle method
    useEffect(() => {
        getAllProducts();
    }, []);

    const handleDelete = async (productId) => {
        try {
            const { data } = await axios.delete(`http://localhost:8000/api/product/delete-product/${productId}`);
            console.log(data);
            getAllProducts();
        } catch (error) {
            console.log(error);
        }
    };
    const toggleFeatured = async (productId) => {
        try {
            await axios.put(`http://localhost:8000/api/product/toggle-featured/${productId}`);
            getAllProducts();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Layout>
            <button
                style={{ marginTop: 65, marginLeft: 15, marginBottom: 15 }}
                className='btn btn-primary'
                onClick={() => navigate(-1)}
            >Go Back</button>
            <div className='container-fluid m-1 p-3'>
                <div className="row">
                    <div className="col-md-2 ">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h2 className="text-center">Admin All Products</h2>
                        <div className="d-flex flex-wrap justify-content-center p-2">
                            {products?.map((product) => (
                                <div key={product._id} className="card m-1 card-admin" style={{ width: "100%", maxWidth: "16rem" }}>
                                    <img
                                        style={{ width: "100%", height: "10rem", padding: '4px', borderRadius: 10, objectFit: "cover" }}
                                        src={product?.images[0]}
                                        className="card-img-top"
                                        alt={product.name}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title mb-1"><b>Name: </b>{product.name}</h5>
                                        <p className="card-text mb-1"><b>Info: </b>{product?.description}</p>
                                        <p className='card-text mb-1'><b>Price: </b> {product?.price}</p>
                                        <p className='card-text mb-1'><b>Category: </b> {product?.category?.name}</p>
                                    </div>
                                    <div className="card-footer d-flex p-2" >
                                        <Link
                                            style={{ textDecoration: "none" }}
                                            to={`/dashboard/admin/update-product/${product.slug}`}
                                        >
                                            <button style={{ marginLeft: '4px', marginRight: "5px" }} className="btn btn-primary">Edit</button>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="btn btn-danger"
                                        >
                                            Delete
                                        </button>
                                        &nbsp;
                                        <button
                                            onClick={() => toggleFeatured(product._id)}
                                            className={`btn ${product.isFeatured ? 'btn-secondary' : 'btn-success'}`}
                                        >
                                            {product.isFeatured ? 'Unfeature' : 'Feature'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ProductAdmin;
