import React from "react";
import Image from "next/image";
import { BUCKET_URL } from "@/config/constant";

export default function Credits() {
  return (
    <div className="credits w-full py-4 flex flex-col items-center px-4 md:-left-2 md:-right-2 left-0 right-0 rounded-tl-3xl rounded-tr-3xl">
      <div className="divider"></div>
      <div className="flex flex-col justify-center items-center">
        {/* <p className=" font-lato text-xl font-bold mb-1">Event Organizer</p> */}
        <Image
          alt="logo-main"
          src={`${BUCKET_URL}/logo.svg`}
          width={20}
          height={20}
          className="w-full h-auto"
        />
        <div className="social-media-icons flex flex-row items-center gap-2 justify-between w-1/2 my-4 invert opacity-75">
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
      </div>
      {/* <div className="divider"></div> */}
      {/* <div className="font-quickSand text-xs font-bold text-black">
        Powered by © NeoFairs
      </div> */}
      {/* <div className="social-media-icons flex flex-row items-center gap-2 justify-between w-1/2 my-4 invert">
        <Image alt="instagram" src="/instagram.svg" width={15} height={15} />
        <Image alt="facebook" src="/facebook.svg" width={15} height={15} />
        <Image alt="phone" src="/phone.svg" width={15} height={15} />
        <Image alt="whatsapp" src="/whatsapp.svg" width={15} height={15} />
      </div> */}
      {/* <div className="font-quickSand text-xs font-semibold text-black">
        Stay Connected with Us.
      </div> */}
    </div>
  );
}
