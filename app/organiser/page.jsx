"use client";
import ListComponents1 from "@/components/list-components1";
import ListComponents2 from "@/components/list-components2";
import ListComponents3 from "@/components/list-components3";
import PieChart3 from "@/components/pie-chart3";
import SideNav from "@/components/side-nav";
import SwiperComponent from "@/components/swiper-comp";
import Image from "next/image";
import { useEffect, useState } from "react";
import { isMobile, isTablet } from "react-device-detect";
import { eventsAll, userDetails } from "./data";
import { BUCKET_URL } from "@/config/constant";

export default function Exhibitor() {
  const user = userDetails;
  const events = eventsAll.events;

  const [device, setDevice] = useState(null);

  useEffect(() => {
    if (isMobile || isTablet) {
      setDevice(isMobile ? "mobile" : "tablet");
    } else {
      setDevice("desktop");
    }
  });

  const numberWithCommas = (x) => {
    return Number(x).toLocaleString();
  };

  const handleChange = (n) => {
    if (n === 0) {
      document.getElementsByClassName("change-detect-text")[0].innerHTML =
        "Total Visitors";
    } else {
      document.getElementsByClassName("change-detect-text")[0].innerHTML =
        "Total Unique Visitors";
    }
  };

  if (device !== null) {
    return (
      <main className="custom-color-bg">
        <div className="mx-auto max-w-[1439px] container md:flex md:flex-row md:items-stretch md:justify-between overflow-hidden">
          <section
            className="bg-bg-grey md:w-[20%] md:min-h-screen px-2 w-full"
            id="side-bar"
          >
            <SideNav userDetails={user} />
          </section>

          <section
            className="md:pl-3 md:pr-5 md:py-5 bg-white md:w-[80%] w-full relative pt-16 pb-24 px-3 overflow-hidden md:h-screen "
            id="main-content-body"
          >
            <div
              style={{ display: device === "desktop" ? "none" : "" }}
              className="mt-4 bg-black-2 py-3 px-1 rounded-lg font-lato font-black text-base flex flex-row items-center justify-center text-violet uppercase"
            >
              <Image
                alt=""
                width={20}
                height={20}
                src={`${BUCKET_URL}/master-analytics.svg`}
                className="mr-3"
              />
              Click to view Master Analytics
            </div>
            <div
              className="container flex flex-row items-stretch justify-between"
              style={{ display: device === "desktop" ? "" : "none" }}
            >
              <div className="w-[24%] bg-peach mr-5 ml-3 min-h-[8.5rem] rounded-lg flex flex-col items-center justify-center">
                <p className="font-lato font-normal text-5xl mb-2">
                  {numberWithCommas(user.eventsHosted)}
                </p>
                <p className="font-lato font-semibold text-xl">Events Hosted</p>
              </div>
              <div className="w-[24%] bg-light-green mr-5 min-h-[8.5rem] rounded-lg flex flex-col items-center justify-center">
                <p className="font-lato font-normal text-5xl mb-2">
                  {numberWithCommas(user.visitors)}
                </p>
                <p className="font-lato font-semibold text-xl">Visitors Inn</p>
              </div>
              <div className="w-[24%] bg-light-blue mr-5 min-h-[8.5rem] rounded-lg flex flex-col items-center justify-center">
                <p className="font-lato font-normal text-5xl mb-2">
                  {numberWithCommas(user.stalls)}
                </p>
                <p className="font-lato font-semibold text-xl">Stalls Inn</p>
              </div>
              <div className="w-[24%] bg-light-violet mr-5 min-h-[8.5rem] rounded-lg flex flex-row items-center justify-center">
                <div className="border-r-black border-r-2 pr-2 flex-col flex  justify-center min-h-[6rem]">
                  <p className="font-lato font-normal text-3xl mb-2">
                    {numberWithCommas(user.nowAttending)}
                  </p>
                  <p className="font-lato font-semibold text-xs">
                    Now Attending
                  </p>
                </div>
                <div className="pl-2 flex-col flex  justify-center min-h-[6rem]">
                  <p className="font-lato font-normal text-3xl mb-2">
                    {numberWithCommas(user.liveStall)}
                  </p>
                  <p className="font-lato font-semibold text-xs">
                    Live Stall Visitors
                  </p>
                </div>
              </div>
              <div className="notifications w-[10%] text-right pr-6 pt-6">
                <div className="relative inline-block design-border">
                  <Image
                    alt=""
                    src={`${BUCKET_URL}/notifications.svg`}
                    height={33}
                    width={33}
                  />
                  <div className="absolute -right-6 -top-6 bg-brand-color rounded-full flex flex-row items-center justify-center h-7 w-7 font-lato font-bold text-[10px]">
                    99+
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-violet md:-mr-5 md:-ml-3 -mx-3 my-3 flex flex-row items-center justify-between">
              <p className="py-2 m-0 text-white font-bold text-base w-full">
                <marquee>
                  Flash Message: Lorem Ipsum is simply dummy text of the
                  printing and typesetting industry.
                </marquee>
              </p>
              <button className="uppercase py-3 text-white bg-black w-[12rem] rounded-tl-lg rounded-bl-lg">
                💬 React Now
              </button>
            </div>
            {/* First part of Analytics */}
            <div className="flex md:flex-row items-stretch justify-between md:ml-3 flex-col overflow-hidden">
              <div className="md:min-h-[70vh] boxes-main md:w-[33%] md:mr-2 mb-4 md:mb-0 w-full overflow-hidden">
                <p className="title text-center md:text-left change-detect-text">
                  Total Visitors
                </p>
                <div className="-mt-12">
                  <SwiperComponent func={handleChange} />
                </div>
              </div>
              <div className="md:w-[67%] md:ml-2 flex flex-col items-stretch justify-between mt-8 md:mt-0">
                <div className="md:boxes-main mb-2 md:min-h-[40vh]">
                  <p className="title">Total Registered</p>
                  <div className="md:mt-5 relative">
                    {events.length < 4
                      ? events.map((event, index) => {
                          return <ListComponents1 key={index} event={event} />;
                        })
                      : events.slice(0, 4).map((event, index) => {
                          return <ListComponents1 key={index} event={event} />;
                        })}
                    <p className="md:absolute text-red mt-2 md:mt-0 text-xs font-lato font-bold cursor-pointer right-0 -bottom-6 underline text-right md:text-left">
                      See More &gt; &gt;
                    </p>
                  </div>
                </div>
                <div className="md:boxes-main md:mt-2 md:min-h-[30vh] mt-8">
                  <p className="title">Your Events</p>
                  <div className="md:mt-5 relative grid md:grid-cols-3 gap-2 grid-cols-1 pl-5 pt-3 md:pt-0 md:pl-5">
                    {events.length < 6
                      ? events.map((event, index) => {
                          return <ListComponents2 key={index} event={event} />;
                        })
                      : events.slice(0, 6).map((event, index) => {
                          return <ListComponents2 key={index} event={event} />;
                        })}
                    <p className="md:absolute text-right mt-2 md:mt-0 text-red text-xs font-lato font-bold cursor-pointer right-0 -bottom-14 underline">
                      See More &gt; &gt;
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <br />
            {/* Second part of Analytics */}
            <div className="flex md:flex-row flex-col items-stretch justify-between md:ml-3 overflow-hidden mt-5 md:mt-0">
              <div className="md:boxes-main md:w-[50%] md:mr-2">
                <p className="title">Stall Completion Status</p>
                <div className="md:mt-5 pl-5 md:pl-0">
                  {events.length < 8
                    ? events.map((event, index) => {
                        return <ListComponents3 key={index} event={event} />;
                      })
                    : events.slice(0, 8).map((event, index) => {
                        return <ListComponents3 key={index} event={event} />;
                      })}
                </div>
              </div>

              <div className="boxes-main md:w-[50%] md:ml-2 mt-8 md:mt-0 w-full overflow-hidden">
                <p className="title text-center md:text-left">
                  Total Number of Fairs per Fair
                </p>
                <div className="md:-mt-24 md:p-10 -mt-6">
                  <PieChart3 />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  } else {
    return <></>;
  }
}
