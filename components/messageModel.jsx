"use client";
import React from "react";
import Image from "next/image";
import "./contactModel.css";
import { BUCKET_URL } from "@/config/constant";

const MessageModel = ({ messageHeader, messageBody, handleClose }) => {
  return (
    <div className="  contactWrapper w-full md:w-[50%] min-h-[200px] fixed z-[2000] bg-white inset-x-0 m-auto p-5 md:p-5 rounded-lg mt-16">
      <div className="w-full h-10 flex justify-between items-center">
        <p className=" text-2xl font-bold font-lato">{messageHeader}</p>
        <Image
          alt="img"
          src={`${BUCKET_URL}/Close.png`}
          unoptimized
          height={100}
          width={100}
          className="w-5 h-auto cursor-pointer"
          onClick={handleClose}
        ></Image>
      </div>
      <hr className="w-full mt-5" />
      <div
        className=" contactContent w-full h-full mt-5 flex flex-col gap-5 justify-center items-center text-center pb-5"
        id="my-element"
      >
        <div className="w-full h-full flex flex-col gap-5">
          <h2>{messageBody}</h2>
        </div>
        <input
          onClick={handleClose}
          type="button"
          value="OK"
          className="cursor-pointer mr-2 font-lato text-base font-bold text-white bg-static-black rounded-lg px-4 py-2 mt-10 mb-4 md:w-min w-full"
        />
      </div>
    </div>
  );
};

export default MessageModel;
