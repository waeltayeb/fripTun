import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const loginApiUrl = process.env.REACT_APP_API_URL_USER || 'http://localhost:5000/api/user/login';

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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(loginApiUrl, {
        email: formData.email,
        password: formData.password,
      });
      
      if (response.data) {
        // Store the token and role in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', JSON.stringify(response.data.role));
        localStorage.setItem('identifier', response.data.identifier);
    
        // Redirect based on role
        if (response.data.role === 'admin') {
          navigate('/admin');
        } else if (response.data.role === 'client') {
          navigate('/ClientDashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="contain my-28">
        <div className="max-w-lg mx-auto shadow px-6 py-7 rounded overflow-hidden">
          <h2 className="text-2xl uppercase font-medium mb-1">Login</h2>
          <p className="text-gray-600 mb-6 text-sm">Welcome back</p>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="space-y-2">
              <div>
                <label htmlFor="email" className="text-gray-600 mb-2 block">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                  placeholder="youremail@domain.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="text-gray-600 mb-2 block">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                  placeholder="*******"
                />
              </div>
            </div>
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="remember"
                  id="remember"
                  className="text-primary focus:ring-0 rounded-sm cursor-pointer"
                />
                <label htmlFor="remember" className="text-gray-600 ml-3 cursor-pointer">
                  Remember me
                </label>
              </div>
              <a href="/forgot-password" className="text-primary">
                Forgot password
              </a>
            </div>
            <div className="mt-4">
              <button
                type="submit"
                disabled={loading}
                className={`block w-full py-2 text-center text-white bg-primary border border-primary rounded hover:bg-transparent hover:text-primary transition uppercase font-roboto font-medium ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;
