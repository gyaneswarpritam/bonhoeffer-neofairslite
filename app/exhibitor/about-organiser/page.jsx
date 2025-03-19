"use client";
import React, { useState } from "react";
import Image from "next/image";
import LocationBand from "@/components/visitor/locationBand";
import { BUCKET_URL } from "@/config/constant";

export default function Page() {
  return (
    <section
      className="no-scrollbar lg:pl-3 lg:pr-5 lg:py-5 bg-white w-full relative pt-20  px-3 lg:min-h-screen  flex flex-col gap-[1.25rem]"
      id="main-content-body"
    >
      <LocationBand></LocationBand>
      <div>
        <Image
          src={`${BUCKET_URL}/flight.png`}
          height={3000}
          width={3000}
          alt="flight"
          className=" w-full h-auto"
          unoptimized
        ></Image>
        <div className="boxes-main px-12 py-8 mt-6">
          <p className=" text-xl font-lato font-bold">Catalogue Analytics</p>
          <p className=" font-lato font-medium text-base mt-5">
            Indian Handwoven and Hometextiles Sourcing (IHHS) fair is an
            exclusive Virtual Buyer Seller Meet specifically designed for each
            region/country.
            <br />
            <br />
            IHHS brings together manufacturers, suppliers and related services
            in Handloom sector under one roof to showcase their merchandise to
            discerning buyers.
            <br />
            <br />
            Products such as Table Linen, Kitchen Linen, Bed Linen, Bath Linen,
            Curtains, Furnishing Articles, Floor coverings, Fabrics, Fashion
            accessories, Trimmings & Embellishments will be on display in this
            virtual event.
          </p>
          <div className=" flex flex-row flex-wrap gap-14 mt-16 justify-center ">
            <Image
              src={`${BUCKET_URL}/indian.png`}
              alt="indian"
              height={3000}
              width={3000}
              className=" w-full max-w-[225px] h-auto"
              unoptimized
            ></Image>
            <div className=" flex flex-row gap-8 justify-center items-center">
              <Image
                src={`${BUCKET_URL}/social/zoom.svg`}
                alt="zoom"
                width={3000}
                height={3000}
                className=" w-8 h-auto"
              ></Image>
              <Image
                src={`${BUCKET_URL}/social/facebook.svg`}
                alt="zoom"
                width={3000}
                height={3000}
                className=" w-8 h-auto"
              ></Image>
              <Image
                src={`${BUCKET_URL}/social/linkedin.svg`}
                alt="zoom"
                width={3000}
                height={3000}
                className=" w-8 h-auto"
              ></Image>
              <Image
                src={`${BUCKET_URL}/social/x.svg`}
                alt="zoom"
                width={3000}
                height={3000}
                className=" w-8 h-auto"
              ></Image>
              <Image
                src={`${BUCKET_URL}/social/web.svg`}
                alt="zoom"
                width={3000}
                height={3000}
                className=" w-8 h-auto"
              ></Image>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
