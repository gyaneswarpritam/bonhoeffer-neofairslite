"use client";
import React from "react";
import Image from "next/image";
import "chart.js/auto";
import { useQuery } from "@tanstack/react-query";
import { request } from "@/lib/axios";
import { BUCKET_URL } from "@/config/constant";

const CreateStallWiget = (onButtonClick) => {
  const exhibitorId =
    typeof window !== "undefined" ? sessionStorage.getItem("id") : null;

  const fetchStall = async () => {
    return request({
      url: `exhibitor/stall-by-exhibitor/${exhibitorId}`,
      method: "get",
    });
  };

  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["stallDetails"],
    queryFn: fetchStall,
  });

  return (
    <div className="md:w-[80%] w-full flex flex-col gap-5">
      <div className="flex flex-col xl:flex-row justify-between items-center xl:items-start xl:px-4 xl:mb-1 mb-5  boxes-main bg-white gap:10 xl:gap-20">
        <div className="w-full xl:w-1/2 p-8 ">
          <p className="font-quickSand text-xl font-bold text-black">
            Stall Settings
          </p>
          <div className=" flex flex-row gap-2.5 justify-start items-center mt-4">
            <Image
              alt="img"
              src={`${BUCKET_URL}/stalls/stalls.svg`}
              height={3000}
              width={3000}
              className="w-8 h-8"
            ></Image>
            <p className=" text-xs font-quickSand font-semibold text-accent-font-color">
              Create a Stall in a hall of your choice. Create it for an
              exhibitor or for yourself.
            </p>
          </div>
          {isLoading ? (
            <></>
          ) : data && data.stall && data.stall._id ? (
            <button
              onClick={onButtonClick.onButtonClick}
              className=" mt-10 bg-brand-color text-sm font-quickSand font-bold px-4 py-2 uppercase"
            >
              Edit stall
            </button>
          ) : (
            <button
              onClick={onButtonClick.onButtonClick}
              className=" mt-10 bg-brand-color text-sm font-quickSand font-bold px-4 py-2 uppercase"
            >
              Create a stall
            </button>
          )}
        </div>
        <Image
          alt="img"
          className="w-full xl:w-1/2 max-w-sm"
          src={`${BUCKET_URL}/stalls/StallSettingHome.png`}
          height={3000}
          width={3000}
          unoptimized
        ></Image>
      </div>
    </div>
  );
};

export default CreateStallWiget;
