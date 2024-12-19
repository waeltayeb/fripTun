import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';

function PubImage() {
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
    <div className="container pb-16">
        <a href="/">
            <img src={pubPreview} alt="ads" className="w-full" />
        </a>
    </div>
  )
}

export default PubImage
