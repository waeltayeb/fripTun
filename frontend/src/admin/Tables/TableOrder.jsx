import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Eye, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const TableOrder = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [filterText, setFilterText] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const checkAdminAuth = () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== '"admin"') {
      navigate('/login');
      return false;
    }
    return token;
  };

  const fetchOrders = async () => {
    try {
      const token = checkAdminAuth();
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        navigate('/admin/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = checkAdminAuth();
      if (!token) return;

      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.status === 401) {
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

     
      // Update order in state
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));

      const event = new CustomEvent('orderStatusChanged', { 
        detail: { orderId, newStatus } 
      });
      window.dispatchEvent(event); 




    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      const token = checkAdminAuth();
      if (!token) return;

      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to delete order');
      }

      // Remove order from state
      setOrders(orders.filter(order => order._id !== orderId));
      
    } catch (err) {
      setError(err.message);
    }
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
    
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  // Filter data
  const filteredData = orders.filter(
    (order) =>
      order.status.toLowerCase().includes(filterText.toLowerCase()) ||
      order.totalAmount.toString().includes(filterText) ||
      order._id.toString().includes(filterText) ||
      order.firstname?.toLowerCase().includes(filterText.toLowerCase()) ||
      order.lastname?.toLowerCase().includes(filterText.toLowerCase())
  );

  // Pagination values
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = filteredData.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-600';
      case 'cancelled':
        return 'bg-red-100 text-red-600';
      case 'pending':
        return 'bg-yellow-100 text-yellow-600';
      case 'confirmed':
        return 'bg-blue-100 text-blue-600';
      case 'shipped':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-xl font-semibold text-black">List Orders</h4>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {/* Filter Input */}
        <div className="mb-4 flex items-center justify-between">
          <input
            type="text"
            placeholder="Filter by status, customer name, or amount..."
            value={filterText}
            onChange={(e) => {
              setFilterText(e.target.value);
              setCurrentPage(1);
            }}
            className="border px-3 py-2 rounded-md w-full max-w-sm"
          />
          <div className="flex items-center gap-2 ml-4">
            <span className="text-gray-600 mr-2">Items per page:</span>
            <select
              className="border px-2 py-1 rounded-md"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(parseInt(e.target.value, 10));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="py-4 px-4 font-medium text-black">Order ID</th>
              <th className="py-4 px-4 font-medium text-black">Customer</th>
              <th className="py-4 px-4 font-medium text-black">Date</th>
              <th className="py-4 px-4 font-medium text-black">Amount</th>
              <th className="py-4 px-4 font-medium text-black">Status</th>
              <th className="py-4 px-4 font-medium text-black">Pay With</th>
              <th className="py-4 px-4 font-medium text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="border-b py-5 px-4">{order._id.slice(-8)}</td>
                <td className="border-b py-5 px-4">
                  {order.firstname} {order.lastname}
                </td>
                <td className="border-b py-5 px-4">
                  {format(new Date(order.orderDate), 'MMM dd, yyyy')}
                </td>
                <td className="border-b py-5 px-4">{order.totalAmount} dt</td>
                <td className="border-b py-5 px-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className={`rounded-full py-1 px-3 text-sm font-medium ${getStatusColor(order.status)}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="border-b py-5 px-4 text-pink-600">{order.methodPayment}</td>
                <td className="border-b py-5 px-4">
                  <div className="flex items-center space-x-3.5">
                    <button
                      onClick={() => openModal(order)}
                      className="hover:text-blue-600 transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteOrder(order._id)}
                      className="hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 mb-4">
          <span className="text-gray-600">
            Showing {startIndex + 1} to {endIndex} of {totalItems} entries
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {getPageNumbers().map(number => (
              <button
                key={number}
                onClick={() => setCurrentPage(number)}
                className={`px-3 py-1 rounded ${
                  currentPage === number
                    ? 'bg-primary text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                {number}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 mt-10">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Order Details</h3>
            
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                <div>
                  <p className="font-medium">Order ID</p>
                  <p className="text-gray-600">{selectedOrder._id}</p>
                </div>
                <div>
                  <p className="font-medium">Order Date</p>
                  <p className="text-gray-600">
                    {format(new Date(selectedOrder.orderDate), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Customer Name</p>
                  <p className="text-gray-600">
                    {selectedOrder.firstname} {selectedOrder.lastname}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Contact</p>
                  <p className="text-gray-600">{selectedOrder.email}</p>
                  <p className="text-gray-600">{selectedOrder.phone}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Shipping Address</h4>
                <div className="text-gray-600">
                  <p>{selectedOrder.shippingAddress.street}</p>
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Order Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <img
                          src={item.articleId.images[0]}
                          alt={item.articleId.title}
                          className="w-16 h-16 object-contain"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{item.articleId.title}</p>
                        <p className="text-sm text-gray-500">{item.articleId.description}</p>
                      </div>
                      <p className="font-medium">{item.price} dt</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div>
                  <p className="font-medium">Status</p>
                  <p className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Total Amount</p>
                  <p className="text-xl font-semibold text-primary">{selectedOrder.totalAmount} dt</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableOrder;
