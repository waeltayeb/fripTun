import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Cart from '../components/Cart';
import { useCart } from '../context/CartContext';
import axios from 'axios';

function Checkout() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        avenue: '',
        city: '',
        postal: '',
        phone: ''
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { cart, getCartTotal, clearCart } = useCart();

    useEffect(() => {
        const fetchUserData = async () => {
            const id = localStorage.getItem('identifier');
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('role');
            if (token && role === '"client"') {
                setIsLoggedIn(true);
                const response = await axios.get(`http://localhost:5000/api/client/profile/${id}`);
                setFormData(response.data);
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e) => {
        if (!isLoggedIn) {
            setFormData(prev => ({
                ...prev,
                [e.target.name]: e.target.value
            }));
        }
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        try {
            const orderData = {
                firstname: formData.firstname,
                lastname: formData.lastname,
                email: formData.email,
                phone: formData.phone,
                shippingAddress: {
                    street: formData.avenue,
                    city: formData.city,
                    postalCode: formData.postal
                },
                items: cart.map(item => ({
                    articleId: item.id,
                    price: item.isSold ? item.newPrice : item.price
                })),
                totalAmount: getCartTotal()
            };

            // Add client ID if logged in
            if (isLoggedIn) {
                orderData.clientId = localStorage.getItem('identifier');
            }

            const headers = {
                'Content-Type': 'application/json'
            };

            // Add token if logged in
            if (isLoggedIn) {
                headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
            }

            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers,
                body: JSON.stringify(orderData),

            } ,
            setLoading(true) 
        );

            if (!response.ok) {
                setLoading(false);
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit order');

            }


            setLoading(false);
            clearCart();
            if (isLoggedIn) {
                navigate('/ClientDashboard');
            } else {
                navigate('/Shop');
            }
        } catch (err) {
            setError(err.message);
            console.error('Order submission error:', err);
        }
    };

    if (loading) {
        return (
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        );
      }

    return (
        <>
            <Navbar />
            
            <div className="container grid grid-cols-12 items-start pb-16 pt-4 gap-6">
                <div className="col-span-8">
                    <div className="border border-gray-200 p-6 rounded shadow-sm">
                        <h3 className="text-xl font-semibold capitalize mb-6">
                            {isLoggedIn ? 'Shipping Details' : 'Enter Your Details'}
                        </h3>
                        {error && (
                            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmitOrder}>
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-600 mb-2">
                                            First Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="firstname"
                                            value={formData.firstname}
                                            onChange={handleChange}
                                            disabled={isLoggedIn}
                                            required
                                            className="w-full px-4 py-2 border rounded focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-600 mb-2">
                                            Last Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="lastname"
                                            value={formData.lastname}
                                            onChange={handleChange}
                                            disabled={isLoggedIn}
                                            required
                                            className="w-full px-4 py-2 border rounded focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-600 mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={isLoggedIn}
                                        required
                                        className="w-full px-4 py-2 border rounded focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600 mb-2">
                                        Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="avenue"
                                        value={formData.avenue}
                                        onChange={handleChange}
                                        disabled={isLoggedIn}
                                        required
                                        className="w-full px-4 py-2 border rounded focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600 mb-2">
                                        City <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        disabled={isLoggedIn}
                                        required
                                        className="w-full px-4 py-2 border rounded focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600 mb-2">
                                        Postal Code <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="postal"
                                        value={formData.postal}
                                        onChange={handleChange}
                                        disabled={isLoggedIn}
                                        required
                                        className="w-full px-4 py-2 border rounded focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600 mb-2">
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        disabled={isLoggedIn}
                                        required
                                        className="w-full px-4 py-2 border rounded focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="block w-full py-3 px-4 text-center text-white bg-primary border border-primary rounded-md hover:bg-transparent hover:text-primary transition font-medium"
                                >
                                    Place Order
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="col-span-4">
                    <Cart />
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Checkout;