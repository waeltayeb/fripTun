import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DefaultLayout from '../Layout/DefaultLayout';
import CardDashboard from '../../../admin/CardDashboard';
import { Truck, ShoppingBag, ShoppingCart, CircleX } from 'lucide-react';
import TableOrder from '../../../admin/Tables/TableOrder';



function ListOrder() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    soldOrders: 0,
    pendingOrders: 0,
    cancelledOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrderStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/statsOrders');
      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.statusText}`);
      }
  
      const data = await response.json();
      setStats({
        totalOrders: parseInt(data.totalOrders) || 0,
        soldOrders: parseInt(data.soldOrders) || 0,
        pendingOrders: parseInt(data.pendingOrders) || 0,
        cancelledOrders: parseInt(data.cancelledOrders) || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load statistics. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderStats();
    // Set up interval to refresh stats every 30 seconds
    const intervalId = setInterval(fetchOrderStats, 30000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);






  return (
    <DefaultLayout>
          
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-black ">
        List Orders
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" to="/">
              Dashboard /
            </Link>
          </li>
          <li className="font-medium text-primary">List Orders</li>
        </ol>
      </nav>
    </div>
    <div className=" my-4 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">

        <CardDashboard title="Total Orders" total={stats.totalOrders} loading={loading}   >
        <ShoppingCart className='text-primary' />
        </CardDashboard>
        <CardDashboard title="Total Orders Sold" total={stats.soldOrders}  bgColor="sold" loading={loading}>
        <ShoppingBag className='text-primary' />
        </CardDashboard>
        <CardDashboard title="Orders Pending" total={stats.pendingOrders} bgColor="pending"  loading={loading}>
        <Truck className='text-primary' />
        </CardDashboard>
        <CardDashboard title="Orders Canceled" total={stats.cancelledOrders} bgColor="canceled"  loading={loading}>
        <CircleX className='text-primary' />
        
        </CardDashboard>
      </div>
    <div className="grid grid-cols-1 gap-9 ">
          <TableOrder />
      </div>
      </DefaultLayout>

  )
}

export default ListOrder
