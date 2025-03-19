"use client";
import { BUCKET_URL } from "@/config/constant";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { isMobile, isTablet } from "react-device-detect";

export default function ListComponents1(props) {
  const event = props.event;

  const [isDesktop, setDesktop] = useState(null);

  useEffect(() => {
    if (isMobile || isTablet) {
      setDesktop(false);
    } else {
      setDesktop(true);
    }
  });

  if (isDesktop) {
    return (
      <div className="bg-white my-3 flex flex-row items-stretch justify-between px-4 py-2 rounded-lg">
        <div className="w-[30%] flex flex-row items-center font-quickSand text-sm font-bold text-black">
          <Image
            alt="date-event"
            width={35}
            height={35}
            src={`${BUCKET_URL}/date-event.svg`}
            className="mr-2"
          />
          {event.name}
        </div>
        <div
          title="No. of Stalls"
          className="w-[17%] flex lg:flex-row flex-col items-center justify-center rounded-lg bg-brand-color"
        >
          <p className="font-quickSand text-black font-bold text-base">
            {event.stalls}
          </p>
          <Image
            alt="stalls"
            width={25}
            height={25}
            src={`${BUCKET_URL}/stalls.svg`}
            className="lg:ml-2 lg:mb-0 mb-2 mt-1 lg:mt-0"
          />
        </div>
        <div
          title="No. of Visitors"
          className="w-[17%] flex lg:flex-row flex-col items-center justify-center rounded-lg bg-brand-color"
        >
          <p className="font-quickSand text-black font-bold text-base">
            {event.visitors}
          </p>
          <Image
            alt="visitors"
            width={30}
            height={30}
            src={`${BUCKET_URL}/visitors.svg`}
            className="lg:ml-2 lg:mb-0 mb-2 mt-1 lg:mt-0"
          />
        </div>
        <div className="w-[25%] h-12 flex flex-row items-center justify-center rounded-lg bg-black text-white font-bold font-quickSand text-base cursor-pointer">
          View Event
        </div>
      </div>
    );
  } else {
    return (
      <div className="bg-white my-3 grid grid-cols-2 pl-5 py-2 rounded-lg gap-2">
        <div className="flex flex-row items-center font-quickSand text-sm font-bold text-black">
          <Image
            alt="date-event"
            width={35}
            height={35}
            src={`${BUCKET_URL}/date-event.svg`}
            className="mr-2"
          />
          {event.name}
        </div>
        <div className="flex flex-row items-center justify-center rounded-lg bg-brand-color h-12">
          <p className="font-quickSand text-black font-bold text-base">
            {event.stalls}
          </p>
          <Image
            alt="stalls"
            width={25}
            height={25}
            src={`${BUCKET_URL}/stalls.svg`}
            className="ml-2"
          />
        </div>
        <div className="h-12 flex flex-row items-center justify-center rounded-lg bg-black text-white font-bold font-quickSand text-base cursor-pointer">
          View Event
        </div>
        <div className="flex flex-row items-center justify-center rounded-lg bg-brand-color h-12">
          <p className="font-quickSand text-black font-bold text-base">
            {event.visitors}
          </p>
          <Image
            alt="visitors"
            width={30}
            height={30}
            src={`${BUCKET_URL}/visitors.svg`}
            className="ml-2"
          />
        </div>
      </div>
    );
  }
}
