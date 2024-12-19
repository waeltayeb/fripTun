import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';

function Banner() {
    const [bannerPreview, setBannerPreview] = useState(null);
    const [pubPreview, setPubPreview] = useState(null);
    useEffect(() => {
        const fetchImages = async () => {
          try {
            const [bannerRes, pubRes] = await Promise.all([
              axios.get('http://localhost:5000/api/settings/banner'),
              axios.get('http://localhost:5000/api/settings/pub')
            ]);
    
            if (bannerRes.data.imageUrl) {
              setBannerPreview(bannerRes.data.imageUrl);
            }
            if (pubRes.data.imageUrl) {
              setPubPreview(pubRes.data.imageUrl);
            }
          } catch (error) {
            console.error('Error fetching images:', error);
            toast.error('Failed to load images');
          }
        };
    
        fetchImages();
      }, []);
  return (
    <>
        <div className="bg-cover bg-no-repeat bg-center py-36" style={{ backgroundImage: `url(${bannerPreview})` }}>
        <div className="container">
            <h1 className="text-6xl text-gray-800 font-medium mb-4 capitalize">
                best collection for <br/> YOU
            </h1>
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aperiam <br/>
                accusantium perspiciatis, sapiente
                magni eos dolorum ex quos dolores odio</p>
            <div className="mt-12">
                <a href="/shop" className="bg-primary border border-primary text-white px-8 py-3 font-medium 
                    rounded-md hover:bg-transparent hover:text-primary">Shop Now</a>
            </div>
        </div>
    </div>
    </>
  )
}

export default Banner
