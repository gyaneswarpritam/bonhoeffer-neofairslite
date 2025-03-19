import React from "react";
import BookMeetingComponent from "./visitor/lite/bookMeetings/BookMeetingComponent";
import { BUCKET_URL } from "@/config/constant";
import Image from "next/image";

const VisitorMeetingModal = ({
  handleClose,
  requestForInstantMeeting,
  stallData,
}) => {
  return (
    // <div
    //   className="w-full h-full fixed left-0 top-0 flex flex-col
    // justify-center items-center mx-auto my-auto px-1 py-1 overflow-auto gap-5 z-[99999] bg-bg-grey"
    // >
    //   <BookMeetingComponent />
    // </div>
    <div className="w-full h-[100%] bg-white fixed left-0 right-0 top-0 bottom-0 z-[400] mx-auto my-auto justify-center items-start">
      <div className=" headerDiv w-full h-20 flex justify-between items-center bg-[#222222] text-white text-lg font-lato  px-8">
        <p className=" header text-2xl font-lato font-bold">Meeting Booking</p>
        <div
          onClick={handleClose}
          className=" w-6 h-6 p-2 rounded-full bg-brand-color cursor-pointer"
        >
          <Image
            alt="close"
            height={100}
            width={100}
            src={`${BUCKET_URL}/Close.png`}
            unoptimized
            className=" w-full h-auto"
          ></Image>
        </div>
      </div>
      <BookMeetingComponent
        requestForInstantMeeting={requestForInstantMeeting}
        stallData={stallData}
      />
    </div>
  );
};

export default VisitorMeetingModal;
