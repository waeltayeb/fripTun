import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Cart from '../components/Cart';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';


function Checkout() {
    const navigate = useNavigate();
    const [isloggedin, setisloggedin] = useState(true);
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
            
            // Check if the user is logged in based on token and role
            if (token && role === '"client"') {
                setisloggedin(true);
                // Set to true if the user is authenticated
                try {
                    const response = await axios.get(`http://localhost:5000/api/client/profile/${id}`);
                    setFormData(response.data); // Set the user profile data
                } catch (error) {
                    console.log("Error fetching user data:", error);
                }
            } else {
                setisloggedin(false);
                 // Set to false if no valid token or wrong role
            }
        };

        fetchUserData(); // Call the async function when component mounts

    }, []);

    const handleChange = (e) => {
        if (!isloggedin) {
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
            if (isloggedin) {
                orderData.clientId = localStorage.getItem('identifier');
            }

            const headers = {
                'Content-Type': 'application/json'
            };

            // Add token if logged in
            if (isloggedin) {
                headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
            }

            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers,
                body: JSON.stringify(orderData),

            } 
            );

            if (!response.ok) {
                setLoading(false);
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit order');

            }


            setLoading(false);
            clearCart();
            if (isloggedin) {
                navigate('/ClientDashboard');
            } else {
                navigate('/Shop');
            }
        } catch (err) {
            setError(err.message);
            console.error('Order submission error:', err);
        }
    };




    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
    
        try {
          const paymentData = {
            firstname: formData.firstname,
            lastname: formData.lastname,
            email: formData.email,
            phone: formData.phone,
            shippingAddress: {
              street: formData.avenue,
              city: formData.city,
              postalCode: formData.postal,
            },
            items: cart.map((item) => ({
              articleId: item.id,
              price: item.isSold ? item.newPrice : item.price,
            })),
            totalAmount: getCartTotal(),
          };

          localStorage.setItem("paymentData", JSON.stringify(paymentData));
    
          if (isloggedin) {
            paymentData.clientId = localStorage.getItem("identifier");
          }
    
          const response = await fetch("http://localhost:5000/api/payment", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData),
          });

          console.log(response);

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to process payment");
          }

          const paymentUrl = await response.json(); // Assuming the response contains a URL
          if (paymentUrl && paymentUrl.result) {
             setLoading(true);
              window.location.href = paymentUrl.result.link; // Redirect to the payment page
          } else {
              throw new Error("Invalid payment response");
          }
        } catch (err) {
          setError(err.message);
          console.error("Erreur lors du traitement du paiement :", err);
        } finally {
          setLoading(false);
        }
      };

      const [searchParams] = useSearchParams();
      const [result, setResult] = useState("");

      useEffect(() => {
        setLoading(true);
        setError(null);
      
        const processPayment = async () => {
          try {
            const paymentId = searchParams.get('payment_id');
            if (paymentId) {
                            // 1. Vérification du paiement
            const res = await axios.post(`http://localhost:5000/api/payment/${paymentId}`);
            setResult(res.data.result?.status || "FAILED");
      
            if (res.data.result.status === "SUCCESS") {
              // 2. Récupération des données de commande depuis localStorage
              let orderData = localStorage.getItem("paymentData");
              orderData = JSON.parse(orderData);
                if (orderData) {
                                  // Ajouter l'ID du client si l'utilisateur est connecté
              if (isloggedin) {
                const clientId = localStorage.getItem('identifier');
                if (clientId) {
                  orderData.clientId = clientId;
                }
              }
      
              // Headers pour la requête
              const headers = {
                'Content-Type': 'application/json',
              };
              if (isloggedin) {
                const token = localStorage.getItem('token');
                if (token) {
                  headers.Authorization = `Bearer ${token}`;
                }
              }
      
              // 3. Envoi des données de commande
              const response = await fetch('http://localhost:5000/api/ordersByCard', {
                method: 'POST',
                headers,
                body: JSON.stringify(orderData),
              });
      
              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Échec de la soumission de la commande');
              }
      
              // 4. Succès : Nettoyage et redirection
              alert("Paiement réussi ! Cliquez sur OK pour continuer.");
              clearCart();
              localStorage.removeItem('paymentData');
              navigate(isloggedin ? '/ClientDashboard' : '/Shop');
                }

            } else {
              navigate('/checkout');
            }
            }
      

          } catch (err) {
            console.error('Erreur de traitement du paiement:', err.message);
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };
      
        processPayment();
      }, [searchParams, isloggedin, navigate, clearCart]);
      
      
      

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
                            {isloggedin ? 'Shipping Details' : 'Enter Your Details'}
                        </h3>
                        {error && (
                            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmitOrder} >
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
                                            disabled={isloggedin}
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
                                            disabled={isloggedin}
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
                                        disabled={isloggedin}
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
                                        disabled={isloggedin}
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
                                        disabled={isloggedin}
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
                                        disabled={isloggedin}
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
                                        disabled={isloggedin}
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
                                <button
                                    onClick={handlePayment}
                                    type="button"
                                    className="block w-full py-3 px-4 text-center text-white bg-primary border border-primary rounded-md hover:bg-transparent hover:text-primary transition font-medium"
                                >
                                    Pay with Card
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