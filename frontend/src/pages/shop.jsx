import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Filter from '../components/Filter';
import Card from '../components/Card';
import Footer from '../components/Footer';

import { MdChevronRight } from "react-icons/md";
import { FaHouseDamage } from "react-icons/fa";

function Shop() {
    const [artical , setArtical] = useState([]);
    useEffect(() => {
        fetch('http://localhost:5000/api/ArticlesAvailable')
          .then((response) => response.json())
          .then((data) => setArtical(data))
          .catch((error) => console.error('Error fetching articals:', error));
      }, []);

    const [filters, setFilters] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false); // State to toggle filter visibility

    const itemsPerPage = 6;

    const filteredArticles = artical.filter((item) => {
        const matchesCategory =
            !filters.selectedCategories?.length ||
            filters.selectedCategories.includes(item.gender.toUpperCase());

        const matchesBrand =
            !filters.selectedBrand || filters.selectedBrand === item.brand;

        const matchesSize = !filters.selectedSize || filters.selectedSize.toUpperCase() === item.size.toUpperCase();

        return matchesCategory && matchesBrand && matchesSize;
    });

    const paginatedArticles = filteredArticles.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const toggleFilters = () => {
        setShowFilters((prev) => !prev);
    };

    return (
        <>
            <Navbar />
            <div className="container py-4 flex items-center gap-3">
                <a href="/" className="text-primary text-base">
                    <FaHouseDamage />
                </a>
                <span className="text-sm text-gray-400">
                    <MdChevronRight />
                </span>
                <p className="text-gray-600 font-medium">Shop</p>
            </div>
            <div className="container grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 pb-16 items-start">
                {/* Filter Section */}
                <div className={`md:block ${showFilters ? "block" : "hidden"} col-span-1`}>
                    <Filter onFilterChange={setFilters} />
                </div>

                {/* Filter Button for Small Screens */}
                <div className="block md:hidden col-span-3 w-full  text-right">
                    <button
                        onClick={toggleFilters}
                        className="px-4 py-2 bg-primary text-white rounded-md shadow hover:bg-primary-dark"
                    >
                        {showFilters ? "Hide Filters" : "Show Filters"}
                    </button>
                </div>

                {/* Product Section */}
                <div className="col-span-3">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {paginatedArticles.map((article) => (
                            <Card
                                key={article._id}
                                id={article._id}
                                title={article.title}
                                price={article.price}
                                newprice={article.newPrice}
                                imageUrl={article.images[0]}
                                isSold={article.isSold}
                                
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-200 rounded-l-md"
                        >
                            &lt;
                        </button>
                        <span className="px-4 py-2">{currentPage}</span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage * itemsPerPage >= filteredArticles.length}
                            className="px-4 py-2 bg-gray-200 rounded-r-md"
                        >
                            &gt;
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Shop;
