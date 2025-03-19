import CommonDataTableView from "@/components/grid/CommonDataTableView";
import { BUCKET_URL } from "@/config/constant";
import Image from "next/image";
import React, { useState } from "react";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isSameOrAfter);

const Mybookings = ({ handleModelClose, bookedSlots, tableColumnDef }) => {
  const [activeTab, setActiveTab] = useState("upcoming meetings");

  const today = dayjs().format("YYYY-MM-DD");

  // Filter upcoming and completed meetings
  const upcomingMeetings = bookedSlots && bookedSlots.length ? bookedSlots.filter((meeting) =>
    dayjs(meeting.Date).isSameOrAfter(today)
  ) : [];
  const completedMeetings = bookedSlots && bookedSlots.length ? bookedSlots.filter((meeting) =>
    dayjs(meeting.Date).isBefore(today)
  ) : [];

  return (
    <div className="w-full h-[100%] bg-[#000000af] fixed left-0 right-0 top-0 bottom-0 z-[1000] py-5 px-2 md:p-5">
      <div className="rounded-[32px] relative overflow-hidden h-full bg-white pb-5">
        {/* Header */}
        <div className="headerDiv w-full h-20 flex flex-row gap-3 justify-between px-5 items-center bg-[#222222] text-white text-lg font-lato">
          <p className="header text-xl font-lato font-bold">My Meetings</p>
          <div
            onClick={() => handleModelClose()}
            className="w-auto h-5 aspect-square rounded-full bg-brand-color cursor-pointer flex justify-center items-center"
          >
            <Image
              alt="close"
              height={100}
              width={100}
              src={`${BUCKET_URL}/visitor/close.svg`}
              className="w-[60%] h-auto"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-5 border-b pb-0 px-8 mt-4">
          <button
            className={`px-4 py-2 ${activeTab === "upcoming meetings"
              ? "border-b-2 border-blue-500 font-bold"
              : "text-gray-600"
              }`}
            onClick={() => setActiveTab("upcoming meetings")}
          >
            Upcoming Meetings
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "completed meetings"
              ? "border-b-2 border-blue-500 font-bold"
              : "text-gray-600"
              }`}
            onClick={() => setActiveTab("completed meetings")}
          >
            Completed Meetings
          </button>
        </div>

        {/* Tab Content */}
        <div className="w-full h-[80vh] px-2 md:px-8 bg-white rounded-b-[32px] pb-5 overflow-auto">
          {activeTab === "upcoming meetings" ? (
            <div className="w-full min-h-fit h-full max-h-[90%] bg-white mt-5">
              <div className="ag-theme-alpine pb-1 w-full h-full">
                <CommonDataTableView
                  columns={tableColumnDef}
                  rowData={upcomingMeetings}
                  filename=""
                />
              </div>
            </div>
          ) : (
            <div className="w-full min-h-fit h-full max-h-[90%] bg-white mt-5">
              <div className="ag-theme-alpine pb-1 w-full h-full">
                <CommonDataTableView
                  columns={tableColumnDef}
                  rowData={completedMeetings}
                  filename=""
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mybookings;
