import React, { useState, useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { HiMenuAlt3 } from 'react-icons/hi';
import { MdClose } from 'react-icons/md';
import { Warehouse } from 'lucide-react';
import Cart from './Cart';
import { useCart } from '../context/CartContext';

function Navbar() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdown, setDropdown] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const { getCartCount } = useCart();

    const toggleDropdown = () => {
        setDropdown((prev) => !prev);
    };

    const navLink = [
        { name: "Home", link: "/" },
        { name: "Shop", link: "/shop" },
        { name: "About", link: "/pages/about.html" },
        { name: "Contact", link: "/pages/contact.html" },
    ];

    // Check for token to determine login status
    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (token && role === '"client"') {
            setIsLoggedIn(!!token);
        }else if ( token && role === '"admin"') {
            setIsAdmin(!!token);
        }
        
    }, []);

    // Close cart dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.cart-container')) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

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
                        {navLink.map((link, index) => (
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
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="relative text-center text-gray-100 hover:text-primary transition"
                                aria-label="Cart"
                            >
                                <div className="text-2xl">
                                    <FaShoppingCart />
                                </div>
                                <div className="text-xs leading-3">Cart</div>
                                <div className="absolute -right-3 -top-1 w-5 h-5 rounded-full flex items-center justify-center bg-primary text-white text-xs">
                                    {getCartCount() > 0 ? getCartCount() : '0'}
                                </div>
                            </button>
                        </div>

                        {/* Login/Space Button */}
                        <div>
                            {isLoggedIn ? (
                                <Link
                                    to="/ClientDashboard"
                                    className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition flex"
                                >
                                     <span className='mr-2'> Space </span> <Warehouse />
                                </Link>
                            ) : isAdmin ? (
                                <Link
                                    to="/admin"
                                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition flex "
                                >
                                     <span className='mr-2 max-md:hidden'>Admin</span> <Warehouse />
                                </Link>
                            ) : (
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition flex"
                                >
                                    <span className='mr-2 max-md:hidden'>Login</span> <Warehouse />
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Toggler */}
                        <button
                            onClick={toggleDropdown}
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
                            {navLink.map((link, index) => (
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
                    </div>
                )}
            </nav>

            {/* Cart Dropdown */}
            {dropdownOpen && (
                <div className='absolute right-0 bg-gray-400 w-full lg:w-1/3 z-999'>
                    <Cart />
                    <a
                        href="/checkout"
                        className="block w-full py-3 px-4 text-center text-white bg-primary border border-primary rounded-md hover:bg-transparent hover:text-primary transition font-medium"
                    >
                        Confirm Order
                    </a>
                </div>
            )}
        </>
    );
}

export default Navbar;
