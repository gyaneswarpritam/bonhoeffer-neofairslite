"use client";
import React from "react";
import Image from "next/image";
import "./contactModel.css";
import { request } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { BUCKET_URL } from "@/config/constant";

const ConfirmModel = ({ meetingId, handleClick, instantMeetingData }) => {
  const router = useRouter();
  const fetchInstantMeetingData = async () => {
    return request({
      url: `visitor/instant-meeting/${meetingId}`,
      method: "get",
    });
  };

  const {
    isLoading,
    data: instantMeeting,
    isError,
    error,
  } = useQuery({
    queryKey: ["instant-meeting-visitor", meetingId], // Include meetingId in the queryKey
    queryFn: fetchInstantMeetingData,
    enabled: !!meetingId, // Enable the query only if meetingId is present
    refetchInterval: 500,
  });

  if (instantMeeting) {
    if (instantMeeting && instantMeeting.length > 0) {
      handleClick();
      router.push(`/visitor/video-chat?id=${instantMeeting[0]._id}`);
    }
  }
  return (
    <div className="  contactWrapper w-full md:w-[50%] min-h-[200px] fixed z-[2000] bg-white inset-x-0 m-auto p-5 md:p-5 rounded-lg mt-16">
      <div className="w-full h-10 flex justify-between items-center">
        <p className=" text-2xl font-bold font-lato">Waiting Room</p>
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
      <hr className="w-full mt-5" />
      <div
        className=" contactContent w-full h-full mt-5 flex flex-col gap-5 justify-center items-center text-center pb-5"
        id="my-element"
      >
        <div className="w-full h-full flex flex-col gap-5">
          {instantMeetingData &&
          instantMeetingData[0] &&
          instantMeetingData[0]?.rejected ? (
            <h2>
              The request declined by exhibitor. Please try after sometime.
            </h2>
          ) : (
            <h2>Please wait till the exhibitor accepts your request</h2>
          )}
        </div>
        <input
          onClick={handleClick}
          type="button"
          value="Cancel"
          className="cursor-pointer mr-2 font-lato text-base font-bold text-white bg-static-black rounded-lg px-4 py-2 mt-10 mb-4 md:w-min w-full"
        />
      </div>
    </div>
  );
};

export default ConfirmModel;
