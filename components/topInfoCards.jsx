import React from "react";
import { useEffect, useState } from "react";
import { userDetails } from "@/models/data";
import { isMobile, isTablet } from "react-device-detect";
import Image from "next/image";
import { BUCKET_URL } from "@/config/constant";

function TopInfoCards() {
  const user = userDetails;
  const [device, setDevice] = useState(null);

  useEffect(() => {
    if (isMobile || isTablet) {
      setDevice(isMobile ? "mobile" : "tablet");
    } else {
      setDevice("desktop");
    }
  }, []);
  const numberWithCommas = (x) => {
    return Number(x).toLocaleString();
  };
  return (
    <>
      <div
        style={{ display: device === "desktop" ? "none" : "" }}
        className="mt-4 bg-black-2 py-3 px-1 rounded-lg font-lato font-black text-base flex flex-row items-center justify-center text-violet uppercase"
      >
        <Image
          alt=""
          width={20}
          height={20}
          src={`${BUCKET_URL}/master-analytics.svg`}
          className="mr-3"
        />
        Click to view Master Analytics
      </div>
      <div
        className="container flex lg:flex-row flex-col lg:items-stretch items-center justify-between lg:max-w-full max-w-[320px] mx-auto px-5"
        style={{ display: device === "desktop" ? "" : "none" }}
      >
        <div className="lg:w-[24%] w-full bg-peach lg:mr-5 lg:ml-3 min-h-[8.5rem] mt-5 lg:mt-0 rounded-lg flex flex-col items-center justify-center">
          <p className="font-lato font-normal text-[300%] mb-2">
            {numberWithCommas(user.eventsHosted)}
          </p>
          <p className="font-lato font-semibold text-[130%]">Sessions Hosted</p>
        </div>
        <div className="lg:w-[24%] w-full bg-light-green lg:mr-5 min-h-[8.5rem] mt-5 lg:mt-0 rounded-lg flex flex-col items-center justify-center">
          <p className="font-lato font-normal text-[300%] mb-2">
            {numberWithCommas(user.visitors)}
          </p>
          <p className="font-lato font-semibold text-[130%]">Visitors Inn</p>
        </div>
        <div className="lg:w-[24%] w-full bg-light-blue lg:mr-5 min-h-[8.5rem] mt-5 lg:mt-0 rounded-lg flex flex-col items-center justify-center">
          <p className="font-lato font-normal text-[300%] mb-2">
            {numberWithCommas(user.stalls)}
          </p>
          <p className="font-lato font-semibold text-[130%]">Stalls Inn</p>
        </div>
        <div className="lg:w-[24%] w-full bg-black text-white lg:mr-5 min-h-[8.5rem] mt-5 lg:mt-0 rounded-lg flex flex-row items-center justify-center">
          <div className="pl-2 flex-col flex  justify-center min-h-[6rem]">
            <p className="font-lato font-normal text-[300%] mb-2">₹1.56 L</p>
            <p className="font-lato font-semibold text-[130%]">Total Revenue</p>
          </div>
        </div>
        <div className="notifications w-[10%] text-right pr-6 pt-6 lg:relative absolute right-3">
          <div className="relative inline-block design-border">
            <Image
              src={`${BUCKET_URL}/notifications.svg`}
              height={33}
              width={33}
              alt=""
            />
            <div className="absolute -right-6 -top-6 bg-brand-color rounded-full flex flex-row items-center justify-center h-7 w-7 font-lato font-bold text-[10px]">
              99+
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TopInfoCards;
