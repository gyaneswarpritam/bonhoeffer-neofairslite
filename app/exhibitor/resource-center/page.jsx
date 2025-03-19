"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import "./resource.css";
import { useDispatch, useSelector } from "react-redux";
import { toggleNavbar } from "@/GlobalRedux/features/common/commonSlice";
import {
  modelChange,
  modelOpen,
} from "@/GlobalRedux/features/dialogs/dialogSlice";
import { useQuery } from "@tanstack/react-query";
import { request } from "@/lib/axios";
import { BUCKET_URL } from "@/config/constant";

const page = () => {
  const dispatch = useDispatch();
  const isModelOpen = useSelector((state) => state.dialog.isopen);

  const fetchDirectoryData = async () => {
    return request({ url: `visitor/directory`, method: "get" });
  };
  const { data: directoryData } = useQuery({
    queryKey: ["directory"],
    queryFn: fetchDirectoryData,
  });

  const fetchVisualData = async () => {
    return request({ url: `visitor/visual`, method: "get" });
  };
  const { data: visualData } = useQuery({
    queryKey: ["visual"],
    queryFn: fetchVisualData,
  });

  const fetchMediaData = async () => {
    return request({ url: `visitor/media`, method: "get" });
  };
  const { data: mediaData } = useQuery({
    queryKey: ["media"],
    queryFn: fetchMediaData,
  });

  const fetchFaqData = async () => {
    return request({ url: `visitor/faq`, method: "get" });
  };
  const { data: faqData } = useQuery({
    queryKey: ["faq"],
    queryFn: fetchFaqData,
  });

  useEffect(() => {
    dispatch(toggleNavbar(false));
  }, []);

  const handleModelopen = (e) => {
    dispatch(modelChange(e));
    dispatch(modelOpen());
  };

  return (
    <div style={{ position: "relative", height: "100vh", width: "100%" }}>
      <video
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        autoPlay
        loop
      >
        <source src={`${BUCKET_URL}/video/Lounge.mp4`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <main className="custom-color-bg">
        {isModelOpen ? (
          <ResourceCenterModel
            directoryData={directoryData}
            visualData={visualData}
            mediaData={mediaData}
            faqData={faqData}
          />
        ) : (
          ""
        )}
        <section className="w-full h-[100vh] bg-center">
          <div className="fixed z-[20] top-1/2 -translate-y-1/2 left-0 nav-wrapper right px-3 md:px-6 py-4 flex flex-col gap-6">
            <div
              className="max-w-[45px] flex flex-col justify-center items-center"
              onClick={() => handleModelopen("directory")}
            >
              <div className="w-10 h-10 p-2 bg-[#23272D] rounded-md">
                <Image
                  width={3000}
                  height={3000}
                  className="w-full h-auto"
                  src={`${BUCKET_URL}/resource/Meeting.svg`}
                />
              </div>
              <p className="text-xs font-quickSand font-bold mt-1">
                Fair Directory
              </p>
            </div>
            <div
              className="max-w-[45px] flex flex-col justify-center items-center"
              onClick={() => handleModelopen("visual")}
            >
              <div className="w-10 h-10 p-2 bg-[#23272D] rounded-md">
                <Image
                  width={3000}
                  height={3000}
                  className="w-full h-auto"
                  src={`${BUCKET_URL}/resource/video.svg`}
                />
              </div>
              <p className="text-xs font-quickSand font-bold mt-1 text-center">
                Audio & Visuals
              </p>
            </div>
            <div
              className="max-w-[45px] flex flex-col justify-center items-center"
              onClick={() => handleModelopen("media")}
            >
              <div className="w-10 h-10 p-2 bg-[#23272D] rounded-md">
                <Image
                  width={3000}
                  height={3000}
                  className="w-full h-auto"
                  src={`${BUCKET_URL}/resource/chat.svg`}
                />
              </div>
              <p className="text-xs font-quickSand font-bold mt-1">
                Press & Media
              </p>
            </div>
            <div
              className="max-w-[45px] flex flex-col justify-center items-center"
              onClick={() => handleModelopen("faq")}
            >
              <div className="w-10 h-10 p-2 bg-[#23272D] rounded-md">
                <Image
                  width={3000}
                  height={3000}
                  className="w-full h-auto"
                  src={`${BUCKET_URL}/resource/faq.svg`}
                />
              </div>
              <p className="text-xs font-quickSand font-bold mt-1">FAQs</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default page;
