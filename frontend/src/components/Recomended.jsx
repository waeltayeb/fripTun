import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { useEffect, useState } from 'react';
import Card from './Card';

function Recomended() {
  const [recommendedArticals, setRecommendedArticals] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/ArticlesRecommended')
      .then((response) => response.json())
      .then((data) => setRecommendedArticals(data))
      .catch((error) => console.error('Error fetching recommended articals:', error));
  }, []);

  return (
    <div className="container pb-16">
      <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6">
        Recommended for You
      </h2>
      <Swiper
        slidesPerView={1}
        spaceBetween={20}
        pagination={{ clickable: true }}
        breakpoints={{
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
        modules={[Pagination]}
        className="mySwiper"
      >
        {recommendedArticals.map((artical) => (
          <SwiperSlide key={artical._id}>
            <Card
              id={artical._id}
              title={artical.title}
              price={artical.price}
              newprice={artical.newPrice}
              imageUrl={artical.images[0]}
              isSold={artical.isSold}
              
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Recomended;
