"use client";
import React, { useEffect, useState } from "react";
import "./side-nav.css";
import Image from "next/image";
import { isMobile, isTablet } from "react-device-detect";
import Credits from "./credits";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BUCKET_URL } from "@/config/constant";

export default function SideNav(props) {
  const router = useRouter();
  const { userDetails } = props;
  const pathname = usePathname();
  const logout = () => {
    localStorage.clear();
    router.push("/");
  };

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <div className="side-nav-main relative" data-tag="empty-space">
        <div className="bg-bg-grey container min-h-screen flex flex-col items-start gap-5 py-6 clicker-nav relative   overflow-x-hidden">
          <div className="container flex flex-row items-center justify-start mb-5 avatar">
            <div>
              <Image
                alt="profile"
                src={`${BUCKET_URL}/main-icons/visitor.svg`}
                height={60}
                width={60}
                className="rounded-full"
              />
            </div>
            <div className="flex flex-col items-start justify-center ml-3">
              <div className="font-lato text-lg font-normal">
                {(isClient && userDetails.name) || ""}
              </div>
              <div className="flex flex-row items-center mt-1">
                {isClient && (
                  <Image
                    alt="profile"
                    src={
                      `${BUCKET_URL}/menu-icons/` +
                      userDetails.role.toLowerCase() +
                      ".svg"
                    }
                    width={10}
                    height={10}
                    className="m-0 p-0 w-auto h-4"
                  />
                )}
                {isClient && (
                  <p className="m-0 p-0 font-bold text-accent-font-color font-lato ml-2 text-xs">
                    {userDetails.role.toUpperCase()}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start gap-5">
            <Link
              href="/visitor"
              className={
                `${pathname === "/visitor" ? "active " : ""}` +
                "container menu-item px-3 rounded-2xl flex items-center justify-start"
              }
            >
              <Image
                alt="dashboard"
                src={`${BUCKET_URL}/visitor/dashboard.svg`}
                height={3000}
                width={3000}
                className=" max-w-[16px] max-h-4"
              />
              <p className="font-lato ml-2 text-sm m-0 p-0">
                Dashboard Overview
              </p>
            </Link>
            <Link
              href="/visitor/exibitorInformation"
              className={
                `${pathname === "/visitor/exibitorInformation" ? "active " : ""
                }` +
                "container menu-item px-3 rounded-2xl flex items-center justify-start"
              }
            >
              <Image
                alt="dashboard"
                src={`${BUCKET_URL}/visitor/exibitorInfo.svg`}
                height={3000}
                width={3000}
                className=" max-w-[16px] max-h-4"
              />
              <p className="font-lato ml-2 text-sm m-0 p-0">
                Exibitor Information
              </p>
            </Link>
            <Link
              href="/visitor/bookMeetings"
              className={
                `${pathname === "/visitor/bookMeetings" ? "active " : ""}` +
                "container menu-item px-3 rounded-2xl flex items-center justify-start"
              }
            >
              <Image
                alt="dashboard"
                src={`${BUCKET_URL}/visitor/bookmeetings.svg`}
                height={3000}
                width={3000}
                className=" max-w-[16px] max-h-4"
              />
              <p className="font-lato ml-2 text-sm m-0 p-0">Book Meetings</p>
            </Link>
            <Link
              href="/visitor/live-events"
              className={
                `${pathname === "/visitor/live-events" ? "active " : ""}` +
                "container menu-item px-3 rounded-2xl flex items-center justify-start"
              }
            >
              <Image
                alt="dashboard"
                src={`${BUCKET_URL}/visitor/liveEvents.svg`}
                height={3000}
                width={3000}
                className=" max-w-[16px] max-h-4"
              />
              <p className="font-lato ml-2 text-sm m-0 p-0">Live Events</p>
            </Link>
            <Link
              href="/visitor/webinar-videos"
              className={
                `${pathname === "/visitor/webinar-videos" ? "active " : ""}` +
                "container menu-item px-3 rounded-2xl flex items-center justify-start"
              }
            >
              <Image
                alt="dashboard"
                src={`${BUCKET_URL}/visitor/webinarVideos.svg`}
                height={3000}
                width={3000}
                className=" max-w-[16px] max-h-4"
              />
              <p className="font-lato ml-2 text-sm m-0 p-0">Webinar Videos</p>
            </Link>
            <Link
              href="/visitor/todays-activity"
              className={
                `${pathname === "/visitor/todays-activity" ? "active " : ""}` +
                "container menu-item px-3 rounded-2xl flex items-center justify-start"
              }
            >
              <Image
                alt="dashboard"
                src={`${BUCKET_URL}/visitor/activity.svg`}
                height={3000}
                width={3000}
                className=" max-w-[16px] max-h-4"
              />
              <p className="font-lato ml-2 text-sm m-0 p-0">Today's Activity</p>
            </Link>
            <Link
              href="/visitor/notification"
              className={
                `${pathname === "/visitor/notification" ? "active " : ""}` +
                "container menu-item px-3 rounded-2xl flex items-center justify-start"
              }
            >
              <Image
                alt="Notification"
                src={`${BUCKET_URL}/exibitor-menu-icons/notification.svg`}
                height={3000}
                width={3000}
                className=" max-w-[16px] max-h-4"
              />
              <p className="font-lato ml-2 text-sm m-0 p-0">Notification</p>
            </Link>
            <Link
              href="/visitor/about-organiser"
              className={
                `${pathname === "/visitor/about-organiser" ? "active " : ""}` +
                "container menu-item px-3 rounded-2xl flex items-center justify-start"
              }
            >
              <Image
                alt="dashboard"
                src={`${BUCKET_URL}/visitor/mike.svg`}
                height={3000}
                width={3000}
                className=" max-w-[16px] max-h-4"
              />
              <p className="font-lato ml-2 text-sm m-0 p-0">About Organiser</p>
            </Link>
            <Link
              href="/visitor/about-exibitor"
              className={
                `${pathname === "/visitor/about-exibitor" ? "active " : ""}` +
                "container menu-item px-3 rounded-2xl flex items-center justify-start"
              }
            >
              <Image
                alt="dashboard"
                src={`${BUCKET_URL}/visitor/stall.svg`}
                height={3000}
                width={3000}
                className=" max-w-[16px] max-h-4"
              />
              <p className="font-lato ml-2 text-sm m-0 p-0">About Exibitor</p>
            </Link>
            <div
              onClick={() => logout()}
              className={
                "container menu-item px-3 rounded-2xl flex items-center justify-start"
              }
            >
              <Image
                alt="dashboard"
                src={`${BUCKET_URL}/logout.svg`}
                height={3000}
                width={3000}
                className=" max-w-[16px] max-h-4"
              />
              <p className="font-lato ml-2 text-sm m-0 p-0">Logout</p>
            </div>
          </div>
          <Credits />
        </div>
      </div>
      <div className="fixed drop-shadow-lg left-0 px-5 right-0 top-0 h-16 flex-row items-center justify-between bg-black-2 z-[999] floating-top hidden">
        <div></div>
        <div>
          <Image
            alt="logo-main"
            src={`${BUCKET_URL}/logo-main.svg`}
            width={20}
            height={20}
            className="w-36 h-auto"
          />
        </div>
        <div id="nav-icon" className="z-[1000]">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </>
  );
}
