import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import axios from 'axios';
import { useCart } from '../context/cart';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/auth';
import moment from 'moment';
import StarRatings from 'react-star-ratings';


const Product = () => {
    const [api, setApi] = useState([]);
    const [product, setProduct] = useState([]);
    const [cart, increaseQuantity, decreaseQuantity, setCart] = useCart();
    const [relatedProduct, setRelatedProduct] = useState([]);
    const params = useParams();
    const [reviews, setReviews] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [productId, setProductId] = useState('');
    const [questions, setQuestions] = useState([]);
    const [answerValues, setAnswerValues] = useState({});
    const [currentQuestionId, setCurrentQuestionId] = useState('');
    const [currentReviewId, setCurrentReviewId] = useState('');
    const [question, setQuestion] = useState('');
    const [limit, setLimit] = useState(5);
    const [title, setTitle] = useState('');
    const [questionPage, setQuestionPage] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const navigate = useNavigate();
    const [auth] = useAuth();
    const handleImageClick = (index) => {
        setCurrentImageIndex(index);
    };

    // Fetch reviews and products on component mount
    useEffect(() => {
        if (params?.slug) {
            getAllProduct();
            fetchReviews();
        }
    }, [params?.slug, productId, page, questionPage]);

    // Fetch questions when productId is available
    useEffect(() => {
        if (productId) {
            fetchQuestions();
        }
    }, [productId, questionPage, limit]);


    // Function to fetch reviews
    const fetchReviews = async () => {
        try {
            // Check if productId is defined and not empty
            if (!productId) {
                setLoading(false);
                return;
            }

            const response = await axios.get(`https://backend-ecom-9zf7.onrender.com/api/review/${productId}/get-reviews`, {
                params: { page: page },
            });
            setReviews(response?.data?.reviews);
            setLoading(false);
        } catch (error) {
            console.error('Error coming from reviews get request:', error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews(); // Make sure fetchReviews is defined in the same scope
    }, [productId]);

    // Function to fetch questions
    const fetchQuestions = async () => {
        try {
            const response = await axios.get(`https://backend-ecom-9zf7.onrender.com/api/review/get-questions/${productId}`,
                {
                    params: { questionPage: questionPage },
                });
            setQuestions(response?.data?.questions);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    // Function to handle form submission for posting a question
    const handleSubmitQuestion = async (e) => {
        e.preventDefault();

        if (!question || !title) {
            setError('Please provide both a question and a title.');
            return;
        }
        try {
            const response = await axios.post(`https://backend-ecom-9zf7.onrender.com/api/review/${productId}/post-questions`, {
                question,
                title,
                userId: auth?.user._id,
            });
            setQuestion('');
            setTitle('');
            fetchQuestions();
        } catch (error) {
            console.error('Error posting the question. Please try again later', error);
        }
    };

    // Function to update the answer for a question
    const updateAnswer = async (questionId, answer) => {
        try {
            const response = await axios.put(
                `https://backend-ecom-9zf7.onrender.com/api/review/${productId}/ans-questions/${questionId}`,
                { answer }
            );
            setQuestions((prevQuestions) => {
                return prevQuestions.map((question) => {
                    if (question._id === questionId) {
                        return { ...question, answer };
                    }
                    return question;
                });
            });
        } catch (error) {
            console.error('Error updating answer:', error);
        }
    };

    const deleteQuestion = async (questionId) => {
        try {
            const response = await axios.delete(`https://backend-ecom-9zf7.onrender.com/api/review/${productId}/delete-questions/${questionId}`);
            if (response.data.success) {
                // Filter out the deleted question from the local state
                setQuestions((prevQuestions) => prevQuestions.filter((question) => question._id !== questionId));
            } else {
                console.error('Error deleting question:', response.data.message);
            }
        } catch (error) {
            console.error('Error deleting question:', error);
        }
    };

    const deleteReview = async (reviewId) => {
        try {
            const response = await axios.delete(`https://backend-ecom-9zf7.onrender.com/api/review/${productId}/delete-review/${reviewId}`);
            if (response.data.success) {
                // Filter out the deleted review from the local state
                setReviews((prevReviews) => prevReviews.filter((review) => review._id !== reviewId));
            } else {
                console.error('Error deleting review:', response.data.message);
            }
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };


    // Handle the "Load More Reviews" button click
    const handleLoadMore = () => {
        setPage((prevPage) => prevPage + 1);
    };
    const handleLoadMoreQuestion = () => {
        setQuestionPage((prevPage) => prevPage + 1);
    };

    // Function to remove a product from the cart
    const removeFromCart = (pdata) => {
        const updatedCart = cart.filter((item) => item._id !== pdata._id);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    // Function to handle form submission for posting a review
    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!auth || !auth.user || !auth.user._id) {
            // Handle the case where auth or auth.user is not defined
            console.error('User information not available.');
            return;
        }

        try {
            const response = await axios.post(`https://backend-ecom-9zf7.onrender.com/api/review/${productId}/reviews`, {
                rating,
                comment,
                user: auth.user._id,
            });
            setReviews((prevReviews) => [response.data, ...prevReviews]);
            setRating(0);
            setComment('');
            fetchReviews();
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    // Function to calculate the average rating of reviews
    const calculateAverageRating = () => {
        if (reviews.length === 0) {
            return 0;
        }

        let totalRating = 0;
        for (const review of reviews) {
            totalRating += review.rating;
        }
        return totalRating / reviews.length;
    };
    const averageRating = calculateAverageRating();

    // Function to fetch the product and related products
    const getAllProduct = async () => {
        try {
            const { data } = await axios.get(`https://backend-ecom-9zf7.onrender.com/api/product/single-product/${params.slug}`);
            setProduct(data?.product);
            console.log(data?.product)
            getSimilarProduct(data?.product?._id, data?.product.category._id);
            setProductId(data?.product?._id);
        } catch (error) {
            console.log(error);
        }
    };

    // Function to add a product to the cart
    const handleAddToCart = (pdata) => {
        const existingProduct = cart.find((item) => item._id === pdata._id);

        if (existingProduct) {
            // If the product is already in the cart, remove it
            removeFromCart(pdata);
        } else {
            // If the product is not in the cart, add it
            const newProduct = { ...pdata, quantity: 1, total: pdata.price };
            setCart([...cart, newProduct]);
            localStorage.setItem('cart', JSON.stringify([...cart, newProduct]));
        }
    };

    const handleAddToCartRelated = (pdata) => {
        const existingProduct = cart.find((item) => item._id === pdata._id);

        if (existingProduct) {
            // If the related product is already in the cart, remove it
            removeFromCart(pdata);
        } else {
            // If the related product is not in the cart, add it
            const newProduct = { ...pdata, quantity: 1, total: pdata.price };
            setCart([...cart, newProduct]);
            localStorage.setItem('cart', JSON.stringify([...cart, newProduct]));
        }
    };

    // Function to get similar products
    const getSimilarProduct = async (pid, cid) => {
        try {
            const { data } = await axios.get(`https://backend-ecom-9zf7.onrender.com/api/product/similar-product/${pid}/${cid}`);
            setRelatedProduct(data?.products);
        } catch (error) {
            console.log(error, 'from similar products');
        }
    };
    return (
        <Layout title="Product-Single - Ecom" >
            <button style={{ marginTop: 15, marginLeft: 15 }} className='btn btn-primary' onClick={() => navigate(-1)}>Go Back</button>
            <section className="py-2">
                <div className="container px-4 px-lg-5 ">
                    <div className="row gx-4 gx-lg-5">
                        <div className="col-md-5">
                            {product?.images && product.images.length > 0 && (
                                <img
                                    className={`card-img-top mb-5 mb-md-0 p-4 pt-0 preview-image-single`}
                                    style={{
                                        borderRadius: "20px",
                                        transform: `scale(${currentImageIndex === 0 ? 1.25 : 1.30})`, // Increase size on hover
                                        transition: 'transform 0.5s',
                                        padding: '1rem'

                                    }}
                                    src={`${product.images[currentImageIndex].replace("upload/", "upload/q_auto,w_500,h_500/")}`}
                                    alt={`${product.name}-image-${currentImageIndex}`}
                                />
                            )}
                        </div>

                        <div className="col-md-5">
                            {product?.images && product.images.length > 0 ? (
                                <div className='single-product-relateive' >
                                    {product.images.map((imageUrl, index) => (
                                        <div key={index} style={{ display: 'flex', flexDirection: 'row' }}>
                                            <img
                                                className={`card-img-top mb-0 mb-md-0 ${index === currentImageIndex ? 'active-image' : 'small-image'}`}
                                                style={{
                                                    borderRadius: "20px",
                                                    cursor: 'pointer',
                                                    transition: 'transform 0.3s',
                                                }}
                                                src={`${imageUrl.replace("upload/", "upload/q_auto,w_500,h_500/")}`}
                                                alt={`${product.name}-image-${index}`}
                                                onClick={() => handleImageClick(index)}
                                                onMouseEnter={() => setCurrentImageIndex(index)} // Add this line for hover effect
                                            />

                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No images available</p>
                            )}
                        </div>

                        <div className="col-md-6 mt-2 mx-3 detail-single-product">
                            <h2 className="display-8 fw-bolder mb-1 "><span className='text-muted h3'>Name:</span> {product?.name}</h2>
                            <div className="lead mb-1">Category: {product?.category?.name}</div>
                            <p className="lead mb-1">Description: {product?.description}</p>
                            <StarRatings
                                rating={isNaN(averageRating) ? 0 : averageRating}
                                starRatedColor="gold"
                                starEmptyColor="lightgray"
                                starDimension="24px"
                                starSpacing="2px"
                            />
                            <div className="fs-4 mb-1">
                                <span>Price: {product?.price}&nbsp;&nbsp;</span>
                            </div>
                            <div className="d-flex">
                                {cart.find(item => item._id === product._id) ? (
                                    // Render the "Remove" button if the condition is false

                                    <button style={{ fontSize: "85%", overflow: 'hidden' }} className='btn btn-outline-dark mt-auto' onClick={() => removeFromCart(product)}>Remove From Cart</button>
                                ) : (
                                    // Render the "Add To Cart" button if the condition is true
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className='btn btn-outline-dark mt-auto'
                                        style={{ fontSize: "85%", overflow: 'hidden' }}
                                    >
                                        {cart.find(item => item._id === product._id) ? "Remove From Cart" : "Add To Cart"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className='row gx-4 gx-lg-5 row-cols-1 row-cols-md-2 row-cols-xl-2 justify-content-center'>
                <div className='mb-3'>
                    <form className='d-flex flex-column m-4' >
                        <h4 className='text-center mb-2'>Leave A Review</h4>
                        <div className="mb-3">
                            <label htmlFor="rating" className="form-label">Rating&nbsp;</label>
                            <StarRatings
                                rating={rating}
                                starRatedColor="gold"
                                starEmptyColor="lightgray"
                                starDimension="20px"
                                starSpacing="2px"
                                changeRating={setRating}
                            />
                        </div>
                        <div className="mb-2">
                            <textarea className="form-control" id="comment" placeholder='Give Review To This Product' value={comment} onChange={(e) => setComment(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary align-self-center mt-2 " onClick={handleSubmitReview}>Submit</button>
                    </form>
                </div>
                <div className='mb-1'>
                    <div className='flex d-flex flex-column justify-content-center m-4'>
                        <h4>Post a Question</h4>
                        <div>
                            <input className='form-control mb-2'
                                type="text"
                                id="title"
                                placeholder='Add Title of Your Question'
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <textarea className='form-control mb-1'
                                type="text"
                                id="question"
                                placeholder='Enter Your Question'
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                            />
                        </div>
                        <button className='btn btn-primary mt-2 align-self-center' onClick={handleSubmitQuestion}>Submit Question</button>
                    </div>
                </div>
            </div>


            <div className='d-flex flex-row flex-wrap justify-content-center '>
                {reviews.map((r, i) => (
                    <div className='card m-2' style={{ width: '20.0rem', height: '12rem', alignItems: 'center', padding: '4px', borderRadius: "12px" }} key={i}>
                        <div className='card-body'>
                            <h5 className='card-title mb-1'><b>Review: </b>{r.comment}</h5>
                            <StarRatings
                                rating={r?.rating}
                                starRatedColor="gold"
                                starEmptyColor="lightgray"
                                starDimension="20px"
                                starSpacing="2px"
                            />
                            <p className='card-text mb-1'><b>User:</b> {r?.user?.name}</p>
                            <p className='card-text'><b>Created At:</b> {moment(r?.createdAt).format('ddd, Do, MMM h:mm A ')}</p>
                            {auth?.user?.role === 1 && (
                                <button
                                    className='btn btn-danger'
                                    onClick={() => deleteReview(r?._id)}
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {!loading && reviews.length > 0 && (
                <div className='d-flex justify-content-center mt-2'>
                    <button className='btn btn-outline-dark mt-auto ' onClick={handleLoadMore}>
                        Load More Reviews
                    </button>
                </div>
            )}

            {/* Questions Section */}
            {loading || questions.length === 0 ? (
                <p className='text-center h5'>No Questions Found</p>
            ) : (
                <div className='d-flex flex-row flex-wrap justify-content-center'>
                    {questions.map((question) => (
                        <div className='card m-2' style={{ width: '24.0rem', height: '13rem', alignItems: 'center', padding: '4px', borderRadius: "12px" }} key={question._id}>
                            <div className='card-body'>
                                <h5 className='card-title mb-1'><b>Title: </b>{question.title}</h5>
                                <p className='card-text mb-1'><b>Question: </b>{question.question}</p>
                                <p className='card-text mb-1'><b>Created At:</b> {moment(question.createdAt).format('ddd, Do, MMM h:mm A ')}</p>
                                <p className='card-text mb-1'><b>User: </b>{question.userId.name}</p>
                                {question.answer ? (
                                    <div>
                                        <p className='card-text'><b>Answer: </b>{question.answer}</p>
                                        {auth?.user?.role === 1 && (
                                            <button
                                                className='btn btn-danger'
                                                onClick={() => deleteQuestion(question._id)}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    auth?.user?.role === 1 && (
                                        <div className='flex d-flex'>
                                            <input
                                                className='form-control'
                                                type="text"
                                                placeholder="Your Answer"
                                                value={answerValues[question._id] || ''}
                                                onChange={(e) => setAnswerValues({ ...answerValues, [question._id]: e.target.value })}
                                            />
                                            <button
                                                className='btn btn-primary'
                                                onClick={() => updateAnswer(question._id, answerValues[question._id])}
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {!loading && questions.length > 0 && (
                <div className='d-flex justify-content-center mt-2'>
                    <button className='btn btn-outline-dark mt-auto' onClick={handleLoadMoreQuestion}>
                        Load More Questions
                    </button>
                </div>
            )}
            <section className="py-2 bg-light">
                <div className="container px-2 px-lg-5 mt-1">
                    <h2 className="fw-bolder mb-2 text-center">Related products</h2>
                    <div style={{ justifyContent: 'center' }} className='d-flex flex-wrap'>
                        {relatedProduct?.map((pdata) => (
                            <div className='card m-2 ' style={{ width: "15.7rem", height: '21.9rem' }} key={pdata._id}>
                                <img style={{ height: "10rem", width: "15.0rem", padding: '4px', marginLeft: '6px', borderRadius: 10, objectFit: "cover" }} src={pdata.images[0]} className='card-img-top' alt={pdata.name} />
                                <div className='card-body p-0'>
                                    <h5 className='card-title mb-1' style={{ marginLeft: "9px" }}><b>Name: </b>{pdata?.name}</h5>
                                    <p className='card-text mb-1' style={{ marginLeft: "9px" }}><b>Info: </b>{pdata?.description.substring(0, 25)}...</p>
                                    <p className='card-text mb-1' style={{ marginLeft: "9px" }}><b>Price: </b> {pdata?.price}</p>
                                    <p className='card-text mb-1' style={{ marginLeft: "9px" }}><b>Category: </b> {pdata?.category?.name}</p>
                                </div>
                                <div style={{ height: '4.5rem', width: '100%' }} className='card-footer d-flex flex-direction-row justify-content-around gap-2 p-3'>
                                    {cart.find(item => item._id === pdata._id) ? (
                                        // Render the "Remove From Cart" button if the condition is true
                                        <button style={{ fontSize: "75%", overflow: 'hidden' }} className='btn btn-outline-dark mt-auto' onClick={() => removeFromCart(pdata)}>Remove From Cart</button>
                                    ) : (
                                        // Render the "Add To Cart" button if the condition is false
                                        <button
                                            onClick={() => handleAddToCartRelated(pdata)}
                                            className='btn btn-outline-dark mt-auto'
                                            style={{ fontSize: "75%", overflow: 'hidden' }}
                                        >
                                            {cart.find(item => item._id === pdata._id) ? "Remove From Cart" : "Add To Cart"}
                                        </button>
                                    )}
                                    <Link to={`/single-product/${pdata.slug}`} className='btn btn-primary mt-auto ' style={{ fontSize: "75%", overflow: 'hidden', display: 'inline-block' }}>Details</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </Layout >
    )
}

export default Product