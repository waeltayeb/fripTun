import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const features = [
    {
      title: "Quality Products",
      description: "Carefully curated selection of second-hand clothing and accessories",
      icon: "🛍️"
    },
    {
      title: "Sustainable Fashion",
      description: "Promoting eco-friendly fashion choices through reuse and recycling",
      icon: "🌱"
    },
    {
      title: "Best Prices",
      description: "Affordable prices for high-quality second-hand items",
      icon: "💰"
    },
    {
      title: "Expert Support",
      description: "Dedicated team to help you find the perfect items",
      icon: "👥"
    }
  ];

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "https://res.cloudinary.com/dy7sxgoty/image/upload/v1734644248/admin_r9wg8r.jpg"
    },
    {
      name: "Mike Thompson",
      role: "Head of Curation",
      image: "https://res.cloudinary.com/dy7sxgoty/image/upload/v1734644248/admin_r9wg8r.jpg"
    },
    {
      name: "Emma Davis",
      role: "Customer Experience",
      image: "https://res.cloudinary.com/dy7sxgoty/image/upload/v1734644248/admin_r9wg8r.jpg"
    }
  ];

  return (
    <>
    <Navbar />
    <div className="bg-white">
      {/* Hero Section */}
      <motion.section 
        className="relative h-[500px] bg-gradient-to-r from-purple-600 to-blue-600 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <motion.h1 
              className="text-5xl font-bold mb-6"
              {...fadeIn}
            >
              About FripTun
            </motion.h1>
            <motion.p 
              className="text-xl mb-8"
              {...fadeIn}
              transition={{ delay: 0.2 }}
            >
              Your premier destination for high-quality second-hand fashion in Tunisia. 
              We're committed to making sustainable fashion accessible to everyone.
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* Mission Section */}
      <motion.section 
        className="py-20 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              At FripTun, we believe in giving clothes a second life while making fashion 
              accessible and sustainable. Our mission is to reduce textile waste, promote 
              sustainable fashion choices, and provide high-quality second-hand clothing 
              at affordable prices.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white p-6 rounded-lg shadow-lg text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                className="bg-white rounded-lg overflow-hidden shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
            <p className="text-xl mb-8">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-colors">
              Contact Us
            </button>
          </motion.div>
        </div>
      </section>
    </div>
    <Footer />   
    </>
  );
};

export default About;