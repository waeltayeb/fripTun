import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';


function Filter({ onFilterChange }) {
    const [brands, setBrands] = useState([]); // Renamed for clarity
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedSize, setSelectedSize] = useState('');

    // Fetch brands when component mounts

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

    // Notify parent component about filter changes
    useEffect(() => {
        console.log(brands);
        onFilterChange({ selectedCategories, selectedBrand, selectedSize });
    }, [selectedCategories, selectedBrand, selectedSize, onFilterChange]);

    // Handle category changes
    const handleCategoryChange = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((cat) => cat !== category)
                : [...prev, category]
        );
    };

    // Handle size changes
    const handleSizeChange = (size) => {
        setSelectedSize(size);
    };

    return (
        <div className="w-full divide-gray-200 space-y-5 max-w-md mx-auto px-4 sm:px-6 lg:px-8">
            {/* Categories */}
            <div>
                <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">Categories</h3>
                <div className="space-y-2">
                    {['MEN', 'WOMEN'].map((category) => (
                        <div className="flex items-center" key={category}>
                            <input
                                type="checkbox"
                                id={`cat-${category.toLowerCase()}`}
                                onChange={() => handleCategoryChange(category)}
                                checked={selectedCategories.includes(category)}
                                className="text-primary focus:ring-0 rounded-sm cursor-pointer"
                            />
                            <label
                                htmlFor={`cat-${category.toLowerCase()}`}
                                className="text-gray-600 ml-3 cursor-pointer"
                            >
                                {category}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Brands */}
            <div className="pt-4">
                <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">Brands</h3>
                <select
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    value={selectedBrand}
                    className="block w-full border border-gray-600 text-gray-600 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                    <option value="">Select a brand</option>
                    {brands.map((brand) => (
                      <option key={brand._id} value={brand._id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
            </div>

            {/* Sizes */}
            <div className="pt-4">
                <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">Size</h3>
                <div className="flex items-center gap-2 flex-wrap">
                    {['XS', 'S', 'M', 'L', 'XL', ''].map((size) => (
                        <div className="size-selector" key={size}>
                            <input
                                type="radio"
                                name="size"
                                id={`size-${size}`}
                                onChange={() => handleSizeChange(size)}
                                checked={selectedSize === size}
                                className="hidden"
                            />
                            <label
                                htmlFor={`size-${size}`}
                                className={`text-xs border border-gray-200 rounded-sm h-6 w-6 flex items-center justify-center cursor-pointer shadow-sm text-gray-600 
                                ${selectedSize === size ? 'bg-primary text-white' : ''}`}
                            >
                                {size || 'All'}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Filter;
