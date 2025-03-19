import React from "react";
import Image from "next/image";
import { BUCKET_URL } from "@/config/constant";

export default function Credits() {
  return (
    <div className="credits absolute bottom-0 bg-black-2 py-4 flex flex-col items-center px-4 md:-left-2 md:-right-2 left-0 right-0 rounded-tl-3xl rounded-tr-3xl">
      <Image
        alt="logo-main"
        src={`${BUCKET_URL}/logo-main.svg`}
        width={20}
        height={20}
        className="w-auto h-8"
      />
      <div className="w-full">
        <div className="divider_alt"></div>
      </div>
      <div className="font-quickSand text-xs font-bold text-white">
        Powered by © NeoFairs
      </div>
      <div className="social-media-icons flex flex-row items-center justify-between w-1/2 my-4">
        <Image
          alt="instagram"
          src={`${BUCKET_URL}/instagram.svg`}
          width={20}
          height={20}
        />
        <Image
          alt="facebook"
          src={`${BUCKET_URL}/facebook.svg`}
          width={20}
          height={20}
        />
        <Image
          alt="phone"
          src={`${BUCKET_URL}/phone.svg`}
          width={20}
          height={20}
        />
        <Image
          alt="whatsapp"
          src={`${BUCKET_URL}/whatsapp.svg`}
          width={20}
          height={20}
        />
      </div>
      <div className="font-quickSand text-xs font-semibold text-white">
        Stay Connected with Us.
      </div>
    </div>
  );
}
