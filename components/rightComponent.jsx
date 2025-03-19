import React from "react";
import Image from "next/image";
import { BUCKET_URL } from "@/config/constant";

function RightComponent(onPress) {
  return (
    <div className="md:w-[30%] w-full boxes-main flex flex-col gap-7">
      <div className=" bg-[#23272D] px-4 py-2 rounded-lg flex flex-row gap-2.5 justify-start">
        <Image
          height={32}
          width={32}
          src={`${BUCKET_URL}/Marketing/campaign.svg`}
        />
        <p
          onClick={JSON.stringify(onPress) != "{}" ? onPress.onPress[1] : ""}
          className="text-lg text-white font-bold"
        >
          Start a new Campaign
        </p>
      </div>
      <div className="p-4 rounded-lg bg-white flex flex-col">
        <div className="rounded-lg flex flex-row gap-2.5 justify-start mb-[50px]">
          <Image
            height={15}
            width={18.5}
            src={`${BUCKET_URL}/Marketing/mail.svg`}
          />
          <p className="text-lg text-black font-bold">Campaign Name is dolor</p>
        </div>
        <div className="flex flex-row md:flex-col lg:flex-row md:justify-between justify-evenly items-center mb-[30px]">
          <div className=" max-w-[98px]">
            <p className=" text-sm font-quickSand font-semibold">Impressions</p>
            <p className=" mt-5 text-4xl font-bold font-quickSand">230K</p>
          </div>
          <div className=" w-[1px] h-full bg-[#a7a7a76e]"></div>
          <div className=" max-w-[98px]">
            <p className=" text-sm font-quickSand font-semibold">Clicks</p>
            <p className=" mt-5 text-4xl font-bold font-quickSand">120K</p>
          </div>
        </div>
        <button
          onClick={JSON.stringify(onPress) != "{}" ? onPress.onPress[0] : ""}
          className="w-full bg-brand-color rounded-lg h-10"
        >
          Click to know More
        </button>
      </div>
      <div className="p-4 rounded-lg bg-white flex flex-col">
        <div className="rounded-lg flex flex-row gap-2.5 justify-start mb-[50px]">
          <Image
            height={15}
            width={18.5}
            src={`${BUCKET_URL}/Marketing/sms.svg`}
          />
          <p className="text-lg text-black font-bold">Campaign Name is dolor</p>
        </div>
        <div className="flex flex-row md:flex-col lg:flex-row md:justify-between justify-evenly items-center mb-[30px]">
          <div className=" max-w-[98px]">
            <p className=" text-sm font-quickSand font-semibold">Impressions</p>
            <p className=" mt-5 text-4xl font-bold font-quickSand">230K</p>
          </div>
          <div className=" w-[1px] h-full bg-[#a7a7a76e]"></div>
          <div className=" max-w-[98px]">
            <p className=" text-sm font-quickSand font-semibold">Clicks</p>
            <p className=" mt-5 text-4xl font-bold font-quickSand">120K</p>
          </div>
        </div>
        <button className="w-full bg-brand-color rounded-lg h-10">
          Click to know More
        </button>
      </div>
    </div>
  );
}

export default RightComponent;
