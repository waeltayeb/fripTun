import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Pencil, Trash2, ClipboardPlus } from "lucide-react";
import { TableHeader } from "./TableHeader";

const TableArticle = () => {

  const [packageData, setPackageData] = useState([]);

  useEffect(() => {
    fetchPackageData();

        // Listen for order status change events
        const handleStatusChangeEvent = async () => {
          await fetchPackageData(); // Re-fetch data to ensure the latest updates are reflected
        };
    
        window.addEventListener("orderStatusChanged", handleStatusChangeEvent);
    
        // Cleanup listener on component unmount
        return () => {
          window.removeEventListener("orderStatusChanged", handleStatusChangeEvent);
        };


  }, []);

  const fetchPackageData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/articles");
      const data = await response.json();
      setPackageData(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching package data:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Authorization token is missing!");
          return;
        }

        const response = await fetch(`http://localhost:5000/api/articles/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json", 
            Authorization: `Bearer ${token}`,   
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to delete package");
        }
  
        alert("Package deleted successfully!");
        fetchPackageData(); 
      } catch (error) {
        console.error("Error deleting package:", error);
        alert("Failed to delete package.");
      }
    }
  };
  

  



  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    title: "",
    brand: "",
    category: "",
    size: "",
    instock: "all"
  });
  const [sortConfig, setSortConfig] = useState({ key: "", direction: null });



  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') direction = 'desc';
      else if (sortConfig.direction === 'desc') direction = null;
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...packageData];

    // Apply filters
    result = result.filter(item => {
      return (
        item.title.toLowerCase().includes(filters.title.toLowerCase()) &&
        (filters.brand === "" || item.brand.toLowerCase().includes(filters.brand.toLowerCase())) &&
        (filters.category === "" || item.gender.toLowerCase().includes(filters.category.toLowerCase())) &&
        (filters.size === "" || item.size.toString() === filters.size) &&
        (filters.instock === "all" || 
         (filters.instock === "available" && item.status === "available") || 
         (filters.instock === "sold" && item.status === "sold") || 
         (filters.instock === "pending" && item.status === "pending"))
      );
    });

    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [packageData, filters, sortConfig]);

  if (!Array.isArray(packageData)) {
    return <div>Nothing here</div>;
  }

  const totalItems = filteredAndSortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = filteredAndSortedData.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };
  

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <div className="flex items-center justify-between mb-6 px-7.5">
          <h4 className="text-xl font-semibold text-black">All Articles</h4>
          <Link
            to="/ListArticle"
            className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
          >
            <ClipboardPlus className="w-4 h-4" />
            <span>Add New</span>
          </Link>
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-5 gap-4 mb-4 px-4">
          <input
            type="text"
            placeholder="Filter by title..."
            className="border rounded px-2 py-1"
            value={filters.title}
            onChange={(e) => setFilters(prev => ({ ...prev, title: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Filter by brand..."
            className="border rounded px-2 py-1"
            value={filters.brand}
            onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Filter by category..."
            className="border rounded px-2 py-1"
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Filter by size..."
            className="border rounded px-2 py-1"
            value={filters.size}
            onChange={(e) => setFilters(prev => ({ ...prev, size: e.target.value }))}
          />
          <select
            className="border rounded px-2 py-1"
            value={filters.instock}
            onChange={(e) => setFilters(prev => ({ ...prev, instock: e.target.value }))}
          >
            <option value="all">All</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="pending">Pending</option>
            
          </select>
        </div>

        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-50 text-left">
              <TableHeader
                title="Title"
                field="title"
                sortConfig={sortConfig}
                onSort={handleSort}
              />
              <th className="py-4 px-4 font-medium text-black">Image</th>
              <TableHeader
                title="Brand"
                field="brand"
                sortConfig={sortConfig}
                onSort={handleSort}
              />
              <TableHeader
                title="Category"
                field="category"
                sortConfig={sortConfig}
                onSort={handleSort}
              />
              <TableHeader
                title="Size"
                field="size"
                sortConfig={sortConfig}
                onSort={handleSort}
              />
              <TableHeader
                title="In Stock"
                field="instock"
                sortConfig={sortConfig}
                onSort={handleSort}
              />
              <TableHeader
                title="Recommended"
                field="recommended"
                sortConfig={sortConfig}
                onSort={handleSort}
              />
              <th className="py-4 px-4 font-medium text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border-b border-[#eee] py-5 px-4">{item.title}</td>
                <td className="border-b border-[#eee] py-5 px-4">
                  {item.images?.length ? (
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td className="border-b border-[#eee] py-5 px-4">{item.brand}</td>
                <td className="border-b border-[#eee] py-5 px-4">{item.gender}</td>
                <td className="border-b border-[#eee] py-5 px-4">{item.size}</td>
                <td className="border-b border-[#eee] py-5 px-4">
                  <span
                    className={`inline-block rounded px-3 py-1 text-sm font-medium ${
                      item.status === 'available' ? "bg-green-100 text-green-600" :
                      item.status === 'pending' ? "bg-yellow-100 text-yellow-600" :
                      "bg-red-100 text-red-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="border-b border-[#eee] py-5 px-4">
                  <span className={`inline-block rounded px-3 py-1 text-sm font-medium ${
                    item.recomended ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                  }`}>
                    {item.recomended ? "Yes" : "No"}
                  </span>
                </td>
                <td className="border-b border-[#eee] py-5 px-4">
                  <div className="flex items-center space-x-3">
                    <Link 
                      to={`/edit/${item._id}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      <Pencil className="w-5 h-5" />
                    </Link>
                    <button 
                     onClick={() => handleDelete(item._id)}
                    className="hover:text-red-600 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 pb-4">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {endIndex} of {totalItems} entries
          </div>
          <div className="flex items-center gap-2">
            <select
              className="border px-2 py-1 rounded-md"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md border ${
                currentPage === 1 ? "bg-gray-100 text-gray-400" : "hover:bg-gray-50"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {getPageNumbers().map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`px-3 py-1 rounded-md border ${
                  currentPage === num
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-50"
                }`}
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md border ${
                currentPage === totalPages ? "bg-gray-100 text-gray-400" : "hover:bg-gray-50"
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableArticle;