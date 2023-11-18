import React, { useState, useEffect } from 'react'
import Layout from "../components/layout/Layout"
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Checkbox, Radio } from 'antd'
import { useCart } from '../context/cart'
import { useWishlist } from '../context/wishlist'
import wishlists from '../assets/wishlists.svg'
import { Prices } from '../components/Prices'
import wishlistHeartFill from '../assets/wishlist-heart-fill.svg'
import share from '../assets/share.svg'
import Hero from '../components/Hero.jsx'
const HomePage = () => {

    const [product, setProduct] = useState([]);
    const [category, setCategory] = useState([]);
    const [checked, setChecked] = useState([]);
    const [radio, setRadio] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [cart, increaseQuantity, decreaseQuantity, setCart] = useCart();
    const [wishlist, setWishlist] = useWishlist();
    const [loading, setLoading] = useState(false);
    const [productId, setProductId] = useState('')
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [featuredCart, setFeaturedCart] = useState([]); // Separate cart for featured products
    const [wishlistClicked, setWishlistClicked] = useState(false);

    const getAllProduct = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(`https://backend-ecom-9zf7.onrender.com/api/product/product-list/${page}`)
            setLoading(false)
            setProduct(data?.products)
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    const getFeaturedProducts = async () => {
        try {
            const { data } = await axios.get("https://backend-ecom-9zf7.onrender.com/api/product/get-featured-product");
            setFeaturedProducts(data);
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        if (page === 1) return
        loadMore()
    }, [page])
    const handleShare = async (product) => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: product.name,
                    text: product.description,
                    url: `${window.location.origin}/single-product/${product.slug}`
                });
            } else {
                // Fallback for browsers that do not support the Web Share API
                console.log('Web Share API not supported');
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };
    const loadMore = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(`https://backend-ecom-9zf7.onrender.com/api/product/product-list/${page}`)
            setLoading(false)
            setProduct([...product, ...data?.products])

        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }
    const getTotal = async () => {
        try {
            const { data } = await axios.get(`https://backend-ecom-9zf7.onrender.com/api/product/product-count`)
            setTotal(data?.total)
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        getTotal(); getCategory();

    }, [])

    const getCategory = async () => {
        try {
            const { data } = await axios.get(`https://backend-ecom-9zf7.onrender.com/api/category/get-category`)
            if (data?.success) {
                setCategory(data?.category)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const removeFromCart = (itemId) => {
        const updatedCart = cart.filter((item) => item._id !== itemId);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const handleAddToCart = (product) => {
        const existingProduct = cart.find((item) => item._id === product._id);


        if (existingProduct) {
            // If the product already exists in the cart, increase its quantity by 1
            updateQuantity(existingProduct._id, existingProduct.quantity + 1);
        } else {
            // If it's a new product, add it to the cart with a quantity of 1
            const newProduct = { ...product, quantity: 1, total: product.price }; // Set the initial total price
            setCart([...cart, newProduct]);
            localStorage.setItem('cart', JSON.stringify([...cart, newProduct]));
        }
    };

    const handleWishlistClick = (product) => {
        const isProductInWishlist = wishlist.some((item) => item._id === product._id);

        if (isProductInWishlist) {
            // Product is in the wishlist, remove it
            const updatedWishlist = wishlist.filter((item) => item._id !== product._id);
            setWishlist(updatedWishlist);
            localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        } else {
            // Product is not in the wishlist, add it
            setWishlist([...wishlist, product]);
            localStorage.setItem('wishlist', JSON.stringify([...wishlist, product]));
        }

        // Set the wishlistClicked state for the specific product
        setWishlistClicked(product._id);

        // Reset the click state after a short delay to allow the transition to complete
        setTimeout(() => {
            setWishlistClicked(null);
        }, 300); // Adjust the delay based on your transition duration
    };

    const handleFilter = (value, id) => {

        let allChecked = [...checked]
        if (value) {
            allChecked.push(id)
        } else {
            allChecked = allChecked.filter(item => item !== id)
        }
        setChecked(allChecked)
    }


    useEffect(() => {
        if (!checked.length || !radio.length) getAllProduct();
        //eslint-disable-next-line
    }, [checked.length, radio.length])


    useEffect(() => {
        if (checked.length || radio.length) filterProduct()

    }, [checked, radio])

    const filterProduct = async () => {
        try {
            const { data } = await axios.post(`https://backend-ecom-9zf7.onrender.com/api/product/filter-product`, { checked, radio })
            setProduct(data?.product)

        } catch (error) {
            console.log(error)
        }
    }


    return (
        <Layout title={"HomePage - Ecom"}>
            <Hero />
            <div className='row mt-3'>
                <div className='col-md-2'>
                    <h4 className='text-center'>Filters By Price</h4>
                    <div className='d-flex flex-column ms-2 p-1 gap-2 m-1 mt-2 '>
                        <Radio.Group onChange={e => setRadio(e.target.value)}>
                            {Prices?.map(p => (
                                <div key={p._id}>
                                    <Radio className='radio-price' value={p.array}>{<h6>{p.name}</h6>}</Radio>
                                </div>
                            ))}</Radio.Group>
                    </div>
                    <div className='button-reset'>
                        <button className='btn btn-danger ' onClick={() => { window.location.reload() }}>Reset Filters</button>
                    </div>
                </div>
                <div className='col-md-10'>
                    <h4 className='text-center'>Home Page</h4>
                    <div className='d-flex flex-row ms-3 p-1 gap-2 m-2 mt-2 justify-content-center'>
                        {category.map(cat => (
                            <Checkbox key={cat._id} name='category' onChange={(e) => handleFilter(e.target.checked, cat._id)}>
                                <h6 className='p-0 m-0' >{cat.name}</h6>
                            </Checkbox>
                        ))}
                    </div>
                    <div style={{ justifyContent: 'center' }} className='d-flex flex-wrap'>
                        {product?.map((pdata) => (
                            <div className='card m-2 ' style={{ width: "15.7rem", height: '23rem' }} key={pdata._id}>
                                <img style={{ height: "10rem", width: "15.0rem", padding: '4px', marginLeft: '6px', borderRadius: 10, objectFit: "cover" }} src={pdata.images[0]} className='card-img-top' alt={pdata.name} />
                                <div className='card-body p-0'>
                                    <h5 className='card-title mb-1' style={{ marginLeft: "9px" }}><b>Name: </b>{pdata?.name}</h5>
                                    <p className='card-text mb-1' style={{ marginLeft: "9px" }}><b>Info: </b>{pdata?.description.substring(0, 25)}...</p>
                                    <p className='card-text mb-1' style={{ marginLeft: "9px" }}><b>Price: </b> {pdata?.price}</p>
                                    <p className='card-text mb-1' style={{ marginLeft: "9px" }}><b>Category: </b> {pdata?.category?.name}</p>
                                    <img
                                        onClick={() => handleWishlistClick(pdata)}
                                        src={wishlist.some((item) => item._id === pdata._id) ? wishlistHeartFill : wishlists}
                                        alt="wishlist"
                                        width="20px"
                                        height="20px"
                                        className={`wishlist-icon mx-2${wishlistClicked === pdata._id ? ' fade-out' : ''}`}
                                        style={{ transition: 'opacity 0.3s ease-in-out' }}

                                    />
                                    <a onClick={() => handleShare(pdata)}>
                                        <img
                                            style={{ height: '20px', width: "20px", cursor: 'pointer' }}
                                            src={share}
                                            className='card-img-top'
                                            alt={pdata.name}
                                        />
                                    </a>
                                </div>
                                <div style={{ height: '4.0rem', width: '100%' }} className='card-footer d-flex flex-direction-row justify-content-around gap-2 p-3'>
                                    {cart.find(item => item._id === pdata._id) ? (
                                        // Render the "Add To Cart" button if the condition is true

                                        <button style={{ fontSize: "75%", overflow: 'hidden' }} className='btn btn-outline-dark mt-auto' onClick={() => removeFromCart(pdata._id)}>Remove From Cart</button>
                                    ) : (
                                        // Render the "Remove" button if the condition is false
                                        <button
                                            onClick={() => handleAddToCart(pdata)}
                                            className='btn btn-outline-dark mt-auto'
                                            style={{ fontSize: "75%", overflow: 'hidden' }}
                                        >
                                            {cart.find(item => item._id === pdata._id)} Add To Cart
                                        </button>
                                    )}
                                    <Link to={`/single-product/${pdata.slug}`} className='btn btn-primary mt-auto ' style={{ fontSize: "75%", overflow: 'hidden', display: 'inline-block' }}>Details</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='m-2 p-2'>
                        {product && product.length < total && radio.length === 0 && (
                            <button className='btn  text-light bg-success
                            loadmore' onClick={(e) => {
                                    e.preventDefault()
                                    setPage(page + 1)
                                }}>
                                {loading ? "Loading.." : "Load-More.."}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default HomePage