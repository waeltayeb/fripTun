import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirm: '',
        phone: '',
        city: '',
        avenue: '',
        postal: '',
        
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const apiUrl = process.env.REACT_APP_API_URL_REGISTER || 'http://localhost:5000/api/user/register';
   



   useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');

      if (token) {
        try {
          const roleValue = JSON.parse(role);
          // Redirect based on role
          if (roleValue === 'admin') {
            navigate('/admin');
          } else if (roleValue === 'client') {
            navigate('/ClientDashboard');
          }
        } catch (error) {
          // Handle invalid role format
          localStorage.removeItem('token');
          localStorage.removeItem('role');
        }
      }
    };

    checkAuth();
  }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Basic validation
        if (!formData.firstname || !formData.lastname || !formData.email || !formData.password || !formData.confirm) {
            setError('Please fill in all required fields');
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirm) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${apiUrl}`, {
                firstname: formData.firstname,
                lastname: formData.lastname,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                city: formData.city,
                avenue: formData.avenue,
                postal: formData.postal
            });

            if (response.data) {
                // Registration successful
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="contain py-16">
                <div className="max-w-lg mx-auto shadow px-6 py-7 rounded overflow-hidden">
                    <h2 className="text-2xl uppercase font-medium mb-1">Create an account</h2>
                    <p className="text-gray-600 mb-6 text-sm">
                        Register for new customer
                    </p>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} autoComplete="off" method='post'>
                        <div className="space-y-2">
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

                                <div>
                                <label htmlFor="firstname" className="text-gray-600 mb-2 block">First Name</label>
                                <input 
                                    type="text" 
                                    name="firstname" 
                                    id="firstname"
                                    value={formData.firstname}
                                    onChange={handleChange}
                                    required
                                    className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                                    placeholder="fulan " 
                                />
                                </div>
                                <div>
                                <label htmlFor="lastname" className="text-gray-600 mb-2 block">Last Name</label>
                                <input 
                                    type="text" 
                                    name="lastname" 
                                    id="lastname"
                                    value={formData.lastname}
                                    onChange={handleChange}
                                    required
                                    className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                                    placeholder="ben fulana" 
                                />
                                </div>
                               
                            </div>
                            <div>
                                <label htmlFor="email" className="text-gray-600 mb-2 block">Email address</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                                    placeholder="youremail.@domain.com" 
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="text-gray-600 mb-2 block">Password</label>
                                <input 
                                    type="password" 
                                    name="password" 
                                    id="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                                    placeholder="*******" 
                                />
                            </div>
                            <div>
                                <label htmlFor="confirm" className="text-gray-600 mb-2 block">Confirm password</label>
                                <input 
                                    type="password" 
                                    name="confirm" 
                                    id="confirm"
                                    value={formData.confirm}
                                    onChange={handleChange}
                                    required
                                    className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                                    placeholder="*******" 
                                />
                            </div>
                        </div>
                        <p className="text-gray-600 mt-6 text-lg font-medium">
                            Address shipping:
                        </p>
                        <div className="space-y-2">
                            <div>
                                <label htmlFor="phone" className="text-gray-600 mb-2 block">Phone Number:</label>
                                <input 
                                    type="number" 
                                    maxLength={8} 
                                    name="phone" 
                                    id="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                                    placeholder="22 222 222" 
                                />
                            </div>
                            <div>
                                <label htmlFor="city" className="text-gray-600 mb-2 block">City:</label>
                                <input 
                                    type="text"  
                                    name="city" 
                                    id="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                    className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                                    placeholder="Ex: Hammamet" 
                                />
                            </div>
                            <div>
                                <label htmlFor="avenue" className="text-gray-600 mb-2 block">Rue:</label>
                                <input 
                                    type="text"  
                                    name="avenue" 
                                    id="avenue"
                                    value={formData.avenue}
                                    onChange={handleChange}
                                    required
                                    className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                                    placeholder="Ex: avenue behy adghem hammamet" 
                                />
                            </div>
                            <div>
                                <label htmlFor="postal" className="text-gray-600 mb-2 block">Code Postal:</label>
                                <input 
                                    type="number" 
                                    name="postal" 
                                    id="postal"
                                    value={formData.postal}
                                    onChange={handleChange}
                                    required
                                    className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                                    placeholder="Ex: 5050" 
                                />
                            </div>
                        </div>
                        <div className="mt-6">
                            <div className="flex items-center">
                                <input 
                                    type="checkbox" 
                                    name="aggrement" 
                                    id="aggrement"
                                    required
                                    className="text-primary focus:ring-0 rounded-sm cursor-pointer" 
                                />
                                <label htmlFor="aggrement" className="text-gray-600 ml-3 cursor-pointer">
                                    I have read and agree to the <a href="/" className="text-primary">terms & conditions</a>
                                </label>
                            </div>
                        </div>
                        <div className="mt-4">
                            <button 
                                type="submit"
                                disabled={loading}
                                className={`block w-full py-2 text-center text-white bg-primary border border-primary rounded hover:bg-transparent hover:text-primary transition uppercase font-roboto font-medium ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Creating account...' : 'Create account'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Register
