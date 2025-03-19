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
import dayjs from "dayjs";

function LocationBand() {
  const exhibitorId =
    typeof window !== "undefined" ? sessionStorage.getItem("id") : null;
  const fetchNotification = async () => {
    return request({
      url: `exhibitor/notification/${exhibitorId}`,
      method: "get",
    });
  };

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotification,
  });

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
    <div className="flex flex-row justify-center items-center relative">
      <div className="bg-[#F5F5F5] flex md:flex-row flex-wrap items-start md:items-center md:justify-between justify-center boxes-main gap-y-3 md:gap-3 p-3 w-full">
        <div className="flex max-w-full w-1/2 md:w-auto justify-center items-center order-2 md:order-1">
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
        <p className="font-quickSand text-xl font-bold text-black order-1 md:order-2 md:w-auto w-full text-center">
          {settingsData && settingsData[0] && settingsData[0].fairName}
        </p>
        <div className="flex max-w-full justify-center items-center order-3 w-1/2 md:w-auto">
          <Image
            alt="img"
            width={35}
            height={35}
            src={`${BUCKET_URL}/Event-chosen/Calender.png`}
            className="mr-3"
            unoptimized
          ></Image>
          <div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-quickSand text-sm font-bold text-black">
              <div>
                <p>From:</p>
                <p>To:</p>
              </div>
              <div>
                <p>
                  {settingsData &&
                    settingsData[0] &&
                    dayjs(settingsData[0].startDateTime).format("DD-MM-YYYY")}
                </p>
                <p>
                  {settingsData &&
                    settingsData[0] &&
                    dayjs(settingsData[0].endDateTime).format("DD-MM-YYYY")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="notifications w-[10%] text-right pr-6 pt-6 lg:relative absolute right-3 hidden lg:block">
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
          {notifications && (
            <div className="absolute -right-6 -top-6 bg-brand-color rounded-full flex flex-row items-center justify-center h-7 w-7 font-lato font-bold text-[10px]">
              {notifications && notifications.length}
            </div>
          )}
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
            <Link href="/exhibitor/notification">
              <Button color="primary" size="small" onClick={handleClose}>
                See All
              </Button>
            </Link>
          </div>
          <div className="popoverContent">
            {notifications &&
              notifications.length > 0 &&
              notifications.map((res) => (
                <div className="section-popover" key={res._id}>
                  <div>
                    {res?.visitor?.name} ({res?.visitor?.companyName})
                  </div>
                  <div>
                    {res?.notificationType} - {dayjsShortFormat(res?.createdAt)}
                  </div>
                </div>
              ))}
          </div>
        </Popover>
      </div>
    </div>
  );
}

export default LocationBand;
