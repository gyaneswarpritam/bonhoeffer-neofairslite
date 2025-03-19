import { BUCKET_URL } from "@/config/constant";
import Image from "next/image";
import React from "react";

const VideoModal = ({ title, videoUrl, handleModelClose }) => {
  return (
    <div className="w-full h-[100%] bg-[#000000af] fixed left-0 right-0 top-0 bottom-0 z-[1000]">
      <div className=" rounded-[32px] relative overflow-hidden h-full bg-white">
        <div className=" headerDiv absolute z-50 top-0 w-full h-fit md:h-20 flex flex-col gap-5 md:flex-row justify-between items-start md:items-center bg-[#222222] text-white text-lg font-lato px-8 py-5 md:py-0">
          <p className=" header md:text-2xl sm:text-xl font-lato font-bold text-center">
            {title}
          </p>
          <div className=" flex flex-row gap-3 justify-center items-center">
            <div
              onClick={() => handleModelClose()}
              className="flex-shrink-0 w-auto h-5 aspect-square rounded-full flex justify-center items-center bg-brand-color cursor-pointer md:relative absolute md:top-0 md:right-0 top-5 right-5"
            >
              <Image
                alt="close"
                height={100}
                width={100}
                src={`${BUCKET_URL}/visitor/close.svg`}
                className="w-[60%] h-auto"
              ></Image>
            </div>
          </div>
        </div>
        <div className=" w-full h-full bg-white rounded-b-[32px] overflow-hidden ">
          <iframe
            contr
            src={`${videoUrl}?rel=0`}
            className="w-full h-[calc(100vh-1px)]"
            title="iframe"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
