import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          {/* Animated 404 Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <h1 className="text-9xl font-bold text-gray-200">404</h1>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-6xl">🏪</div>
            </motion.div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 space-y-4"
          >
            <h2 className="text-3xl font-bold text-gray-800">Page Not Found</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Oops! It seems like the page you're looking for has gone shopping elsewhere.
              Let's get you back to our store.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 space-x-4"
          >
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors inline-flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Home Page</span>
            </button>
          </motion.div>

          {/* Animated Decorative Elements */}
          <div className="relative mt-16">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                y: [0, -10, 10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="absolute left-1/2 transform -translate-x-1/2 -top-8"
            >
              <div className="text-4xl">👕</div>
            </motion.div>
            <motion.div
              animate={{
                rotate: [0, -10, 10, 0],
                y: [0, 10, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0.5,
              }}
              className="absolute left-1/3 transform -translate-x-1/2 top-0"
            >
              <div className="text-4xl">👖</div>
            </motion.div>
            <motion.div
              animate={{
                rotate: [0, 15, -15, 0],
                y: [0, -15, 15, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 1,
              }}
              className="absolute right-1/3 transform translate-x-1/2 -top-4"
            >
              <div className="text-4xl">👟</div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NotFound;
