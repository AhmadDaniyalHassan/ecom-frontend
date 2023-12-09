import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
import wishlistHeartFill from '../assets/wishlist-heart-fill.svg'
import { useWishlist } from '../context/wishlist'
import wishlists from '../assets/wishlists.svg'
import share from '../assets/share.svg'
import { useCart } from '../context/cart'

const FeaturedProducts = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [wishlistClicked, setWishlistClicked] = useState(false);
    const [wishlist, setWishlist] = useWishlist();
    const [cart, increaseQuantity, decreaseQuantity, setCart] = useCart();

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

    const getFeaturedProducts = async () => {
        try {
            const { data } = await axios.get("http://localhost:8000/api/product/get-featured-product");
            setFeaturedProducts(data);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getFeaturedProducts();
    }, [])

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
    return (
        <>
            {
                featuredProducts.length > 0 ? (
                    <>
                        <div className='col-md-10'>
                            <h4 className='text-center'>Featured Product</h4>
                        </div>
                        {featuredProducts.map(pdata => (
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
                    </>
                ) : null
            }
        </>
    )
}

export default FeaturedProducts