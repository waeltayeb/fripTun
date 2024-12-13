import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import TableArticle from '../../../admin/Tables/TableArticle';
import DefaultLayout from '../Layout/DefaultLayout';
import CardDashboard from '../../../admin/CardDashboard';
import { Truck, ShoppingBag, ShoppingCart } from 'lucide-react';
import ArticleForme from '../../../admin/Formes/ArticleForme';

function ListArticle() {
  const [stats, setStats] = useState({
    totalArticles: 0,
    soldArticles: 0,
    pendingArticles: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArticleStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/statsArtciles');
      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.statusText}`);
      }
  
      const data = await response.json();
      setStats({
        totalArticles: parseInt(data.totalArticles) || 0,
        soldArticles: parseInt(data.soldArticles) || 0,
        pendingArticles: parseInt(data.pendingArticles) || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load statistics. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticleStats();
    // Set up interval to refresh stats every 30 seconds
    const intervalId = setInterval(fetchArticleStats, 30000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <DefaultLayout>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black">
          List Article
        </h2>

        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <Link className="font-medium" to="/">
                Dashboard /
              </Link>
            </li>
            <li className="font-medium text-primary">List Article</li>
          </ol>
        </nav>
      </div>

      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      <div className="my-4 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDashboard 
          title="Total Product" 
          total={stats.totalArticles}
          loading={loading}
        >
          <ShoppingCart className='text-primary' />
        </CardDashboard>
        <CardDashboard 
          title="Total Product Sold" 
          total={stats.soldArticles}
          loading={loading}
          bgColor="sold"
        >
          <ShoppingBag className='text-primary' />
        </CardDashboard>
        <CardDashboard 
          title="Product Pending" 
          total={stats.pendingArticles}
          loading={loading}
          bgColor="pending"
        >
          <Truck className='text-primary' />
        </CardDashboard>
      </div>

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default">
            <div className="border-b border-stroke py-4 px-6.5">
              <h3 className="font-medium text-black">
                Add New Article
              </h3> 
            </div>
            <ArticleForme onSubmitSuccess={fetchArticleStats} />
          </div>
        </div>

        <div className="flex flex-col gap-9">
          <div className="rounded-sm border bg-white shadow-default border-strokedark">
            <TableArticle onDataChange={fetchArticleStats} />
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}

export default ListArticle
