import React from "react";
import Image from "next/image";
import { BUCKET_URL } from "@/config/constant";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import CallIcon from "@mui/icons-material/Call";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

export default function Credits() {
  return (
    <div className="credits w-full py-4 flex flex-col items-center px-4 md:-left-2 md:-right-2 left-0 right-0 rounded-tl-3xl rounded-tr-3xl">
      <div className="divider"></div>
      <div className="flex flex-col justify-center items-center">
        {/* <p className=" font-lato text-xl font-bold mb-1">Event Organizer</p> */}
        <Image
          alt="logo-main"
          src={`${BUCKET_URL}/neofairs-lite/logo.svg`}
          width={20}
          height={20}
          className="w-full h-auto"
        />
        <div className=" flex gap-3 flex-row justify-center items-center">
          <a href="https://www.neofairs.com/" target="_blank">
            <InstagramIcon sx={{ fontSize: 24, color: "gray" }} />
            {/* <Image
              alt="instagram"
              src={`${BUCKET_URL}/square-instagram.svg`}
              height={100}
              width={100}
              className=" h-4 w-4"
            ></Image> */}
          </a>
          <a href="https://www.neofairs.com/" target="_blank">
            <FacebookIcon sx={{ fontSize: 24, color: "gray" }} />
            {/* <Image
              alt="facebook"
              src={`${BUCKET_URL}/square-facebook.svg`}
              height={100}
              width={100}
              className=" h-4 w-4"
            ></Image> */}
          </a>
          <a href="https://www.neofairs.com/" target="_blank">
            <CallIcon sx={{ fontSize: 24, color: "gray" }} />
            {/* <Image
              alt="phone"
              src={`${BUCKET_URL}/square-phone.svg`}
              height={100}
              width={100}
              className=" h-4 w-4"
            ></Image> */}
          </a>
          <a href="https://www.neofairs.com/" target="_blank">
            <WhatsAppIcon sx={{ fontSize: 24, color: "gray" }} />
            {/* <Image
              alt="whatsapp"
              src={`${BUCKET_URL}/square-whatsapp.svg`}
              height={100}
              width={100}
              className=" h-4 w-4"
            ></Image> */}
          </a>
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
