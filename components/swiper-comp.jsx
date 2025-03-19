"use client";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
// import "swiper/css/pagination";

// import required modules
import { Pagination } from "swiper";
import PieChart1 from "./pie-chart";
import PieChart2 from "./pie-chart2";

export default function SwiperComponent(props) {
  const handleChange = props.func;
  var menu = ["Slide 1", "Slide 2", "Slide 3"];

  return (
    <>
      <Swiper
        cssMode={true}
        pagination={{
          el: ".swiper-pagination",
          clickable: true,
          renderBullet: (index, className) => {
            console.log(className);
            return (
              '<span className="cust-bullets ' +
              className +
              '">' +
              menu[index] +
              "</span>"
            );
          },
        }}
        onSlideChange={(s) => {
          handleChange(s.realIndex);
        }}
        grabCursor={true}
        slidesPerView={1}
        modules={[Pagination]}
        className="mySwiper w-full container"
      >
        <SwiperSlide>
          {/* <p className='title'>Total Visitors</p> */}
          <PieChart1 />
        </SwiperSlide>
        <SwiperSlide>
          {/* <p className='title'>Total Visitors</p> */}
          <PieChart2 />
        </SwiperSlide>
        <div className="swiper-pagination w-full flex flex-row items-center justify-center"></div>
      </Swiper>
    </>
  );
}
