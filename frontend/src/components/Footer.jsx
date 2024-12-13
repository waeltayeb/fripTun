import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className=" bg-zinc-800 text-white border-t border-gray-700">
      <div className="wrapper flex flex-col gap-8 p-8">
        {/* Logo Section */}
        <div className="flex justify-between items-center  flex-col">
          <Link to="/">
            <img className="w-32 h-9" src="assets/images/logo.svg" alt="logo" />
          </Link>
          <div className="flex justify-between items-center mt-3 text-center">
          <p className="text-sm"> best collection for You.</p>
          </div>
        </div>

        {/* Links Section */}
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex flex-row justify-between items-center mb-4 space-x-8">
            <Link to="/about" className="text-gray-400 hover:text-white">About Us</Link>
            <Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link>
            <Link to="/faq" className="text-gray-400 hover:text-white">FAQ</Link>
          </div>
          <div className="flex flex-col">
            <h4 className="font-semibold mb-2">Follow Us</h4>
            <div className="flex space-x-4">
              <Link to="#" className="text-gray-400 hover:text-white">
                <img src="/img/facebook-icon.svg" alt="Facebook" className="w-5 h-5" />
              </Link>
              <Link to="#" className="text-gray-400 hover:text-white">
                <img src="/img/twitter-icon.svg" alt="Twitter" className="w-5 h-5" />
              </Link>
              <Link to="#" className="text-gray-400 hover:text-white">
                <img src="/img/instagram-icon.svg" alt="Instagram" className="w-5 h-5" />
              </Link>
              <Link to="#" className="text-gray-400 hover:text-white">
                <img src="/img/linkedin-icon.svg" alt="LinkedIn" className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">© 2025 FRIPTUN. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}