import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { isTablet, isMobile } from "react-device-detect";
// Import Swiper styles
import "swiper/css";
import { Navigation } from "swiper";
import Image from "next/image";
import Lightbox from "react-18-image-lightbox";
import "react-18-image-lightbox/src/style.css";
import { BUCKET_URL } from "@/config/constant";

const GalleryModel = ({ handleClose, galleryImages }) => {
  const images = galleryImages.map((image) => image.url);
  const [isLightOpen, setLightOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(1);

  const openLightBox = (e) => {
    setPhotoIndex(e);
    setLightOpen(true);
    setTimeout(() => {
      const zin = document.getElementsByClassName("ril-zoom-in")[0];
      zin.click();
      const zout = document.getElementsByClassName("ril-zoom-out")[0];
      zout.click();
    }, 500);
  };

  return (
    <>
      {isLightOpen && (
        <Lightbox
          mainSrc={images[photoIndex]}
          nextSrc={images[(photoIndex + 1) % images.length]}
          prevSrc={images[(photoIndex + images.length - 1) % images.length]}
          onCloseRequest={() => setLightOpen(false)}
          onMovePrevRequest={() =>
            setPhotoIndex((photoIndex + images.length - 1) % images.length)
          }
          onMoveNextRequest={() =>
            setPhotoIndex((photoIndex + 1) % images.length)
          }
        />
      )}
      <div className=" max-w-[70%] h-auto max-h-fit fixed z-40 bg-white inset-0 mx-auto my-auto p-5">
        <div className="w-full flex justify-between items-center mb-5">
          <p className=" text-2xl font-lato font-black">Gallery</p>
          <Image
            alt="img"
            src={`${BUCKET_URL}/Close.png`}
            unoptimized
            height={100}
            width={100}
            className="w-5 aspect-square"
            onClick={handleClose}
          ></Image>
        </div>
        <Swiper
          cssMode={true}
          pagination={true}
          slidesPerView={isMobile ? 1 : isTablet ? 1.5 : 4.5}
          spaceBetween={isMobile ? 10 : isTablet ? 20 : 30}
          modules={[Navigation]}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          className="!m-0 relative"
        >
          {images.map((items, index) => {
            return (
              <SwiperSlide key={index}>
                <Image
                  alt="img"
                  onClick={() => openLightBox(index)}
                  src={items}
                  height={100}
                  width={100}
                  className=" w-52 h-52 cursor-pointer rounded-lg"
                  unoptimized
                ></Image>
              </SwiperSlide>
            );
          })}
          <div
            id="navigation-main"
            className="w-full h-12 flex items-center justify-center absolute z-10 inset-0 mx-auto my-auto"
          >
            <div className="w-full flex flex-row justify-between items-center">
              <a className="swiper-button-prev cursor-pointer">
                <Image
                  alt="img"
                  width={500}
                  height={500}
                  src={`${BUCKET_URL}/arrow.svg`}
                  className="h-10 w-auto bg-[#C8FB51] rounded-full"
                />
              </a>
              <a className="swiper-button-next -scale-x-100 cursor-pointer">
                <Image
                  alt="img"
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
    </>
  );
};

export default GalleryModel;
