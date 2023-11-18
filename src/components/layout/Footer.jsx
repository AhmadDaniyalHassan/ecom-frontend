import React, { useState } from 'react'
import facebook from '../../assets/facebook.png'
import whatsapp from '../../assets/whatsapp.png'
import instagram from '../../assets/instagram.png'
import { useAuth } from './../../context/auth'
import axios from 'axios'
import { Link } from 'react-router-dom'
const Footer = () => {
    const [subscriptionStatus, setSubscriptionStatus] = useState(null);
    const [email, setEmail] = useState('');
    const [auth, setAuth] = useAuth()
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Check if the user is authenticated
            if (!auth.user) {
                console.error('User not authenticated.');
                setLoading(false);
                // Handle the case where the user is not authenticated, possibly redirect to login
                return;
            }

            // Check if the user is already subscribed
            if (auth.user.newsletterSubscribed) {
                setSubscriptionStatus({
                    type: 'info',
                    message: 'You are already subscribed to the newsletter.',
                });
                setLoading(false);
                return;
            }

            // Make an API request to subscribe the user
            const response = await axios.post('https://backend-ecom-9zf7.onrender.com/api/user/subscribe-newsletter', {
                userId: auth?.user._id,
            });

            // Assuming your API response contains a success message

            // Update the local auth state to reflect the newsletter subscription status
            setAuth({
                ...auth,
                user: {
                    ...auth.user,
                    newsletterSubscribed: true,
                },
            });
            setSubscriptionStatus({ type: 'success', message: response.data.message });
            setEmail(''); // Clear the email input after successful subscription
        } catch (error) {
            console.error('Error subscribing to the newsletter:', error);
            // Handle the error and possibly display an error message to the user
            setSubscriptionStatus({ type: 'error', message: 'Error subscribing to the newsletter. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>

            <div>
                {/* Footer */}
                <footer className="text-center text-lg-start text-dark mt-4" style={{ backgroundColor: '#D1D1D1' }}>
                    {/* Section: Social media */}
                    <section className="d-flex justify-content-center p-4 text-dark" style={{ backgroundColor: '#D1D1D1' }}>
                        {/* Left */}
                        <section className="newsletter">
                            <div className="container">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="content">
                                            <form onSubmit={handleSubscribe}>
                                                <h2>Subscribe To Know About Us More</h2>
                                                <div className="input-group">
                                                    <input
                                                        name="email"
                                                        type="email"
                                                        className="form-control"
                                                        autoComplete="on"
                                                        placeholder="Enter your email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                    <span className="input-group-btn">
                                                        <button className="btn btn-secondary" type="submit" disabled={loading}>
                                                            {loading ? 'Subscribing...' : 'Subscribe Now'}
                                                        </button>
                                                    </span>

                                                </div>
                                            </form>

                                            {/* Display Subscription Status */}
                                            {subscriptionStatus && (
                                                <div className={`alert ${subscriptionStatus.type === 'success' ? 'alert-success' : 'alert-danger'}`} role="alert">
                                                    {subscriptionStatus.message}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </section>

                    <section>
                        <div className="container text-center text-md-start mt-5">
                            {/* Grid row */}
                            <div className="row mt-3">
                                {/* Grid column */}
                                <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                                    {/* Content */}
                                    <h6 className="text-uppercase fw-bold">Company name</h6>
                                    <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: 80, backgroundColor: '#000000', height: 2 }} />
                                    <p>
                                        Sample Text Description
                                    </p>
                                </div>
                                {/* Grid column */}
                                {/* Grid column */}
                                <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                                    {/* Links */}
                                    <h6 className="text-uppercase fw-bold">Products</h6>
                                    <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: 80, backgroundColor: '#000000', height: 2 }} />
                                    <p>
                                        <Link className="text-dark">About</Link>
                                    </p>
                                    <p>
                                        <Link className="text-dark">Contact Us</Link>
                                    </p>

                                </div>
                                {/* Grid column */}
                                {/* Grid column */}
                                <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                                    {/* Links */}
                                    <h6 className="text-uppercase fw-bold">Our Blog</h6>
                                    <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: 80, backgroundColor: '#000000', height: 2 }} />
                                    <p>
                                        <Link className="text-dark">Latest Article</Link>
                                    </p>
                                    <p>
                                        <Link className="text-dark">Feed</Link>
                                    </p>

                                </div>
                                {/* Grid column */}
                                {/* Grid column */}
                                <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                                    {/* Links */}
                                    <h6 className="text-uppercase fw-bold">Contact Us</h6>
                                    <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: 80, backgroundColor: '#000000', height: 2 }} />
                                    <p><i className="fas fa-home mr-3" /><span className='h6'>Address: </span> Karachi, Pakistan</p>
                                    <p><i className="fas fa-envelope mr-3" /><span className='h6'>Email: </span> info@example.com</p>
                                    <p><i className="fas fa-envelope mr-3" /><span className='h6'>Phone Number: </span> + 01 234 567 88</p>
                                    <h6>Follow Us On:&nbsp;
                                        <img src={facebook} style={{ marginRight: '8px' }} width={'24px'} />
                                        <img src={instagram} style={{ marginRight: '8px' }} width={'24px'} />
                                        <img src={whatsapp} width={'24px'} />
                                    </h6>
                                </div>
                                {/* Grid column */}
                            </div>
                            {/* Grid row */}
                        </div>
                    </section>
                    {/* Section: Links  */}
                    {/* Copyright */}
                    <div className="text-center p-3" style={{ backgroundColor: '#D1D1D1' }}>
                        © 2023 Copyright:&nbsp;
                        <a className="text-dark" >ORYA.com</a>
                    </div>
                    {/* Copyright */}
                </footer>
                {/* Footer */}
            </div>
        </div>

    )
}

export default Footer