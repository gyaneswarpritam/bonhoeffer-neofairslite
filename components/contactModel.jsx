import React from "react";
import html2canvas from "html2canvas";
import Image from "next/image";
import "./contactModel.css";
import { BUCKET_URL } from "@/config/constant";

const ContactModel = ({ handleClick, visitingCard }) => {
  const handleDownloadClick = async () => {
    const element = document.getElementById("my-element");
    const canvas = await html2canvas(element);
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "my-image.png";
    link.click();
  };
  return (
    <div className=" contactWrapper w-full md:w-[60%] min-h-[400px] fixed z-[2000] bg-white inset-x-0 m-auto p-5 md:p-10 rounded-lg">
      <div className="w-full h-10 flex justify-between items-center">
        <p className=" text-2xl font-bold font-lato">E-Visiting Card</p>
        <Image
          alt="img"
          src={`${BUCKET_URL}/download.svg`}
          height={100}
          width={100}
          className=" w-8 aspect-square cursor-pointer"
          onClick={handleDownloadClick}
        ></Image>
        <Image
          alt="img"
          src={`${BUCKET_URL}/Close.png`}
          unoptimized
          height={100}
          width={100}
          className="w-5 h-auto cursor-pointer"
          onClick={handleClick}
        ></Image>
      </div>

      <div
        className=" contactContent w-full h-full mt-5 flex flex-col gap-5 justify-center items-center text-center pb-5"
        id="my-element"
      >
        <div
          className="w-full h-32 bg-[#DDDDDC] rounded-lg relative mb-20"
          style={{
            backgroundImage: `url(${visitingCard.stallLogo})`,
            backgroundSize: "cover",
          }}
        >
          <Image
            alt="img"
            width={100}
            height={100}
            src={visitingCard.companyLogo}
            className=" w-32 h-32 rounded-full absolute left-0 right-0 m-auto top-20"
            unoptimized
          ></Image>
        </div>
        <div className="w-full h-full flex flex-col gap-5 justify-center items-center text-center">
          <p className=" text-lg font-lato font-bold">
            {visitingCard &&
              visitingCard.visitng_card_details &&
              visitingCard.visitng_card_details.name}
          </p>
          <p className="font-lato text-sm font-medium">
            {visitingCard &&
              visitingCard.visitng_card_details &&
              visitingCard.visitng_card_details.email}
          </p>
          <p className="font-lato text-sm font-medium">
            {visitingCard &&
              visitingCard.visitng_card_details &&
              visitingCard.visitng_card_details.phone}
          </p>
          <p className="font-lato text-sm font-medium">
            {visitingCard &&
              visitingCard.visitng_card_details &&
              visitingCard.visitng_card_details.address}
          </p>
          <p className="font-lato text-sm font-medium">
            {visitingCard &&
              visitingCard.visitng_card_details &&
              visitingCard.visitng_card_details.website}
          </p>
          <p className="font-lato text-sm font-medium">
            {visitingCard && visitingCard.stallName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactModel;
