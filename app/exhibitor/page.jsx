"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import LocationBand from "@/components/exibitor/locationBand";
import "chart.js/auto";
import { Doughnut } from "react-chartjs-2";
import {
  entryVisibility,
  toggleNavbar,
} from "@/GlobalRedux/features/common/commonSlice";
import { useDispatch, useSelector } from "react-redux";
import { request } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import CommonModal from "@/components/visitor/commonModal";
import { visitedStallVisitorDef } from "@/components/tableColumnDef/visitedStallVisitorsDef";
import { requestedCatalogVisitorsDef } from "@/components/tableColumnDef/requestedCatalogVisitorsDef";
import { BUCKET_URL } from "@/config/constant";
import { useRouter } from "next/navigation";
import MostLikedPie from "@/components/exibitor/most-liked-pie";
import MostReviewedPie from "@/components/exibitor/most-reviewed-pie";
import MostViewedPie from "@/components/exibitor/most-viewed-pie";
import { mostViewedCatalogDef } from "@/components/tableColumnDef/mostViewedCatalogDef";
import MessageModel from "@/components/messageModel";
import moment from "moment-timezone";

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { showEntry } = useSelector((state) => state.commonStore);
  const exhibitorId =
    typeof window !== "undefined" ? sessionStorage.getItem("id") : null;
  const [visitorData, setVisitorData] = useState(null);
  const [messageModelOpen, setMessageModelOpen] = useState(false);
  const [messageBody, setMessageBody] = useState(false);
  const [catalogTitle, setCatalogTitle] = useState(false);

  const handleCloseMessage = () => {
    setMessageModelOpen(false);
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Returns 'YYYY-MM-DD'
  };

  const fetchbookedSlots = async () => {
    const todayDate = getTodayDate();
    return await request({
      url: `exhibitor/list-booked-slots?exhibitorId=${exhibitorId}&date=${todayDate}`,
      method: "get",
    });
  };
  const { data: bookedSlots } = useQuery({
    queryKey: ["bookedSlots"],
    queryFn: fetchbookedSlots,
  });

  const fetchSettings = async () => {
    return request({ url: "visitor/settings", method: "get" });
  };

  const {
    data: settingsData,
    isError,
    error,
  } = useQuery({
    queryKey: ["settingsData"],
    queryFn: fetchSettings,
  });
  // Fetch loggedin-user data
  const fetchLoggedUser = async () => {
    return request({ url: "exhibitor/loggedin-user", method: "get" });
  };

  const { data: loggedUserCount } = useQuery({
    queryKey: ["loggedUser"],
    queryFn: fetchLoggedUser,
  });
  // Fetch visitedStall data
  const fetchVisitedStall = async () => {
    return request({
      url: `exhibitor/visited-stall/${exhibitorId}`,
      method: "get",
    });
  };
  const { data: visitedStall } = useQuery({
    queryKey: ["visitedStalls"],
    queryFn: fetchVisitedStall,
  });
  // Fetch visitedStall data
  const fetchLiveStallVisitors = async () => {
    return request({
      url: `exhibitor/live-stall-visitors/${exhibitorId}`,
      method: "get",
    });
  };
  const { data: liveStallVisitors } = useQuery({
    queryKey: ["visitedStalls"],
    queryFn: fetchLiveStallVisitors,
  });
  // Fetch Requested Catalouge data
  const fetchCatalougeData = async () => {
    return request({
      url: `exhibitor/briefcase/${exhibitorId}`,
      method: "get",
    });
  };

  const { isLoading, data: catalougeData } = useQuery({
    queryKey: ["catalougeData"],
    queryFn: fetchCatalougeData,
    refetchOnWindowFocus: true,
  });

  const [tableOpen, setTableOpen] = useState(false);
  const [liveStallOpen, setLiveStallOpen] = useState(false);
  const [catalogAnalyticsTableOpen, setCatalogAnalyticsTableOpen] =
    useState(false);

  const [cataloguesTableOpen, setCataloguesTableOpen] = useState(false);

  const datas = {
    datasets: [
      {
        label: "# of Votes",
        data: [3, 1],
        backgroundColor: ["#2A9FE8", "#fff0"],
        borderWidth: 0,
        borderRadius: 10,
      },
    ],
  };
  const data1 = {
    datasets: [
      {
        label: "# of Votes",
        data: [1, 3],
        backgroundColor: ["#fff0", "#AA2AE8"],
        borderWidth: 0,
        borderRadius: 10,
      },
    ],
  };
  const options = {
    plugins: {
      tooltip: {
        enabled: false,
      },
    },
    cutout: "90%",
    responsive: true,
    maintainaspectratio: true,
  };

  const handleTable = () => {
    setTableOpen(true);
  };
  const handleTableClose = () => {
    setTableOpen(false);
    setCataloguesTableOpen(false);
    setLiveStallOpen(false);
    setCatalogAnalyticsTableOpen(false);
  };
  const handleCataloguesTable = () => {
    setCataloguesTableOpen(true);
  };
  const handleLiveStallTable = () => {
    setLiveStallOpen(true);
  };

  const handleVisitorData = (data) => {
    setVisitorData(data.data);
    setCatalogTitle(data.title);
    setCatalogAnalyticsTableOpen(true);
  };

  useEffect(() => {
    dispatch(toggleNavbar(true));
  }, []);

  useEffect(() => {
    checkForUpcomingMeetings();
  }, [bookedSlots]);

  const checkForUpcomingMeetings = () => {
    if (bookedSlots && bookedSlots.length) {
      const notifiedMeetings = {}; // Track notifications for each slot

      const intervalId = setInterval(() => {
        const now = new Date();

        bookedSlots.forEach((slot) => {
          // Combine Date and Time fields from the slot and parse the timezone
          const meetingDateTime = `${slot.Date} ${slot.Time.replace(
            " PM",
            "PM"
          ).replace(" AM", "AM")}`;
          const meetingTime = moment
            .tz(meetingDateTime, "YYYY-MM-DD hh:mm A", slot.Timezone)
            .toDate();

          const timeDiff = meetingTime - now;

          // If the meeting is 'booked' and still has time
          if (timeDiff > 0 && slot.Status === "booked") {
            const minutesLeft = Math.floor(timeDiff / (1000 * 60)); // Convert to minutes

            // Notify at 30 minutes if not already notified for this slot
            if (
              minutesLeft <= 30 &&
              minutesLeft > 15 &&
              !notifiedMeetings[slot.SerialNo]?.notifiedAt30
            ) {
              setMessageModelOpen(true);
              setMessageBody(
                `Meeting ${slot?.TimeRange} starts in ${minutesLeft} minutes, please be available.`
              );

              // Mark as notified for the 30-minute mark
              notifiedMeetings[slot.SerialNo] = {
                ...notifiedMeetings[slot.SerialNo],
                notifiedAt30: true,
              };
            }

            // Notify at 15 minutes if not already notified for this slot
            if (
              minutesLeft <= 15 &&
              !notifiedMeetings[slot.SerialNo]?.notifiedAt15
            ) {
              setMessageModelOpen(true);
              setMessageBody(
                `Meeting starts in ${minutesLeft} minutes, please be available.`
              );

              // Mark as notified for the 15-minute mark
              notifiedMeetings[slot.SerialNo] = {
                ...notifiedMeetings[slot.SerialNo],
                notifiedAt15: true,
              };
            }

            // Clear the interval if both notifications have been sent for the slot
            if (
              notifiedMeetings[slot.SerialNo]?.notifiedAt30 &&
              notifiedMeetings[slot.SerialNo]?.notifiedAt15
            ) {
              clearInterval(intervalId);
            }
          }
        });
      }, 60 * 1000); // Check every minute
    }
  };

  return (
    <>
      {messageModelOpen ? (
        <MessageModel
          handleClose={handleCloseMessage}
          messageHeader={`Meeting Notification`}
          messageBody={messageBody}
        />
      ) : (
        ""
      )}
      {showEntry ? (
        <div
          style={{
            position: "relative",
            height: "100vh",
            width: "100%",
            zIndex: 9999,
          }}
        >
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
            <source src={`${BUCKET_URL}/video/Exterior.mp4`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <button
            className="btn btn-custom btn-md"
            style={{
              position: "absolute",
              top: "63%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 9999,
              backgroundColor: "#25231f",
              color: "#fff",
              padding: "10px",
              borderRadius: "10px",
            }}
            onClick={async () => {
              await dispatch(entryVisibility(false));
              router.push("/exhibitor/exhibitor-lobby");
            }}
          >
            Enter Here
          </button>
        </div>
      ) : (
        <section
          className="no-scrollbar lg:pl-3 lg:pr-5 lg:py-5 bg-white w-full relative pt-20 pb-10 px-3 lg:min-h-screen  flex flex-col gap-[1.25rem]"
          id="main-content-body"
        >
          <LocationBand />
          <div className=" flex md:flex-row flex-col justify-start items-center">
            <div
              className="md:w-1/2 w-full flex flex-row gap-3 justify-start items-center bg-[#ECFEEF] rounded-tl-xl 
              rounded-tr-xl md:rounded-tr-none md:rounded-bl-xl  px-5 py-6 "
              // onClick={handleLiveStallTable}
            >
              <Image
                src={`${BUCKET_URL}/stall.svg`}
                alt="stall"
                width={3000}
                height={3000}
                className=" w-6 h-auto"
              ></Image>
              <p className=" text-lg font-medium font-lato">Stall Visitors</p>
              <p className=" ml-2 font-quickSand text-3xl font-semibold">
                {liveStallVisitors && liveStallVisitors.length}
              </p>
            </div>
            <div className=" w-full md:w-1/2 bg-[#FDEFE0] flex flex-row gap-3 justify-start items-center rounded-br-xl rounded-bl-xl md:rounded-bl-none md:rounded-tr-xl px-5 py-6">
              <Image
                src={`${BUCKET_URL}/peoples.svg`}
                alt="stall"
                width={3000}
                height={3000}
                className=" w-9 h-auto"
              ></Image>
              <p className=" text-lg font-medium font-lato">Now Attending</p>
              <p className=" ml-2 font-quickSand text-3xl font-semibold">
                {loggedUserCount}
              </p>
            </div>
          </div>
          {liveStallOpen && (
            <CommonModal
              tableName={"Stall Visitors"}
              tableColDef={visitedStallVisitorDef}
              tableList={liveStallVisitors}
              handleTableClose={handleTableClose}
            ></CommonModal>
          )}
          {catalogAnalyticsTableOpen && (
            <CommonModal
              tableName={catalogTitle}
              tableColDef={mostViewedCatalogDef}
              tableList={visitorData}
              handleTableClose={handleTableClose}
            ></CommonModal>
          )}
          {tableOpen ? (
            <CommonModal
              tableName={"Stall Visitors"}
              tableColDef={visitedStallVisitorDef}
              tableList={visitedStall}
              handleTableClose={handleTableClose}
            ></CommonModal>
          ) : cataloguesTableOpen ? (
            <CommonModal
              tableName={"Requested Catalogue"}
              tableColDef={requestedCatalogVisitorsDef}
              tableList={catalougeData}
              handleTableClose={handleTableClose}
            ></CommonModal>
          ) : (
            <div>
              <div className="w-full flex flex-row gap-3 justify-around items-center border-2 border-light-blue rounded-xl  px-5 py-6 cursor-pointer shadow-md">
                <div
                  className="max-w-[204px] w-[80%]	relative cursor-pointer"
                  onClick={(e) => handleTable("stallVisitors")}
                >
                  <Doughnut data={datas} options={options}></Doughnut>
                  <div className=" w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center">
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className="w-8 h-8"
                      src={`${BUCKET_URL}/view.svg`}
                    ></Image>
                    <p className="text-sm font-quickSand font-bold text-[#707070]">
                      Stall Visitors
                    </p>
                    <p className=" font-quickSand font-bold text-3xl text-black">
                      {visitedStall && visitedStall.length}
                    </p>
                  </div>
                </div>
                <div
                  className="max-w-[204px] w-[80%] relative cursor-pointer"
                  onClick={(e) => handleCataloguesTable()}
                >
                  <Doughnut data={data1} options={options}></Doughnut>
                  <div className=" w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center">
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className="w-8 h-8"
                      src={`${BUCKET_URL}/menu.svg`}
                    ></Image>
                    <p className="text-sm font-quickSand font-bold text-[#707070]">
                      Requested Catalogues
                    </p>
                    <p className=" font-quickSand font-bold text-3xl text-black">
                      {catalougeData && catalougeData.length}
                    </p>
                  </div>
                </div>
              </div>
              <div className=" boxes-main px-6 py-7 mt-8 w-full gap-3 justify-around items-center border-2 border-light-blue rounded-xl cursor-pointer shadow-md">
                <p className=" font-lato font-bold text-xl mb-8">
                  Catalogue Analytics
                </p>
                <div className=" flex md:flex-row flex-wrap justify-around items-start">
                  <div className=" w-full max-w-[240px] flex flex-col">
                    <p className=" text-base font-lato font-bold text-center">
                      Most Viewed
                    </p>
                    <div className=" relative">
                      <MostViewedPie onVisitorDataFetch={handleVisitorData} />
                    </div>
                  </div>
                  <div className=" w-full max-w-[240px]  flex flex-col">
                    <p className=" text-base font-lato font-bold text-center">
                      Most Liked
                    </p>
                    <div className=" relative">
                      <MostLikedPie onVisitorDataFetch={handleVisitorData} />
                    </div>
                  </div>
                  <div className=" w-full max-w-[240px]  flex flex-col">
                    <p className=" text-base font-lato font-bold text-center">
                      Most Reviewed
                    </p>
                    <div className=" relative">
                      <MostReviewedPie onVisitorDataFetch={handleVisitorData} />
                    </div>
                  </div>
                  <div className=" w-full max-w-[10px]  flex flex-col pointer-events-none">
                    <div className=" relative "></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </>
  );
}
