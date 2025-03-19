"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import "./auditorium.css";
import { BUCKET_URL } from "@/config/constant";
import { request } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

const Auditorium = () => {
  const [videoId, setVideoId] = useState();

  const fetchAllStall = async () => {
    return request({ url: "visitor/auditorium", method: "get" });
  };

  const {
    isLoading,
    data: auditorium,
    isError,
    error,
  } = useQuery({
    queryKey: ["auditorium-data"],
    queryFn: fetchAllStall,
  });

  useEffect(() => {
    if (auditorium && auditorium.length > 0) {
      const videoId = auditorium[0].url.split("embed/")[1];
      setVideoId(videoId);
    }
  }, [auditorium]);

  return (
    <main className="w-full h-auto overflow-hidden relative">
      <section
        className="bg-white max-w-[1440px] mx-auto w-full h-[100dvh] md:h-[100vh] relative overflow-x-hidden lg:h-screen flex flex-col items-center"
        id="main-content-body"
      >
        <div className="relative h-fit w-full max-h-full mb-10 md:mb-0 wrapper">
          <Image
            alt="auditorium"
            src={`${BUCKET_URL}/auditorium/Audi1.jpg`}
            height={3000}
            width={3000}
            className="w-full h-full"
            unoptimized
          />

          <div className="w-[50%] h-[30%] absolute imageres top-[25%] left-0 right-0 mx-auto z-10">
            {auditorium && auditorium.length > 0 && (
              <iframe
                allowFullScreen
                src={`${auditorium[0].url}?rel=0`}
                className="w-full h-[calc(100vh-60vh)]"
                title="iframe"
              ></iframe>
            )}
          </div>
        </div>
        <div className="md:hidden flex justify-center items-center gap-3 rotateText">
          <Image
            alt="rotate"
            src={`${BUCKET_URL}/rotate-screen.svg`}
            height={100}
            width={100}
            className="w-5 h-auto"
          />
          <p className="text-center text-base font-semibold text-accent-font-color opacity-80">
            Rotate your phone for better view
          </p>
        </div>
      </section>
    </main>
  );
};

export default Auditorium;
