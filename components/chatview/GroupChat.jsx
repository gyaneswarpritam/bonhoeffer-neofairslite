import { BUCKET_URL } from "@/config/constant";
import Image from "next/image";
import React from "react";

const GroupChat = ({ text, type, time, by }) => {
  return type == "sent" ? (
    <div className=" max-w-sm  ml-auto">
      <p className=" bg-white border border-static-black rounded-2xl px-4 py-2 text-base text-black font-semibold overflow-hidden">
        {text}
        <span className=" font-medium font-quickSand text-[10px] float-right align-bottom ml-2  leading-[10px] mt-3">
          {time}
        </span>
      </p>
      <p className=" font-quickSand font-semibold text-[10px] text-right text-[#A7A7A7] pr-3">
        {by}
      </p>
    </div>
  ) : (
    <div className=" max-w-sm flex gap-3 justify-start items-start">
      <div className=" min-w-[36px] w-9 p-2 aspect-square h-auto rounded-full bg-black">
        <Image
          src={`${BUCKET_URL}/chat/account-pic.svg`}
          height={3000}
          width={3000}
          className="w-full h-auto"
        ></Image>
      </div>
      <div>
        <p className=" bg-brand-color rounded-2xl px-4 py-2 text-base text-black font-semibold overflow-hidden">
          {text}
          <span className=" font-medium font-quickSand text-[10px] float-right align-bottom ml-2  leading-[10px] mt-3">
            {time}
          </span>
        </p>
        <p className=" font-quickSand font-semibold text-[10px] text-[#A7A7A7] pl-3">
          Sent by {by}
        </p>
      </div>
    </div>
  );
};

export default GroupChat;
