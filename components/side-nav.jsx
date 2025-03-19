"use client";
import React, { useState } from "react";
import "./side-nav.css";
import Image from "next/image";
import { isMobile, isTablet } from "react-device-detect";
import Credits from "./credits";

export default function SideNav(props) {
  const [currentMenu, setMenu] = useState(1);
  const user = props.userDetails;

  return (
    <>
      <div className="side-nav-main hidden relative" data-tag="empty-space">
        <div className="bg-bg-grey container min-h-screen flex flex-col items-start py-6 clicker-nav relative">
          <div className="container flex flex-row items-center justify-start mb-5 avatar">
            <div className="">
              <Image
                alt="profile"
                src={"/" + user.profile}
                height={60}
                width={60}
                className="rounded-full"
              />
            </div>
            <div className="flex flex-col items-start justify-center ml-3">
              <div className="font-lato text-lg font-normal">{user.name}</div>
              <div className="flex flex-row items-center mt-1">
                <Image
                  alt="profile"
                  src={"/menu-icons/" + user.role.toLowerCase() + ".svg"}
                  width={10}
                  height={10}
                  className="m-0 p-0 w-auto h-4"
                />
                <p className="m-0 p-0 font-bold text-accent-font-color font-lato ml-2 text-xs">
                  {user.role.toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          <div
            data-option="0"
            className="container menu-item active px-3 py-3 rounded-2xl flex items-center justify-start"
          >
            <Image
              alt="dashboard"
              src="../menu-icons/dashboard.svg"
              height={22}
              width={22}
            />
            <p className="font-lato ml-2 text-sm m-0 p-0">Dashboard Overview</p>
          </div>
          <div
            data-option="1"
            className="container menu-item px-3 py-3 rounded-2xl flex items-center justify-start"
          >
            <Image
              alt="visitors"
              src="../menu-icons/visitors.svg"
              height={22}
              width={22}
            />
            <p className="font-lato ml-2 text-sm m-0 p-0">Visitors</p>
          </div>
          <div
            data-option="2"
            className="container menu-item px-3 py-3 rounded-2xl flex items-center justify-start"
          >
            <Image
              alt="marketing"
              src="../menu-icons/marketing.svg"
              height={22}
              width={22}
            />
            <p className="font-lato ml-2 text-sm m-0 p-0">Marketing</p>
          </div>
          <div
            data-option="3"
            className="container menu-item px-3 py-3 rounded-2xl flex items-center justify-start"
          >
            <Image
              alt="reports"
              src="../menu-icons/reports.svg"
              height={22}
              width={22}
            />
            <p className="font-lato ml-2 text-sm m-0 p-0">Reports</p>
          </div>
          <div
            data-option="4"
            className="container menu-item px-3 py-3 rounded-2xl flex items-center justify-start"
          >
            <Image
              alt="explore-events"
              src="../menu-icons/explore-events.svg"
              height={22}
              width={22}
            />
            <p className="font-lato ml-2 text-sm m-0 p-0">Explore Events</p>
          </div>
          <div className="divider"></div>
          <Credits />
        </div>
      </div>
      <div className="fixed drop-shadow-lg left-0 px-5 right-0 top-0 h-16 flex-row items-center justify-between bg-black-2 z-[999] floating-top hidden">
        <div></div>
        <div>
          <Image
            alt="logo-main"
            src="/logo-main.svg"
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
