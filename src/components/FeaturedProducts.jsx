import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
const FeaturedProducts = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);

    const getFeaturedProducts = async () => {
        try {
            const { data } = await axios.get("https://backend-ecom-9zf7.onrender.com/api/product/get-featured-product");
            setFeaturedProducts(data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            {featuredProducts.map(prod => (
                <div className='card m-2' style={{ width: "15.7rem", height: '23rem' }}>
                    {/* Replace the placeholder data with actual data from your featured product */}
                    <img style={{ height: "10rem", width: "15.0rem", padding: '4px', marginLeft: '6px', borderRadius: 10, objectFit: "cover" }} src={prod.images[0]} className='card-img-top' alt="Featured Product" />
                    <div className='card-body p-0'>
                        <h5 className='card-title mb-1' style={{ marginLeft: "9px" }}><b>Name: </b>{prod.name}</h5>
                        <p className='card-text mb-1' style={{ marginLeft: "9px" }}><b>Info: </b>{prod.description}</p>
                        <p className='card-text mb-1' style={{ marginLeft: "9px" }}><b>Price: </b> {prod.price}</p>
                        <p className='card-text mb-1' style={{ marginLeft: "9px" }}><b>Category: </b> {prod.category}</p>
                        {/* Add wishlist and share functionality here if needed */}
                    </div>
                    <div style={{ height: '4.0rem', width: '100%' }} className='card-footer d-flex flex-direction-row justify-content-around gap-2 p-3'>
                        {/* You can customize the buttons or add more actions */}
                        <button className='btn btn-outline-dark mt-auto' onClick={() => {/* Handle button click */ }}>Action</button>
                        <Link to={`/single-product/featured-product-slug`} className='btn btn-primary mt-auto ' style={{ fontSize: "75%", overflow: 'hidden', display: 'inline-block' }}>Details</Link>
                    </div>
                </div>
            ))}
        </>
    )
}

export default FeaturedProducts