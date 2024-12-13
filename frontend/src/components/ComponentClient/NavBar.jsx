import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaShoppingCart } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { HiMenuAlt3 } from 'react-icons/hi';
import { MdClose } from 'react-icons/md';
import { UserCog } from 'lucide-react';
import Cart from '../Cart';
import { useCart } from '../../context/CartContext';
import ClickOutside from '../../admin/ClickOutside';

function Navbar() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({ firstname: '' });
    const [dropdown, setDropdown] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownOpenCart, setDropdownOpenCart] = useState(false);
    const { getCartCount } = useCart();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('identifier');
        navigate('/login');
    };

    const fetchUserData = async () => {
        try {
            const id = localStorage.getItem('identifier');
            if (id) {
                const response = await axios.get(`http://localhost:5000/api/client/profile/${id}`);
                setUserData(response.data);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const navLinks = [
        { name: 'Dashboard', link: '/ClientDashboard' },
        { name: 'Profile', link: '/ClientProfile' },
        { name: 'Shop', link: '/Shop' },
    ];

    return (
        <>
            <nav className="bg-gray-800">
                <div className="container flex items-center justify-between py-4 px-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <img src="assets/images/logo.svg" alt="Logo" className="w-32" />
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden lg:flex items-center space-x-6">
                        {navLinks.map((link, index) => (
                            <Link
                                key={index}
                                to={link.link}
                                className="text-gray-200 hover:text-white transition"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center space-x-10">
                        {/* Cart Icon */}
                        <div className="relative cart-container">
                            <button
                                onClick={() => setDropdownOpenCart(!dropdownOpenCart)}
                                className="relative text-center text-gray-100 hover:text-primary transition"
                                aria-label="Cart"
                            >
                                <FaShoppingCart className="text-2xl" />
                                <span className="text-xs leading-3">Cart</span>
                                <div className="absolute -right-3 -top-1 w-5 h-5 rounded-full flex items-center justify-center bg-primary text-white text-xs">
                                    {getCartCount() > 0 ? getCartCount() : '0'}
                                </div>
                            </button>
                        </div>

                        {/* User Dropdown */}
                        <ClickOutside onClick={() => setDropdownOpen(false)} className="relative max-md:hidden">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-4"
                            >
                                <span className="hidden text-right lg:block text-stroke">
                                    <span className="block text-sm font-medium text-stroke">Welcome Back</span>
                                    <span className="block text-xs text-stroke">{userData.firstname}</span>
                                </span>
                                <span className="  text-stroke rounded-full">
                                <UserCog />
                                </span>
                                <svg
                                className="hidden fill-current sm:block text-stroke "
                                width="12"
                                height="8"
                                viewBox="0 0 12 8"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
                                    fill=""
                                />
                            </svg>
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-4 flex flex-col w-62.5 rounded-sm border border-stroke bg-white shadow-default">
                                    <button
                                onClick={handleLogout} 
                                 className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base">
                                    <svg
                                        className="fill-current"
                                        width="22"
                                        height="22"
                                        viewBox="0 0 22 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M15.5375 0.618744H11.6531C10.7594 0.618744 10.0031 1.37499 10.0031 2.26874V4.64062C10.0031 5.05312 10.3469 5.39687 10.7594 5.39687C11.1719 5.39687 11.55 5.05312 11.55 4.64062V2.23437C11.55 2.16562 11.5844 2.13124 11.6531 2.13124H15.5375C16.3625 2.13124 17.0156 2.78437 17.0156 3.60937V18.3562C17.0156 19.1812 16.3625 19.8344 15.5375 19.8344H11.6531C11.5844 19.8344 11.55 19.8 11.55 19.7312V17.3594C11.55 16.9469 11.2062 16.6031 10.7594 16.6031C10.3125 16.6031 10.0031 16.9469 10.0031 17.3594V19.7312C10.0031 20.625 10.7594 21.3812 11.6531 21.3812H15.5375C17.2219 21.3812 18.5625 20.0062 18.5625 18.3562V3.64374C18.5625 1.95937 17.1875 0.618744 15.5375 0.618744Z"
                                            fill=""
                                        />
                                        <path
                                            d="M6.05001 11.7563H12.2031C12.6156 11.7563 12.9594 11.4125 12.9594 11C12.9594 10.5875 12.6156 10.2438 12.2031 10.2438H6.08439L8.21564 8.07813C8.52501 7.76875 8.52501 7.2875 8.21564 6.97812C7.90626 6.66875 7.42501 6.66875 7.11564 6.97812L3.67814 10.4844C3.36876 10.7938 3.36876 11.275 3.67814 11.5844L7.11564 15.0906C7.25314 15.2281 7.45939 15.3312 7.66564 15.3312C7.87189 15.3312 8.04376 15.2625 8.21564 15.125C8.52501 14.8156 8.52501 14.3344 8.21564 14.025L6.05001 11.7563Z"
                                            fill=""
                                        />
                                    </svg>
                                    Log Out
                                </button>
                                </div>
                            )}
                        </ClickOutside>

                        {/* Mobile Menu Toggler */}
                        <button
                            onClick={() => setDropdown(!dropdown)}
                            className="lg:hidden text-2xl text-gray-200 focus:outline-none"
                            aria-label="Toggle Menu"
                            aria-expanded={dropdown}
                        >
                            {dropdown ? <MdClose /> : <HiMenuAlt3 />}
                        </button>
                    </div>
                </div>

                {/* Mobile Dropdown */}
                {dropdown && (
                    <div className="lg:hidden w-full fixed top-16 left-0 bg-gray-800 text-white z-10">
                        <ul className="flex flex-col items-center space-y-4 py-6">
                            {navLinks.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        to={link.link}
                                        onClick={() => setDropdown(false)}
                                        className="text-gray-200 hover:text-primary transition"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className="border-t border-stroke">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium hover:text-primary"
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Cart Dropdown */}
            {dropdownOpenCart && (
                <div className="absolute right-0 bg-gray-400 w-full lg:w-1/3 z-50">
                    <Cart />
                    <Link
                        to="/checkout"
                        className="block w-full py-3 px-4 text-center text-white bg-primary border border-primary rounded-md hover:bg-transparent hover:text-primary transition font-medium"
                    >
                        Confirm Order
                    </Link>
                </div>
            )}
        </>
    );
}

export default Navbar;
