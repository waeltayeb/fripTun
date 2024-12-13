import React, { useState } from 'react';
import { useArticalData } from '../useArticalData';

function Filter({ onFilterChange }) {
    const { Brand } = useArticalData();

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedSize, setSelectedSize] = useState('');

    const handleCategoryChange = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((cat) => cat !== category)
                : [...prev, category]
        );
    };

    const handleBrandChange = (event) => {
        setSelectedBrand(event.target.value);
    };

    const handleSizeChange = (size) => {
        if (size === 'all') {
            setSelectedSize(null);
        } else {
            setSelectedSize(size);
        }
    };

    // Notify parent component about filter changes
    React.useEffect(() => {
        onFilterChange({ selectedCategories, selectedBrand, selectedSize });
    }, [selectedCategories, selectedBrand, selectedSize]);

    return (
        <div className="w-full divide-gray-200 space-y-5 max-w-md mx-auto px-4 sm:px-6 lg:px-8">
            {/* Categories */}
            <div>
                <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">Categories</h3>
                <div className="space-y-2">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="cat-men"
                            onChange={() => handleCategoryChange('MEN')}
                            className="text-primary focus:ring-0 rounded-sm cursor-pointer"
                        />
                        <label htmlFor="cat-men" className="text-gray-600 ml-3 cursor-pointer">
                            MEN
                        </label>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="cat-women"
                            onChange={() => handleCategoryChange('WOMEN')}
                            className="text-primary focus:ring-0 rounded-sm cursor-pointer"
                        />
                        <label htmlFor="cat-women" className="text-gray-600 ml-3 cursor-pointer">
                            WOMEN
                        </label>
                    </div>
                </div>
            </div>

            {/* Brands */}
            <div className="pt-4">
                <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">Brands</h3>
                <select
                    onChange={handleBrandChange}
                    value={selectedBrand}
                    className="block w-full border border-gray-600 text-gray-600 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                    <option value="">All</option>
                    {Brand.map((brand) => (
                        <option key={brand.id} value={brand.name}>
                            {brand.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Sizes */}
            <div className="pt-4">
                <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">Size</h3>
                <div className="flex items-center gap-2 flex-wrap">
                    {['XS', 'S', 'M', 'L', 'XL', 'all'].map((size) => (
                        <div className="size-selector" key={size}>
                            <input
                                type="radio"
                                name="size"
                                id={`size-${size.toLowerCase()}`}
                                onChange={() => handleSizeChange(size)}
                                className="hidden"
                            />
                            <label
                                htmlFor={`size-${size.toLowerCase()}`}
                                className={`text-xs border border-gray-200 rounded-sm h-6 w-6 flex items-center justify-center cursor-pointer shadow-sm text-gray-600 
                                ${selectedSize === size ? 'bg-primary text-white' : ''}`} // Add primary background when selected
                            >
                                {size}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Filter;
