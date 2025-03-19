import React from "react";
import Image from "next/image";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import "./side-nav.css";
import { request } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { dayjsShortFormat } from "@/lib/dayjs";
import { BUCKET_URL } from "@/config/constant";
import Link from "next/link";

function locationBand() {
  const visitorId =
    typeof window !== "undefined" ? sessionStorage.getItem("id") : null;

  // Fetch loggedin-user data
  const fetchLoggedUser = async () => {
    return request({ url: "visitor/loggedin-user", method: "get" });
  };

  const { data: loggedUserCount } = useQuery({
    queryKey: ["loggedUser"],
    queryFn: fetchLoggedUser,
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

  const fetchNotification = async () => {
    return request({
      url: `visitor/notification/${visitorId}`,
      method: "get",
    });
  };

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotification,
  });
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <div className=" grid grid-cols-12 gap-2">
      <div className="bg-[#F5F5F5] col-span-12 md:col-span-8 flex flex-col flex-wrap items-start md:items-center justify-center boxes-main gap-y-3 md:gap-3 py-4 px-5 w-full">
        <p className="font-quickSand text-xl font-bold text-black md:w-auto w-full text-center">
          {settingsData && settingsData[0] && settingsData[0].fairName}
        </p>
        <div className="w-full flex flex-row gap-4 justify-between items-center ">
          <div className="flex max-w-full w-1/2 md:w-auto justify-center items-center">
            <Image
              alt="img"
              width={35}
              height={35}
              src={`${BUCKET_URL}/Event-chosen/location-icon.png`}
              className="mr-3"
              unoptimized
            ></Image>
            <div>
              <p className="font-quickSand text-sm font-bold text-black">
                {settingsData && settingsData[0] && settingsData[0].location}
              </p>
              <p className="font-quickSand text-xs text-black">
                {settingsData && settingsData[0] && settingsData[0].country}
              </p>
            </div>
          </div>

          <div className="flex max-w-full justify-center items-center w-1/2 md:w-auto">
            <Image
              alt="img"
              width={35}
              height={35}
              src={`${BUCKET_URL}/Event-chosen/Calender.png`}
              className="mr-3"
              unoptimized
            ></Image>
            <div>
              <p className="font-quickSand text-sm font-bold text-black">
                From:{" "}
                {settingsData &&
                  dayjsShortFormat(settingsData[0].startDateTime)}
                <br />
                To:{" "}
                {settingsData && dayjsShortFormat(settingsData[0].endDateTime)}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className=" col-span-12 md:col-span-4 w-full flex gap-3 flex-row">
        <div className=" w-full bg-[#FDEFE0] flex flex-row gap-3 justify-center items-center rounded-xl px-5 py-6">
          <Image
            src={`${BUCKET_URL}/peoples.svg`}
            alt="stall"
            width={3000}
            height={3000}
            className=" w-9 h-auto"
          ></Image>
          <p className=" text-lg font-medium font-lato">Now Attending</p>
          <p className=" ml-2 font-quickSand text-3xl font-semibold">
            {loggedUserCount || 0}
          </p>
        </div>
        <div className="notifications min-w-fit w-11 h-11 col-span-1 text-right pr-6 pt-6 relative block">
          <div
            className="relative inline-block design-border"
            onClick={handleClick}
          >
            <Image
              alt="notification"
              src={`${BUCKET_URL}/notifications.svg`}
              height={33}
              width={33}
            />
            <div className="absolute -right-6 -top-6 bg-brand-color rounded-full flex flex-row items-center justify-center h-7 w-7 font-lato font-bold text-[10px]">
              {notifications && notifications.length}
            </div>
          </div>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <div className="popoverHeader">
              <div>Notifications</div>
              {notifications && (
                <Link href="/visitor/notification">
                  <Button color="primary" size="small" onClick={handleClose}>
                    See All
                  </Button>
                </Link>
              )}
            </div>
            <div className="popoverContent">
              {notifications &&
                notifications.map((res) => (
                  <div className="section-popover">
                    <div>
                      {res.exhibitor.name} {res.exhibitor.name} (
                      {res.exhibitor.companyName})
                    </div>
                    <div>
                      {res.notificationType} - {dayjsShortFormat(res.createdAt)}
                    </div>
                  </div>
                ))}
            </div>
          </Popover>
        </div>
      </div>
    </div>
  );
}

export default locationBand;
