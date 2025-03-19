import React from "react";
import Image from "next/image";
import { BUCKET_URL } from "@/config/constant";

function locationBand() {
  return (
    <div className="bg-[#F5F5F5] flex flex-col md:flex-row items-start md:items-center justify-between boxes-main gap-3">
      <div className="flex max-w-full justify-center items-center">
        <Image
          alt="img"
          width={35}
          height={35}
          src={`${BUCKET_URL}/Event-chosen/location-icon.png`}
          className="mr-3"
          unoptimized
        ></Image>
        <div>
          <p className="font-quickSand text-sm font-bold text-black">
            10 Downing Street
          </p>
          <p className="font-quickSand text-xs text-black">
            London • United Kingdom
          </p>
        </div>
      </div>
      <p className="font-quickSand text-xl font-bold text-black">
        UK Fair Expo Constructions Theme
      </p>
      <div className="flex max-w-full justify-center items-center">
        <Image
          alt="img"
          width={35}
          height={35}
          src={`${BUCKET_URL}/Event-chosen/Calender.png`}
          className="mr-3"
          unoptimized
        ></Image>
        <div>
          <p className="font-quickSand text-sm font-bold text-black">
            From: 15 May, 2023
            <br />
            To: 20 May, 2023
          </p>
        </div>
      </div>
    </div>
  );
}

export default locationBand;
