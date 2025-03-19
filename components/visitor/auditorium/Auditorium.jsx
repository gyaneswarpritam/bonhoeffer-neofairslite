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
      <section className="auditorium-container" id="main-content-body">
        <div className="wrapper">
          {/* Background Image */}
          <Image
            alt="auditorium"
            src={`${BUCKET_URL}/auditorium/Audi1.jpg`}
            height={3000}
            width={3000}
            className="background-image"
            unoptimized
          />

          {/* YouTube Video */}
          <div className="imageres">
            {auditorium && auditorium.length > 0 && (
              <iframe
                allowFullScreen
                src={`${auditorium[0].url}?rel=0`}
                className="responsive-iframe"
                title="auditorium-video"
              ></iframe>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Auditorium;
