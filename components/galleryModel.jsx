import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { isTablet, isMobile } from "react-device-detect";
import "swiper/css";
import { Navigation } from "swiper";
import Image from "next/image";
import Lightbox from "react-18-image-lightbox";
import "react-18-image-lightbox/src/style.css";
import { BUCKET_URL } from "@/config/constant";

const GalleryModel = ({ handleClose, galleryImages }) => {
  const images = galleryImages.map((item) => ({
    url: item.url,
    type: item.type || (item.url.includes("youtube") ? "video" : "image"),
  }));

  const [isLightOpen, setLightOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const openLightBox = (index) => {
    setPhotoIndex(index);
    setLightOpen(true);
  };

  const moveToNext = () => {
    setPhotoIndex((photoIndex + 1) % images.length);
  };

  const moveToPrev = () => {
    setPhotoIndex((photoIndex + images.length - 1) % images.length);
  };

  return (
    <>
      {isLightOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          {images[photoIndex]?.type === "image" ? (
            <Lightbox
              mainSrc={images[photoIndex]?.url}
              nextSrc={images[(photoIndex + 1) % images.length]?.url}
              prevSrc={
                images[(photoIndex + images.length - 1) % images.length]?.url
              }
              onCloseRequest={() => setLightOpen(false)}
              onMovePrevRequest={moveToPrev}
              onMoveNextRequest={moveToNext}
              wrapperClassName="custom-lightbox"
            />
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <iframe
                src={images[photoIndex]?.url}
                width="80%"
                height="80%"
                allow="autoplay; fullscreen"
                frameBorder="0"
                allowFullScreen
              ></iframe>
              <button
                className="absolute top-5 right-5 text-white text-xl"
                onClick={() => setLightOpen(false)}
              >
                ✕
              </button>
              {/* Navigation Arrows for Videos */}
              <button
                className="absolute left-5 text-white text-5xl"
                onClick={moveToPrev}
              >
                &#8249;
              </button>
              <button
                className="absolute right-5 text-white text-5xl"
                onClick={moveToNext}
              >
                &#8250;
              </button>
            </div>
          )}
        </div>
      )}

      <div className="fixed inset-0 z-40 flex items-center justify-center">
        {/* Black Background Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-80 z-0"></div>

        <div className="max-w-[70%] h-auto max-h-fit z-10 bg-white p-5 rounded-lg">
          <div className="w-full flex justify-between items-center mb-5">
            <p className="text-2xl font-lato font-black text-black">Gallery</p>
            <Image
              alt="Close"
              src={`${BUCKET_URL}/Close.png`}
              unoptimized
              height={100}
              width={100}
              className="w-5 aspect-square cursor-pointer"
              onClick={handleClose}
            />
          </div>
          <Swiper
            cssMode={true}
            // slidesPerView={isMobile ? 1 : isTablet ? 1.5 : 4.5}
            spaceBetween={isMobile ? 10 : isTablet ? 20 : 30}
            modules={[Navigation]}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            className="!m-0 relative"
          >
            {images.map((item, index) => (
              <SwiperSlide key={index} className="swiper-slide">
                {item.type === "image" ? (
                  <Image
                    alt="Gallery Item"
                    onClick={() => openLightBox(index)}
                    src={item.url}
                    height={100}
                    width={100}
                    className="w-52 h-52 cursor-pointer rounded-lg"
                    unoptimized
                  />
                ) : (
                  <div
                    className="w-52 h-52 cursor-pointer rounded-lg bg-black flex items-center justify-center"
                    onClick={() => openLightBox(index)}
                  >
                    <iframe
                      src={item.url}
                      className="w-full h-full rounded-lg"
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
              </SwiperSlide>
            ))}
            <div
              id="navigation-main"
              className="w-full h-12 flex items-center justify-center absolute z-10 inset-0 mx-auto my-auto"
            >
              <div className="w-full flex flex-row justify-between items-center">
                <a className="swiper-button-prev cursor-pointer">
                  <Image
                    alt="Previous"
                    width={500}
                    height={500}
                    src={`${BUCKET_URL}/arrow.svg`}
                    className="h-10 w-auto bg-[#C8FB51] rounded-full"
                  />
                </a>
                <a className="swiper-button-next -scale-x-100 cursor-pointer">
                  <Image
                    alt="Next"
                    width={500}
                    height={500}
                    src={`${BUCKET_URL}/arrow.svg`}
                    className="h-10 w-auto bg-[#C8FB51] rounded-full"
                  />
                </a>
              </div>
            </div>
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default GalleryModel;
