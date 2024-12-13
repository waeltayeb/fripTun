import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { MdChevronRight } from "react-icons/md";
import { FaHouseDamage } from "react-icons/fa";

function Article() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  // Fetch main article
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/articles/${id}`);
        if (!response.ok) throw new Error('Failed to fetch article');
        const data = await response.json();
        setArticle(data);
        setMainImage(data.images[0]); // Set first image as default
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  // Fetch related articles
  useEffect(() => {
    const fetchRelatedArticles = async () => {
      if (!article) return;
      
      try {
        const response = await fetch('http://localhost:5000/api/articles');
        if (!response.ok) throw new Error('Failed to fetch related articles');
        const allArticles = await response.json();
        
        // Filter related articles by gender and exclude current article
        const filtered = allArticles.filter(item => 
          item.gender === article.gender && 
          item._id !== article._id &&
          item.status === 'available'
        ).slice(0, 4); // Limit to 4 related articles
        
        setRelatedArticles(filtered);
      } catch (err) {
        console.error('Error fetching related articles:', err);
      }
    };

    fetchRelatedArticles();
  }, [article]);

  const handleImageClick = (url) => {
    setMainImage(url);
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!article) return <div className="text-center py-10">Article not found</div>;

  return (
    <div>
      <Navbar />
      <div className="container py-4 flex items-center gap-3">
        <a href="/" className="text-primary text-base">
          <FaHouseDamage />
        </a>
        <span className="text-sm text-gray-400">
          <MdChevronRight />
        </span>
        <p className="text-gray-600 font-medium">Shop</p>
        <span className="text-sm text-gray-400">
          <MdChevronRight />
        </span>
        <p className="text-gray-600 font-medium">{article.title}</p>
      </div>

      <div className="container grid grid-cols-1 md:grid-cols-2 gap-6 ">
        <div>
          <img
            src={mainImage}
            alt="product"
            className="w-72 h-72 "
          />
          <div className="grid grid-cols-5 gap-2 mt-4">
            {article.images.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`product-thumbnail-${index}`}
                className={`w-32 h-16 cursor-pointer border ${
                  mainImage === url ? 'border-primary' : 'hover:border-primary'
                }`}
                onClick={() => handleImageClick(url)}
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-medium uppercase mb-2">{article.title}</h2>
          <div className="space-y-2">
            <p className="text-gray-800 font-semibold space-x-2">
              <span>Brand: </span>
              <span className="text-gray-600">{article.brand}</span>
            </p>
            <p className="text-gray-800 font-semibold space-x-2">
              <span>Gender: </span>
              <span className="text-gray-600">{article.gender}</span>
            </p>
            <p className="text-gray-800 font-semibold space-x-2">
              <span>Size: </span>
              <span className="text-gray-600">{article.size}</span>
            </p>
          </div>
          <div className="flex items-baseline mb-1 space-x-2 font-roboto mt-4">
            {article.isSold ? (
              <>
                <p className="text-2xl text-primary font-semibold">{article.newPrice} dt</p>
                <p className="text-base text-gray-400 line-through">{article.price} dt</p>
              </>
            ) : (
              <p className="text-2xl text-primary font-semibold">{article.price} dt</p>
            )}
          </div>
          <p className="mt-4 text-gray-600">{article.description}</p>
        </div>
      </div>

      {/* Related products */}
      {relatedArticles.length > 0 && (
        <div className="container pb-16 mt-16">
          <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6">
            Related products
          </h2>
          <div className="grid grid-cols-4 gap-6">
            {relatedArticles.map((related) => (
              <div key={related._id} className="bg-white shadow rounded overflow-hidden">
                <div className="relative">
                  <img
                    src={related.images[0]}
                    alt="related product"
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="pt-4 pb-3 px-4">
                  <a href={`/article?id=${related._id}`}>
                    <h4 className="uppercase font-medium text-xl mb-2 text-gray-800 hover:text-primary transition">
                      {related.title}
                    </h4>
                  </a>
                  <div className="flex items-baseline mb-1 space-x-2">
                    {related.isSold ? (
                      <>
                        <p className="text-xl text-primary font-semibold">{related.newPrice} dt</p>
                        <p className="text-sm text-gray-400 line-through">{related.price} dt</p>
                      </>
                    ) : (
                      <p className="text-xl text-primary font-semibold">{related.price} dt</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Article;
