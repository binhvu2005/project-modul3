import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Banner = () => {
  const [position, setPosition] = useState(0);
  const images = ["https://firebasestorage.googleapis.com/v0/b/ptit-b51c0.appspot.com/o/banner1.jpg?alt=media&token=1fda37bc-d387-45b9-bd54-f62f5890eb53", "https://firebasestorage.googleapis.com/v0/b/ptit-b51c0.appspot.com/o/banner2.jpg?alt=media&token=bb9b78a1-4187-459a-9bc1-b0ff743e01d1", "https://firebasestorage.googleapis.com/v0/b/ptit-b51c0.appspot.com/o/banner3.jpg?alt=media&token=75013c1c-92b4-4704-a709-65414bb19b1f"];
  const bannerCount = images.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prevPosition) => (prevPosition + 1) % bannerCount);
    }, 1500);

    return () => clearInterval(interval);
  }, [bannerCount]);

  const handleLeftClick = () => {
    setPosition((prevPosition) => (prevPosition - 1 + bannerCount) % bannerCount);
  };

  const handleRightClick = () => {
    setPosition((prevPosition) => (prevPosition + 1) % bannerCount);
  };

  return (
    <div className="banner">
      <div className="banner-container">
        <div className="banner-container-img">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Banner ${index + 1}`}
              className={`banner-img ${index === position ? 'banner-active' : ''}`}
            />
          ))}
        </div>
        <div className="banner-btn-left banner-btn" onClick={handleLeftClick}>
          <i className="fas fa-angle-left"></i>
        </div>
        <div className="banner-btn-right banner-btn" onClick={handleRightClick}>
          <i className="fas fa-angle-right"></i>
        </div>
      </div>
    </div>
  );
};

export default Banner;
