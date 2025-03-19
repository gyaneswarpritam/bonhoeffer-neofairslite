"use client";
import React, { useEffect, useRef, useState } from "react";
import "./side-nav.css";
import Image from "next/image";
import { isMobile, isTablet } from "react-device-detect";
import Credits from "./credits";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BUCKET_URL } from "@/config/constant";
import MeetingListModel from "../meetingListModel";
import { request } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import AuditoriumModal from "./auditorium/AuditoriumModal";
import ExhibitorProfile from "./ExhibitorProfile";
import { toast } from "react-toastify";

export default function SideNav(props) {
  const router = useRouter();
  const { userDetails, handleChatView } = props;
  const [totalUnreadMessages, setTotalUnreadMessages] = useState(0);
  const id =
    typeof window !== "undefined" ? localStorage.getItem("id") : null;
  const role =
    typeof window !== "undefined" ? localStorage.getItem("role") : null;

  const fetchInstantMeetingData = async () => {
    return request({
      url: `exhibitor/instant-meeting/${id}`,
      method: "get",
    });
  };

  const {
    isLoading,
    data: instantMeeting,
    isError,
    error,
  } = useQuery({
    queryKey: ["instant-meeting", id], // Include id in the queryKey
    queryFn: fetchInstantMeetingData,
    enabled: !!id, // Enable the query only if id is present
    refetchInterval: 1000,
  });

  const fetchRequestedSlot = async () => {
    return request({
      url: `exhibitor/get-requested-slots?id=${id}`,
      method: "get",
    });
  };

  const { data: requestedSlots, refetch } = useQuery({
    queryKey: ["requested-slots"],
    queryFn: fetchRequestedSlot,
  });

  const fetchProfile = async () => {
    return request({
      url: `exhibitor/profile/${id}`,
      method: "get",
    });
  };

  const { data: profileData } = useQuery({
    queryKey: ["profile-data"],
    queryFn: fetchProfile,
  });

  const fetchChatUser = async () => {
    return request({
      url: `exhibitor-messages/getChatVisitors/${id}`,
      method: "get",
    });
  };

  const { data: chatUsersData } = useQuery({
    queryKey: ["getChatUserListData"],
    queryFn: fetchChatUser,
    refetchInterval: 5000,
  });

  const pathname = usePathname();

  const logout = () => {
    const userConfirmed = window.confirm("Are you sure you want to logout?");

    if (userConfirmed) {
      request({ url: `exhibitor/logout/${id}`, method: "get" });
      localStorage.clear();
      router.push("/exhibitor-login");
    }
  };

  const [isClient, setIsClient] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [auditoriumModelOpen, setAuditoriumModelOpen] = useState(false);
  const [slotCount, setSlotCount] = useState(0);
  const [profile, setProfile] = useState(false);

  const previousSlotCountRef = useRef(0);

  useEffect(() => {
    const slotCountForApproval =
      requestedSlots && requestedSlots.length && requestedSlots?.filter((res) => res.status === "pending").length || 0;

    if (slotCountForApproval > previousSlotCountRef.current) {
      toast.info(`New Meeting request received. Please review the meeting.`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 60000, // 1 minute
      });
    }

    previousSlotCountRef.current = slotCountForApproval;
    setSlotCount(slotCountForApproval);
  }, [requestedSlots]);

  const previousInstantMeetingCountRef = useRef(0);

  useEffect(() => {
    const instantMeetingCount = instantMeeting?.length || 0;

    if (instantMeetingCount > previousInstantMeetingCountRef.current) {
      toast.info(`New meeting request received. Please check “Join Meeting” section.`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 60000, // 1 minute
      });
    }

    previousInstantMeetingCountRef.current = instantMeetingCount;
  }, [instantMeeting]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (chatUsersData && chatUsersData.length) {
      // Calculate the total unread messages
      const totalUnread = chatUsersData.reduce(
        (total, visitor) => total + visitor.unread,
        0
      );
      setTotalUnreadMessages(totalUnread);
    }
  }, [chatUsersData]);

  const handleConfirm = () => {
    setConfirmOpen(false);
  };
  const handleCloseAuditorium = () => {
    setAuditoriumModelOpen(false);
  };

  const handleCloseProfile = () => {
    setProfile(false);
  };

  return (
    <>
      {confirmOpen ? (
        <MeetingListModel
          handleClick={handleConfirm}
          rowData={instantMeeting}
        />
      ) : (
        ""
      )}
      {auditoriumModelOpen ? (
        <AuditoriumModal handleClose={handleCloseAuditorium} />
      ) : (
        ""
      )}
      {profile ? (
        <ExhibitorProfile
          closeProfile={handleCloseProfile}
          profileData={profileData}
        />
      ) : (
        ""
      )}
      <div className="side-nav-main relative" data-tag="empty-space">
        <div className="bg-bg-grey container min-h-screen flex flex-col items-start gap-5 py-6 clicker-nav relative   overflow-x-hidden">
          <div className="container flex flex-row items-center justify-start mb-5 avatar">
            <div className="cursor-pointer" onClick={() => setProfile(true)}>
              <Image
                alt="profile"
                src={`${BUCKET_URL}/main-icons/exhibitor.svg`}
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
              href="/exhibitor"
              className={
                `${pathname === "/exhibitor" ? "active " : ""}` +
                "container menu-item px-3 rounded-2xl flex items-center justify-start"
              }
            >
              <Image
                alt="dashboard"
                src={`${BUCKET_URL}/exibitor-menu-icons/dashboard.svg`}
                height={3000}
                width={3000}
                className=" max-w-[16px] max-h-4"
              />
              <p className="font-lato ml-2 text-sm m-0 p-0">
                Dashboard Overview
              </p>
            </Link>
            {
              role != "Stall Manager" ? <div>
                <Link
                  href="/exhibitor/stall-settings"
                  className={
                    `${pathname === "/exhibitor/stall-settings" ? "active " : ""
                    }` +
                    "container menu-item px-3 rounded-2xl flex items-center flex-wrap justify-start relative"
                  }
                >
                  <Image
                    alt="stall creation"
                    src={`${BUCKET_URL}/exibitor-menu-icons/stall.svg`}
                    height={3000}
                    width={3000}
                    className=" max-w-[16px] max-h-4"
                  />
                  <p className="font-lato ml-2 text-sm m-0 p-0">Stall Settings</p>
                </Link>
              </div> : <></>
            }

            <div>
              <Link
                href="/exhibitor/my-stall"
                className={
                  `${pathname === "/exhibitor/my-stall" ? "active " : ""}` +
                  "container menu-item px-3 rounded-2xl flex items-center flex-wrap justify-start relative"
                }
              >
                <Image
                  alt="stall creation"
                  src={`${BUCKET_URL}/exibitor-menu-icons/stall.svg`}
                  height={3000}
                  width={3000}
                  className=" max-w-[16px] max-h-4"
                />
                <p className="font-lato ml-2 text-sm m-0 p-0">My Stall View</p>
              </Link>
            </div>
            {
              role != "Stall Manager" ?
                <div>
                  <Link
                    href="/exhibitor/add-user"
                    className={
                      `${pathname === "/exhibitor/add-user" ? "active " : ""}` +
                      "container menu-item px-3 rounded-2xl flex items-center flex-wrap justify-start relative"
                    }
                  >
                    <Image
                      alt="stall creation"
                      src={`${BUCKET_URL}/exibitor-menu-icons/stall.svg`}
                      height={3000}
                      width={3000}
                      className=" max-w-[16px] max-h-4"
                    />
                    <p className="font-lato ml-2 text-sm m-0 p-0">Add User</p>
                  </Link>
                </div> : <></>
            }
            <div>
              <Link
                href="#"
                className={
                  "container menu-item px-3 rounded-2xl flex items-center flex-wrap justify-start relative"
                }
                onClick={handleChatView}
              >
                <Image
                  alt="stall creation"
                  src={`${BUCKET_URL}/exibitor-menu-icons/stall.svg`}
                  height={3000}
                  width={3000}
                  className=" max-w-[16px] max-h-4"
                />

                <p className="font-lato ml-2 text-sm m-0 p-0">Chat</p>
                {totalUnreadMessages ? (
                  <span className="notify-meet">{totalUnreadMessages}</span>
                ) : (
                  <></>
                )}
              </Link>
            </div>

            <Link
              href="/exhibitor/notification"
              className={
                `${pathname === "/exhibitor/notification" ? "active " : ""}` +
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
              href="/exhibitor/requested-slots"
              className={
                `${pathname === "/exhibitor/requested-slots" ? "active " : ""
                }` +
                "container menu-item px-3 rounded-2xl flex items-center justify-start"
              }
            >
              <Image
                alt="Meeting Requests"
                src={`${BUCKET_URL}/exibitor-menu-icons/time.svg`}
                height={3000}
                width={3000}
                className=" max-w-[16px] max-h-4"
              />
              <p className="font-lato ml-2 text-sm m-0 p-0">Meeting Requests</p>
              {slotCount ? (
                <span className="notify-meet">{slotCount}</span>
              ) : (
                <></>
              )}
            </Link>
            <Link
              onClick={() => setConfirmOpen(true)}
              href="#"
              className={
                "container menu-item px-3 rounded-2xl flex items-center justify-start"
              }
            >
              <Image
                alt="Join Meeting"
                src={`${BUCKET_URL}/exibitor-menu-icons/time.svg`}
                height={3000}
                width={3000}
                className=" max-w-[16px] max-h-4"
              />
              <p className="font-lato ml-2 text-sm m-0 p-0">Join Meeting</p>
              {instantMeeting && instantMeeting.length ? (
                <span className="notify-meet">{instantMeeting.length}</span>
              ) : (
                <></>
              )}
            </Link>

            <div
              onClick={() => setAuditoriumModelOpen(true)}
              className={
                "container menu-item px-3 rounded-2xl flex items-center justify-start"
              }
            >
              <Image
                alt="Auditorium"
                src={`${BUCKET_URL}/exibitor-menu-icons/mike.svg`}
                height={3000}
                width={3000}
                className=" max-w-[16px] max-h-4"
              />
              <p className="font-lato ml-2 text-sm m-0 p-0">Auditorium</p>
            </div>
            {
              role != "Stall Manager" ?
                <Link
                  href="/exhibitor/reset-password"
                  className={
                    `${pathname === "/exhibitor/reset-password" ? "active " : ""}` +
                    "container menu-item px-3 rounded-2xl flex items-center justify-start"
                  }
                >
                  <Image
                    alt="Reset Password"
                    src={`${BUCKET_URL}/exibitor-menu-icons/stall-solid.svg`}
                    height={3000}
                    width={3000}
                    className=" max-w-[16px] max-h-4"
                  />
                  <p className="font-lato ml-2 text-sm m-0 p-0">Reset Password</p>
                </Link> : <></>
            }
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
