import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/ComponentClient/NavBar';
import CardDashboard from '../../admin/CardDashboard';
import { ShoppingCart, Truck, ShoppingBag, X } from 'lucide-react';
import OrdersClient from '../../components/ComponentClient/OrdersClient';
import Chatbox from '../../components/ComponentClient/chatClient';

function DashboardClient() {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const id = localStorage.getItem('identifier');
        
        if (!token || !id) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/client/dashboard/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setOrderData(response.data);
      } catch (error) {
        console.error('Dashboard error:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 sm:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-stroke pb-5">
          <h2 className="text-title-md2 font-semibold text-black">Dashboard</h2>
        </div>
        <div className="my-4 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
          <CardDashboard title="Total Orders" total={orderData?.statistics?.totalOrders || 0}>
            <ShoppingCart className="text-primary" />
          </CardDashboard>
          <CardDashboard title="Total Pending" total={orderData?.statistics?.pendingOrders || 0} bgColor="pending">
            <ShoppingBag className="text-primary" />
          </CardDashboard>
          <CardDashboard title="Total Cancelled" total={orderData?.statistics?.cancelledOrders || 0} bgColor="canceled">
            <X className="text-primary" />
          </CardDashboard>
          <CardDashboard title="Total Delivered" total={orderData?.statistics?.deliveredOrders || 0} bgColor="sold">
            <Truck className="text-primary" />
          </CardDashboard>
        </div>
        <div className="grid grid-cols-1 gap-9">
          {orderData?.orders && <OrdersClient orders={orderData.orders} />}
        </div>
      </div>
      <Chatbox />
    </>
  );
}

export default DashboardClient;
