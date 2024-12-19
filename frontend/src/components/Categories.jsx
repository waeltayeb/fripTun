import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';

function Categories() {
  const [brands, setBrands] = useState([]);
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/settings/brands');
        setBrands(response.data);
      } catch (error) {
        console.error('Error fetching brands:', error);
        toast.error('Failed to load brands');
      }
    };

    fetchBrands();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="text-2xl font-semibold text-gray-800 uppercase mb-6 text-center lg:text-left tracking-wide">
        Shop by Category
      </h2>
      <div className="flex lg:justify-center gap-x-6 overflow-x-auto scrollbar-hide py-4 px-4">
        {/* Category 1 */}
        {brands.map((brand) => (
          <div className="relative rounded-full overflow-hidden group w-24 h-24 shrink-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <img src={brand.imageUrl} alt={brand.name} className="w-full h-full object-cover" />
          <a href="/shop"
            className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-sm text-white font-medium uppercase tracking-wide group-hover:bg-opacity-60 transition">{brand.name}</a>
        </div>
        ))}
      

    </div>
  </div>
  
  )
}

export default Categories
