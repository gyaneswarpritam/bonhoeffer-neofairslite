import { BUCKET_URL } from "@/config/constant";
import Image from "next/image";
import React from "react";

export default function Welcome({ handleClose }) {
  return (
    <>
      <div
        className="bg-brand-color w-8 aspect-square h-auto rounded-full flex justify-center 
        items-center cursor-pointer absolute top-4 right-4"
        onClick={handleClose}
      >
        <Image
          src={`${BUCKET_URL}/chat/close.svg`}
          width={3000}
          height={3000}
          className="w-4 aspect-square h-auto "
        />
      </div>
      <div className="text-center" style={{ marginTop: "15%", width: "100%" }}>
        <div style={{ fontSize: "28px" }}>Welcome</div>
        <div style={{ fontSize: "24px" }}>
          Please select a chat to Start messaging.
        </div>
      </div>
    </>
  );
}
