import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BUCKET_URL } from "@/config/constant";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const BlackFooter = () => {
  return (
    <section className=" bg-black flex flex-col sm:flex-row gap-2 justify-center sm:justify-between py-1 px-6">
      <div className=" flex flex-row justify-center items-center gap-3">
        <p className=" text-xs font-bold font-quickSand text-brand-color">
          PoweredBy
        </p>
        <Link href="https://www.neofairs.com/" target="_blank">
          <Image
            alt="logo"
            src={`${BUCKET_URL}/bottom-logo.svg`}
            height={100}
            width={100}
            className=" h-auto w-full max-w-[86px]"
          ></Image>
        </Link>
      </div>
      <p className=" font-quickSand font-bold text-xs text-brand-color text-center">
        Neofairs © 2024
      </p>
      <div className=" flex gap-3 flex-row justify-center items-center">
        <a
          href="https://www.instagram.com/neofairs.virtualevents/"
          target="_blank"
        >
          <InstagramIcon sx={{ fontSize: 24, color: "white" }} />
        </a>
        <a href="https://www.facebook.com/neofairs" target="_blank">
          <FacebookIcon sx={{ fontSize: 24, color: "white" }} />
        </a>
        <a href="https://www.youtube.com/@neofairs" target="_blank">
          <YouTubeIcon sx={{ fontSize: 24, color: "white" }} />
        </a>
        <a href="https://www.linkedin.com/company/neofairs/" target="_blank">
          <LinkedInIcon sx={{ fontSize: 24, color: "white" }} />
        </a>
        {/* <a
          href="https://www.instagram.com/neofairs.virtualevents/"
          target="_blank"
        >
          <Image
            alt="instagram"
            src={`${BUCKET_URL}/square-instagram.svg`}
            height={100}
            width={100}
            className=" h-4 w-4"
          ></Image>
        </a> */}
        {/* <a href="https://www.facebook.com/neofairs" target="_blank">
          <Image
            alt="facebook"
            src={`${BUCKET_URL}/square-facebook.svg`}
            height={100}
            width={100}
            className=" h-4 w-4"
          ></Image>
        </a>
        <a href="https://www.linkedin.com/company/neofairs/" target="_blank">
          <Image
            alt="linkedin"
            src={`${BUCKET_URL}/square-linkedin.svg`}
            height={100}
            width={100}
            className=" h-4 w-4"
          ></Image>
        </a>
        <a href="https://www.youtube.com/@neofairs" target="_blank">
          <Image
            alt="whatsapp"
            src={`${BUCKET_URL}/square-youtube.svg`}
            height={100}
            width={100}
            className=" h-4 w-4"
          ></Image>
        </a> */}
      </div>
    </section>
  );
};

export default BlackFooter;
