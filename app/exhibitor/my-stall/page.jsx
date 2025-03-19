"use client";
import React, { useRef, useState, useEffect, Suspense } from "react";
import Image from "next/image";
import "./mystall.css";
import { isMobile, isTablet } from "react-device-detect";
import ContactModel from "@/components/contactModel";
import { useDispatch, useSelector } from "react-redux";
import GalleryModel from "@/components/galleryModel";
import {
  modelChange,
  modelOpen,
} from "@/GlobalRedux/features/dialogs/dialogSlice";
import { toggleNavbar } from "@/GlobalRedux/features/common/commonSlice";
import Model from "@/components/model";
import { request } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { BUCKET_URL } from "@/config/constant";
import Link from "next/link";
import AuditoriumModal from "@/components/exibitor/auditorium/AuditoriumModal";
import Support from "@/components/visitor/lite/Support";
import ExhibitorChatModal from "@/components/ExhibitorChatModal";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import { dayjsShortFormat } from "@/lib/dayjs";
import NotificationModal from "@/components/exibitor/NotificationModal";
import RequestedSlotModal from "@/components/exibitor/RequestedSlotModal";
import MeetingListModel from "@/components/meetingListModel";

const Page = () => {
  const exhibitorId =
    typeof window !== "undefined" ? localStorage.getItem("id") : null;
  const fetchStall = async () => {
    return request({
      url: `exhibitor/stall-by-exhibitor/${exhibitorId}`,
      method: "get",
    });
  };

  const { data: stallData } = useQuery({
    queryKey: ["stallDetails"],
    queryFn: fetchStall,
  });

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

  const fetchChatUser = async () => {
    return request({
      url: `exhibitor-messages/getChatVisitors/${exhibitorId}`,
      method: "get",
    });
  };

  const { data: chatUsersData } = useQuery({
    queryKey: ["getChatUserListDataStall"],
    queryFn: fetchChatUser,
    refetchInterval: 5000,
  });

  const fetchRequestedSlot = async () => {
    return request({
      url: `exhibitor/get-requested-slots?id=${exhibitorId}`,
      method: "get",
    });
  };

  const { data: requestedSlots, refetch } = useQuery({
    queryKey: ["requested-slots"],
    queryFn: fetchRequestedSlot,
  });

  const fetchInstantMeetingData = async () => {
    return request({
      url: `exhibitor/instant-meeting/${exhibitorId}`,
      method: "get",
    });
  };

  const {
    isLoading,
    data: instantMeeting,
    isError,
    error,
  } = useQuery({
    queryKey: ["instant-meeting", exhibitorId], // Include id in the queryKey
    queryFn: fetchInstantMeetingData,
    enabled: !!exhibitorId, // Enable the query only if id is present
    refetchInterval: 5000,
  });

  const isModelOpen = useSelector((state) => state.dialog.isopen);
  const dispatch = useDispatch();

  const [device, setDevice] = useState(null);
  const [height, setHeight] = useState(null);
  const [contactInfo, setContactInfoOpen] = useState(false);
  const [galleryModel, setGalleryModel] = useState(false);
  const [auditoriumModelOpen, setAuditoriumModelOpen] = useState(false);
  const [support, setSupport] = useState(false);
  const [notificationView, setNotificationView] = useState(false);
  const [totalUnreadMessages, setTotalUnreadMessages] = useState(0);
  const [chatView, setChatView] = useState(false);
  const [slotCount, setSlotCount] = useState(0);
  const [requestedSlotView, setRequestedSlotView] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const image = useRef(null);
  useEffect(() => {
    if (isMobile || isTablet) {
      setDevice(isMobile === true && isTablet === false ? "mobile" : "tablet");
    } else {
      setDevice("desktop");
    }
    return () => { };
  }, []);
  useEffect(() => {
    const slotCountForApproval =
      (requestedSlots &&
        requestedSlots.length &&
        requestedSlots.filter((res) => res.status === "pending").length) ||
      0;
    setSlotCount(slotCountForApproval);
  }, [requestedSlots, slotCount]);
  useEffect(() => {
    dispatch(toggleNavbar(false));
  }, []);

  const handleContactInfo = () => {
    setContactInfoOpen(!contactInfo);
    setGalleryModel(false);
  };
  const openGallery = () => {
    setGalleryModel(true);
    setContactInfoOpen(false);
  };
  const closeGallery = () => {
    setGalleryModel(false);
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
  };

  const handleModelopen = (e) => {
    dispatch(modelChange(e));
    dispatch(modelOpen());
  };

  const handleCloseAuditorium = () => {
    setAuditoriumModelOpen(false);
  };

  const handleChatView = () => {
    setChatView(true);
  };

  const handleClose = () => {
    setChatView(false);
    setNotificationView(false);
  };

  const handleCloseSlot = () => {
    setRequestedSlotView(false);
  };

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

  const handleSeeAll = () => {
    setAnchorEl(null);
    setNotificationView(true);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);
  const idNotify = open ? "simple-popover" : undefined;

  const handleClickNotify = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseNotify = () => {
    setAnchorEl(null);
  };

  const getVideoId = (url) => {
    const match = url.match(
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/
    );
    return match ? match[1] : null;
  };

  // useEffect(() => {
  //   if (stallData && stallData?.stall) {
  //     if (!stallData?.stall?.stallBackgroundImage) {
  //       const videoId = getVideoId(stallData?.stall?.stallVideoLink);

  //       // Load the YouTube IFrame Player API
  //       const tag = document.createElement("script");
  //       tag.src = "https://www.youtube.com/iframe_api";
  //       const firstScriptTag = document.getElementsByTagName("script")[0];
  //       firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  //       // Initialize player when API is ready
  //       window.onYouTubeIframeAPIReady = function () {
  //         new YT.Player("player", {
  //           videoId: videoId, // Replace with your video ID
  //           playerVars: {
  //             autoplay: 1,
  //             controls: 0,
  //             modestbranding: 1,
  //             rel: 0,
  //             showinfo: 0,
  //             fs: 0,
  //             loop: 1,
  //             mute: 1,
  //           },
  //           events: {
  //             onStateChange: (event) => {
  //               if (event.data === YT.PlayerState.PAUSED) {
  //                 event.target.playVideo(); // Resume if paused
  //               }
  //             },
  //           },
  //         });
  //       };
  //     }
  //   }
  // }, [stallData]);

  return (
    <main className="w-full h-auto overflow-hidden relative">
      {confirmOpen ? (
        <MeetingListModel
          handleClick={handleConfirm}
          rowData={instantMeeting}
        />
      ) : (
        ""
      )}
      {isModelOpen ? (
        <Model
          productdata={stallData.productsList}
          profiledata={stallData.companyProfileList}
          videodata={stallData.stallVideoList}
        />
      ) : (
        ""
      )}
      {auditoriumModelOpen ? (
        <AuditoriumModal handleClose={handleCloseAuditorium} />
      ) : (
        ""
      )}
      {chatView ? <ExhibitorChatModal handleClose={handleClose} /> : ""}
      {support && <Support closeSupport={() => setSupport(!support)} />}
      {notificationView ? <NotificationModal handleClose={handleClose} /> : ""}
      {requestedSlotView ? (
        <RequestedSlotModal handleClose={handleCloseSlot} />
      ) : (
        ""
      )}
      {contactInfo ? (
        <ContactModel
          handleClick={handleContactInfo}
          visitingCard={stallData.stall}
        />
      ) : galleryModel ? (
        <GalleryModel
          handleClose={closeGallery}
          galleryImages={[
            ...stallData.galleryImageList.map((image) => ({
              ...image,
              type: "image",
            })),
            ...stallData.galleryVideoList.map((video) => ({
              ...video,
              type: "video",
            })),
          ]}
        ></GalleryModel>
      ) : (
        ""
      )}
      {/* <div className=" hidden scroll-icon fixed bottom-5 right-5 z-10">
        <Image
          alt="img"
          src={`${BUCKET_URL}/stall-view/scroll-down.svg`}
          width={100}
          height={100}
          className="w-16 h-16"
          onClick={() => {
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: "smooth",
            });
          }}
        ></Image>
      </div> */}
      {stallData && (
        <section
          className={`bg-[#808080] w-full mx-auto relative md:pt-0  md:pb-12 lg:pb-3 overflow-x-hidden lg:h-screen flex flex-col gap-[1.25rem] ${device === "tablet" ? "!h-auto" : ""
            }`}
          id="main-content-body"
          style={{ overflow: "hidden" }}
        >
          {/\.(mp4|webm|ogg)$/i.test(stallData?.stall?.stallImage) ? (
            <div
              style={{
                position: "relative",
                height: "88vh",
                width: "100%",
                zIndex: 0,
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
                  zIndex: -9999,
                }}
                autoPlay
                // loop
                muted
              >
                <source
                  src={`${BUCKET_URL}/video/stall.mp4`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <Image
              alt="img"
              ref={image}
              src={stallData.stall.stallImage}
              width={3000}
              height={3000}
              className="w-full h-auto"
              unoptimized
            ></Image>
          )}

          {device === "desktop" && height > 150 ? (
            <div className=" w-[80%] h-auto mx-auto text-center flex flex-col justify-center items-center">
              <div className=" px-4 py-2 flex flex-row flex-wrap gap-6 justify-center mt-10 mb-28">
                {stallData.stall &&
                  stallData.stall.social_media &&
                  stallData.stall.social_media.website && (
                    <a
                      href={stallData.stall.social_media.website}
                      target="_blank"
                      className="flex flex-col justify-center items-center cursor-pointer"
                    >
                      <Image
                        alt="img"
                        width={3000}
                        height={3000}
                        className=" w-6 h-6"
                        src={`${BUCKET_URL}/stall-view/website.svg`}
                      ></Image>
                      <p className=" text-xs font-quickSand font-bold mt-[2px] text-white">
                        Website
                      </p>
                    </a>
                  )}
                {stallData.stall &&
                  stallData.stall.social_media &&
                  stallData.stall.social_media.facebook && (
                    <a
                      href={stallData.stall.social_media.facebook}
                      target="_blank"
                      className="flex flex-col justify-center items-center cursor-pointer"
                    >
                      <Image
                        alt="img"
                        width={3000}
                        height={3000}
                        className=" w-6 h-6"
                        src={`${BUCKET_URL}/stall-view/facebook.svg`}
                      ></Image>
                      <p className=" text-xs font-quickSand font-bold mt-[2px]">
                        facebook
                      </p>
                    </a>
                  )}
                {stallData.stall &&
                  stallData.stall.social_media &&
                  stallData.stall.social_media.instagram && (
                    <a
                      href={stallData.stall.social_media.instagram}
                      target="_blank"
                      className="flex flex-col justify-center items-center cursor-pointer"
                    >
                      <Image
                        alt="img"
                        width={3000}
                        height={3000}
                        className=" w-6 h-6"
                        src={`${BUCKET_URL}/stall-view/instagram.svg`}
                      ></Image>
                      <p className=" text-xs font-quickSand font-bold mt-[2px]">
                        Instagram
                      </p>
                    </a>
                  )}
                {stallData.stall &&
                  stallData.stall.social_media &&
                  stallData.stall.social_media.twitter && (
                    <a
                      href={stallData.stall.social_media.twitter}
                      target="_blank"
                      className="flex flex-col justify-center items-center cursor-pointer"
                    >
                      <Image
                        alt="img"
                        width={3000}
                        height={3000}
                        className=" w-6 h-6"
                        src={`${BUCKET_URL}/social/x.svg`}
                      ></Image>
                      <p className=" text-xs font-quickSand font-bold mt-[2px]">
                        Twitter
                      </p>
                    </a>
                  )}
                {stallData.stall &&
                  stallData.stall.social_media &&
                  stallData.stall.social_media.youtube && (
                    <a
                      href={stallData.stall.social_media.youtube}
                      target="_blank"
                      className="flex flex-col justify-center items-center cursor-pointer"
                    >
                      <Image
                        alt="img"
                        width={3000}
                        height={3000}
                        className=" w-6 h-6"
                        src={`${BUCKET_URL}/stall-view/youtube.svg`}
                      ></Image>
                      <p className=" text-xs font-quickSand font-bold mt-[2px]">
                        Youtube
                      </p>
                    </a>
                  )}
                {stallData.stall &&
                  stallData.stall.social_media &&
                  stallData.stall.social_media.whatsapp && (
                    <a
                      href={`https://wa.me/${stallData.stall.social_media.whatsapp}`}
                      target="_blank"
                      className="flex flex-col justify-center items-center cursor-pointer"
                    >
                      <Image
                        alt="img"
                        width={3000}
                        height={3000}
                        className=" w-6 h-6"
                        src={`${BUCKET_URL}/stall-view/whatsapp.svg`}
                      ></Image>
                      <p className=" text-xs font-quickSand font-bold mt-[2px]">
                        Whatsapp
                      </p>
                    </a>
                  )}
              </div>
            </div>
          ) : (
            <div className=" fixed z-50 left-1/2 -translate-x-1/2 bottom-16 flex flex-row gap-10 py-5 px-5"></div>
          )}

          {/* For Desktop */}
          {device === "desktop" ? (
            <>
              <div className=" fixed z-[20] top-1/2 -translate-y-1/2 left-0 nav-wrapper left px-4 py-4 flex flex-col gap-6 bg-black">
                <div
                  onClick={() => handleModelopen("product")}
                  className=" max-w-[45px] flex flex-col justify-center items-center cursor-pointer"
                >
                  <div className=" w-10 h-10 p-2 bg-[#23272D] rounded-md">
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className="w-full h-auto"
                      src={`${BUCKET_URL}/stall-view/product.svg`}
                    ></Image>
                  </div>
                  {!isMobile && (
                    <p className=" text-xs font-quickSand font-bold mt-1 text-white">
                      Products
                    </p>
                  )}
                </div>
                <div
                  onClick={() => handleModelopen("profile")}
                  className=" max-w-[45px] flex flex-col justify-center items-center cursor-pointer"
                >
                  <div className=" w-10 h-10 p-2 bg-[#23272D] rounded-md">
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className="w-full h-auto"
                      src={`${BUCKET_URL}/stall-view/companyProfile.svg`}
                    ></Image>
                  </div>
                  <p className=" text-xs font-quickSand font-bold mt-1 text-center text-white">
                    Company Profile
                  </p>
                </div>
                <div
                  onClick={openGallery}
                  className=" max-w-[45px] flex flex-col justify-center items-center cursor-pointer"
                >
                  <div className=" w-10 h-10 p-2 bg-[#23272D] rounded-md">
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className="w-full h-auto"
                      src={`${BUCKET_URL}/stall-view/gallery.svg`}
                    ></Image>
                  </div>
                  <p className=" text-xs font-quickSand font-bold mt-1 text-white">
                    Gallery
                  </p>
                </div>
                <div
                  onClick={() => handleModelopen("video")}
                  className=" max-w-[45px] flex flex-col justify-center items-center cursor-pointer"
                >
                  <div className=" w-10 h-10 p-2 bg-[#23272D] rounded-md">
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className="w-full h-auto"
                      src={`${BUCKET_URL}/stall-view/videoLeft.svg`}
                    ></Image>
                  </div>
                  <p className=" text-xs font-quickSand font-bold mt-1 text-white">
                    Video
                  </p>
                </div>
                <div
                  onClick={handleContactInfo}
                  className=" max-w-[45px] flex flex-col justify-center items-center cursor-pointer"
                >
                  <div className=" w-10 h-10 p-2 bg-[#23272D] rounded-md">
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className="w-full h-auto"
                      src={`${BUCKET_URL}/stall-view/contact.svg`}
                    ></Image>
                  </div>
                  <p className=" text-xs font-quickSand font-bold mt-1 text-center text-white">
                    Contact Info
                  </p>
                </div>
              </div>
              <div className=" fixed z-[20] top-1/2 -translate-y-1/2 right-0 nav-wrapper right px-4 py-4 flex flex-col gap-6 bg-black">
                <div
                  className=" max-w-[45px] flex flex-col justify-center items-center cursor-pointer"
                  onClick={() => setConfirmOpen(true)}
                >
                  <div className=" w-10 h-10 p-2 bg-[#23272D] rounded-md">
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className="w-full h-auto"
                      src={`${BUCKET_URL}/zoom.png`}
                      unoptimized
                    ></Image>
                    {instantMeeting && instantMeeting.length ? (
                      <div
                        className="ml-4 top-0 bg-brand-color rounded-full flex flex-row items-center justify-center h-5 w-5 font-lato font-bold text-[8px]"
                        style={{ marginTop: "-38px" }}
                      >
                        {instantMeeting.length}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <p className=" text-xs font-quickSand font-bold mt-1 text-center text-white">
                    Join Meeting
                  </p>
                </div>
                <div
                  className=" max-w-[45px] flex flex-col justify-center items-center cursor-pointer"
                  onClick={() => setRequestedSlotView(!requestedSlotView)}
                >
                  <div className=" w-10 h-10 p-2 bg-[#23272D] rounded-md">
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className="w-full h-auto"
                      src={`${BUCKET_URL}/calendar.png`}
                      unoptimized
                    ></Image>
                    {slotCount ? (
                      <div
                        className="ml-4 top-0 bg-brand-color rounded-full flex flex-row items-center justify-center h-5 w-5 font-lato font-bold text-[8px]"
                        style={{ marginTop: "-38px" }}
                      >
                        {slotCount}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <p className=" text-xs font-quickSand font-bold mt-1 text-center text-white">
                    Meeting Request
                  </p>
                </div>
                <div
                  className=" max-w-[45px] flex flex-col justify-center items-center cursor-pointer"
                  onClick={() => handleChatView(chatView)}
                >
                  <div className=" w-10 h-10 p-2 bg-[#23272D] rounded-md">
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className="w-full h-auto"
                      src={`${BUCKET_URL}/chat.svg`}
                    ></Image>
                    {totalUnreadMessages ? (
                      <div
                        className="ml-4 top-0 bg-brand-color rounded-full flex flex-row items-center justify-center h-5 w-5 font-lato font-bold text-[8px]"
                        style={{ marginTop: "-38px" }}
                      >
                        {totalUnreadMessages}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <p className=" text-xs font-quickSand font-bold mt-1 text-white">
                    Chat
                  </p>
                </div>
              </div>
              {/* <div className=" fixed z-[20] top-1/2 -translate-y-1/2 right-0 nav-wrapper right px-6 py-4 flex flex-col gap-6">
                <div className=" max-w-[45px] flex flex-col justify-center items-center cursor-pointer">
                  <div className=" w-10 h-10 p-2 bg-[#23272D] rounded-md">
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className="w-full h-auto"
                      src={`${BUCKET_URL}/stall-view/Meeting.svg`}
                    ></Image>
                  </div>
                  <p className=" text-xs font-quickSand font-bold mt-1">
                    Instant Meeting
                  </p>
                </div>
                <div className=" max-w-[45px] flex flex-col justify-center items-center cursor-pointer">
                  <div className=" w-10 h-10 p-2 bg-[#23272D] rounded-md">
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className="w-full h-auto"
                      src={`${BUCKET_URL}/stall-view/video.svg`}
                    ></Image>
                  </div>
                  <p className=" text-xs font-quickSand font-bold mt-1 text-center">
                    Book a Meeting
                  </p>
                </div>
                <div className=" max-w-[45px] flex flex-col justify-center items-center cursor-pointer">
                  <div className=" w-10 h-10 p-2 bg-[#23272D] rounded-md">
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className="w-full h-auto"
                      src={`${BUCKET_URL}/chat.svg`}
                    ></Image>
                  </div>
                  <p className=" text-xs font-quickSand font-bold mt-1">chat</p>
                </div>
              </div> */}
            </>
          ) : (
            <>
              <div
                className={`md:fixed z-[10] mobileOrientation md:top-1/2 md:-translate-y-1/2 md:left-0  md:nav-wrapper md:left px-6 py-4 relative flex flex-row flex-wrap md:flex-col justify-center gap-5 w-full mt-5`}
              >
                <div
                  onClick={() => handleModelopen("product")}
                  className=" max-w-[45px] flex flex-col justify-start items-center cursor-pointer"
                >
                  <div className=" w-10 h-10 p-2 bg-[#23272D] rounded-md">
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className="w-full h-auto"
                      src={`${BUCKET_URL}/stall-view/product.svg`}
                    ></Image>
                  </div>
                  <p className=" text-xs font-quickSand font-bold mt-1">
                    Products
                  </p>
                </div>
                <div
                  onClick={() => handleModelopen("profile")}
                  className=" max-w-[45px] flex flex-col justify-start items-center cursor-pointer "
                >
                  <div className=" w-10 h-10 p-2 bg-[#23272D] rounded-md">
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className="w-full h-auto"
                      src={`${BUCKET_URL}/stall-view/companyProfile.svg`}
                    ></Image>
                  </div>
                  <p className=" text-xs font-quickSand font-bold mt-1 text-center">
                    Company Profile
                  </p>
                </div>
                <div
                  onClick={openGallery}
                  className=" max-w-[45px] flex flex-col justify-start items-center cursor-pointer"
                >
                  <div className=" w-10 h-10 p-2 bg-[#23272D] rounded-md">
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className="w-full h-auto"
                      src={`${BUCKET_URL}/stall-view/gallery.svg`}
                    ></Image>
                  </div>
                  <p className=" text-xs font-quickSand font-bold mt-1">
                    Gallery
                  </p>
                </div>
                <div
                  onClick={() => handleModelopen("video")}
                  className=" max-w-[45px] flex flex-col justify-start items-center cursor-pointer"
                >
                  <div className=" w-10 h-10 p-2 bg-[#23272D] rounded-md">
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className="w-full h-auto"
                      src={`${BUCKET_URL}/stall-view/videoLeft.svg`}
                    ></Image>
                  </div>
                  <p className=" text-xs font-quickSand font-bold mt-1">
                    Video
                  </p>
                </div>
                <div
                  onClick={handleContactInfo}
                  className=" max-w-[45px] flex flex-col justify-start items-center cursor-pointer"
                >
                  <div className=" w-10 h-10 p-2 bg-[#23272D] rounded-md">
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className="w-full h-auto"
                      src={`${BUCKET_URL}/stall-view/contact.svg`}
                    ></Image>
                  </div>
                  <p className=" text-xs font-quickSand font-bold mt-1 text-center">
                    Contact Info
                  </p>
                </div>
                {/* <div className=" max-w-[45px] flex flex-col justify-start items-center cursor-pointer">
                  <div className=" w-10 h-10 p-2 bg-[#23272D] rounded-md">
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className="w-full h-auto"
                      src={`${BUCKET_URL}/stall-view/Meeting.svg`}
                    ></Image>
                  </div>
                  <p className=" text-xs font-quickSand font-bold mt-1">
                    Instant Meeting
                  </p>
                </div>
                <div className=" max-w-[45px] flex flex-col justify-start items-center cursor-pointer">
                  <div className=" w-10 h-10 p-2 bg-[#23272D] rounded-md">
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className="w-full h-auto"
                      src={`${BUCKET_URL}/stall-view/video.svg`}
                    ></Image>
                  </div>
                  <p className=" text-xs font-quickSand font-bold mt-1 text-center">
                    Book a Meeting
                  </p>
                </div>
                <div className=" max-w-[45px] flex flex-col justify-start items-center cursor-pointer">
                  <div className=" w-10 h-10 p-2 bg-[#23272D] rounded-md">
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className="w-full h-auto"
                      src={`${BUCKET_URL}/stall-view/chat.svg`}
                    ></Image>
                  </div>
                  <p className=" text-xs font-quickSand font-bold mt-1">chat</p>
                </div> */}
              </div>
              {/* repeating elements for landscape */}
              <div className=" px-4 py-2 flex flex-row flex-wrap gap-6 justify-center bottomSocial">
                <div
                  className="flex flex-col justify-center items-center cursor-pointer"
                  onClick={handleClickNotify}
                >
                  <NotificationsActiveIcon
                    sx={{ fontSize: 24, color: "white" }}
                  />
                  {notifications && (
                    <div className="absolute ml-4 top-0 bg-brand-color rounded-full flex flex-row items-center justify-center h-5 w-5 font-lato font-bold text-[8px]">
                      {notifications && notifications.length}
                    </div>
                  )}
                  <p className=" text-xs font-quickSand font-bold mt-[2px] text-white">
                    Notification
                  </p>
                </div>
                <Popover
                  id={idNotify}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleCloseNotify}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <div className="popoverHeader">
                    <div>Notifications</div>
                    <Button color="primary" size="small" onClick={handleSeeAll}>
                      See All
                    </Button>
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
                            {res?.notificationType} -{" "}
                            {dayjsShortFormat(res?.createdAt)}
                          </div>
                        </div>
                      ))}
                  </div>
                </Popover>
                {stallData.stall &&
                  stallData.stall.social_media &&
                  stallData.stall.social_media.website && (
                    <a
                      href={stallData.stall.social_media.website}
                      target="_blank"
                      className="flex flex-col justify-center items-center cursor-pointer"
                    >
                      <Image
                        alt="img"
                        width={3000}
                        height={3000}
                        className=" w-6 h-6"
                        src={`${BUCKET_URL}/stall-view/website.svg`}
                      ></Image>
                      {/* <p className=" text-xs font-quickSand font-bold mt-[2px]">
                      Website
                    </p> */}
                    </a>
                  )}
                {stallData.stall &&
                  stallData.stall.social_media &&
                  stallData.stall.social_media.facebook && (
                    <a
                      href={stallData.stall.social_media.facebook}
                      target="_blank"
                      className="flex flex-col justify-center items-center cursor-pointer"
                    >
                      <Image
                        alt="img"
                        width={3000}
                        height={3000}
                        className=" w-6 h-6"
                        src={`${BUCKET_URL}/stall-view/facebook.svg`}
                      ></Image>
                      {/* <p className=" text-xs font-quickSand font-bold mt-[2px]">
                      facebook
                    </p> */}
                    </a>
                  )}
                {stallData.stall &&
                  stallData.stall.social_media &&
                  stallData.stall.social_media.instagram && (
                    <a
                      href={stallData.stall.social_media.instagram}
                      target="_blank"
                      className="flex flex-col justify-center items-center cursor-pointer"
                    >
                      <Image
                        alt="img"
                        width={3000}
                        height={3000}
                        className=" w-6 h-6"
                        src={`${BUCKET_URL}/stall-view/instagram.svg`}
                      ></Image>
                      {/* <p className=" text-xs font-quickSand font-bold mt-[2px]">
                      Instagram
                    </p> */}
                    </a>
                  )}
                {stallData.stall &&
                  stallData.stall.social_media &&
                  stallData.stall.social_media.twitter && (
                    <a
                      href={stallData.stall.social_media.twitter}
                      target="_blank"
                      className="flex flex-col justify-center items-center cursor-pointer"
                    >
                      <Image
                        alt="img"
                        width={3000}
                        height={3000}
                        className=" w-6 h-6"
                        src={`${BUCKET_URL}/social/x.svg`}
                      ></Image>
                      {/* <p className=" text-xs font-quickSand font-bold mt-[2px]">
                      Twitter
                    </p> */}
                    </a>
                  )}
                {stallData.stall &&
                  stallData.stall.social_media &&
                  stallData.stall.social_media.youtube && (
                    <a
                      href={stallData.stall.social_media.youtube}
                      target="_blank"
                      className="flex flex-col justify-center items-center cursor-pointer"
                    >
                      <Image
                        alt="img"
                        width={3000}
                        height={3000}
                        className=" w-6 h-6"
                        src={`${BUCKET_URL}/stall-view/youtube.svg`}
                      ></Image>
                      {/* <p className=" text-xs font-quickSand font-bold mt-[2px]">
                      Youtube
                    </p> */}
                    </a>
                  )}
                {stallData.stall &&
                  stallData.stall.social_media &&
                  stallData.stall.social_media.whatsapp && (
                    <a
                      href={`https://wa.me/${stallData.stall.social_media.whatsapp}`}
                      target="_blank"
                      className="flex flex-col justify-center items-center cursor-pointer"
                    >
                      <Image
                        alt="img"
                        width={3000}
                        height={3000}
                        className=" w-6 h-6"
                        src={`${BUCKET_URL}/stall-view/whatsapp.svg`}
                      ></Image>
                      {/* <p className=" text-xs font-quickSand font-bold mt-[2px]">
                      Whatsapp
                    </p> */}
                    </a>
                  )}
              </div>
              <div className="hidden fixed z-[20] top-0 right-0 nav-wrapper top px-4 py-2 topNavSocial flex-row gap-6 bg-black">
                {stallData.stall &&
                  stallData.stall.social_media &&
                  stallData.stall.social_media.website && (
                    <a
                      href={stallData.stall.social_media.website}
                      target="_blank"
                      className="flex flex-col justify-center items-center cursor-pointer"
                    >
                      <Image
                        alt="img"
                        width={3000}
                        height={3000}
                        className=" w-6 h-6"
                        src={`${BUCKET_URL}/stall-view/website.svg`}
                      ></Image>
                      {/* <p className=" text-xs font-quickSand font-bold mt-[2px]">
                      Website
                    </p> */}
                    </a>
                  )}
                {stallData.stall &&
                  stallData.stall.social_media &&
                  stallData.stall.social_media.facebook && (
                    <a
                      href={stallData.stall.social_media.facebook}
                      target="_blank"
                      className="flex flex-col justify-center items-center cursor-pointer"
                    >
                      <Image
                        alt="img"
                        width={3000}
                        height={3000}
                        className=" w-6 h-6"
                        src={`${BUCKET_URL}/stall-view/facebook.svg`}
                      ></Image>
                      {/* <p className=" text-xs font-quickSand font-bold mt-[2px]">
                      facebook
                    </p> */}
                    </a>
                  )}
                {stallData.stall &&
                  stallData.stall.social_media &&
                  stallData.stall.social_media.instagram && (
                    <a
                      href={stallData.stall.social_media.instagram}
                      target="_blank"
                      className="flex flex-col justify-center items-center cursor-pointer"
                    >
                      <Image
                        alt="img"
                        width={3000}
                        height={3000}
                        className=" w-6 h-6"
                        src={`${BUCKET_URL}/stall-view/instagram.svg`}
                      ></Image>
                      {/* <p className=" text-xs font-quickSand font-bold mt-[2px]">
                      Instagram
                    </p> */}
                    </a>
                  )}
                {stallData.stall &&
                  stallData.stall.social_media &&
                  stallData.stall.social_media.twitter && (
                    <a
                      href={stallData.stall.social_media.twitter}
                      target="_blank"
                      className="flex flex-col justify-center items-center cursor-pointer"
                    >
                      <Image
                        alt="img"
                        width={3000}
                        height={3000}
                        className=" w-6 h-6"
                        src={`${BUCKET_URL}/social/x.svg`}
                      ></Image>
                      {/* <p className=" text-xs font-quickSand font-bold mt-[2px]">
                      Twitter
                    </p> */}
                    </a>
                  )}
                {stallData.stall &&
                  stallData.stall.social_media &&
                  stallData.stall.social_media.youtube && (
                    <a
                      href={stallData.stall.social_media.youtube}
                      target="_blank"
                      className="flex flex-col justify-center items-center cursor-pointer"
                    >
                      <Image
                        alt="img"
                        width={3000}
                        height={3000}
                        className=" w-6 h-6"
                        src={`${BUCKET_URL}/stall-view/youtube.svg`}
                      ></Image>
                      {/* <p className=" text-xs font-quickSand font-bold mt-[2px]">
                      Youtube
                    </p> */}
                    </a>
                  )}
                {stallData.stall &&
                  stallData.stall.social_media &&
                  stallData.stall.social_media.whatsapp && (
                    <a
                      href={`https://wa.me/${stallData.stall.social_media.whatsapp}`}
                      target="_blank"
                      className="flex flex-col justify-center items-center cursor-pointer"
                    >
                      <Image
                        alt="img"
                        width={3000}
                        height={3000}
                        className=" w-6 h-6"
                        src={`${BUCKET_URL}/stall-view/whatsapp.svg`}
                      ></Image>
                      {/* <p className=" text-xs font-quickSand font-bold mt-[2px]">
                      Whatsapp
                    </p> */}
                    </a>
                  )}
              </div>
              <div className=" flex justify-center items-center gap-3 rotateText">
                <Image
                  alt="img"
                  src={`${BUCKET_URL}/rotate-screen.svg`}
                  height={100}
                  width={100}
                  className="  w-5 h-auto"
                ></Image>
                <p className=" text-center text-base font-semibold text-black opacity-80">
                  Rotate your phone for better view
                </p>
              </div>
            </>
          )}
          {device === "desktop" && height < 150 ? (
            <>
              <div className=" fixed z-[20] top-0 right-0 nav-wrapper top px-4 py-2 flex flex-row gap-6 bg-black">
                <a
                  href="#"
                  className="flex flex-col justify-center items-center cursor-pointer"
                  onClick={handleClickNotify}
                >
                  <NotificationsActiveIcon
                    sx={{ fontSize: 24, color: "white" }}
                  />
                  {notifications && (
                    <div className="absolute ml-4 top-0 bg-brand-color rounded-full flex flex-row items-center justify-center h-5 w-5 font-lato font-bold text-[8px]">
                      {notifications && notifications.length}
                    </div>
                  )}
                  <p className=" text-xs font-quickSand font-bold mt-[2px] text-white">
                    Notification
                  </p>
                </a>
                <Popover
                  id={idNotify}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleCloseNotify}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <div className="popoverHeader">
                    <div>Notifications</div>
                    <Button color="primary" size="small" onClick={handleSeeAll}>
                      See All
                    </Button>
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
                            {res?.notificationType} -{" "}
                            {dayjsShortFormat(res?.createdAt)}
                          </div>
                        </div>
                      ))}
                  </div>
                </Popover>
                {stallData.stall &&
                  stallData.stall.social_media &&
                  stallData.stall.social_media.website && (
                    <a
                      href={stallData.stall.social_media.website}
                      target="_blank"
                      className="flex flex-col justify-center items-center cursor-pointer"
                    >
                      <Image
                        alt="img"
                        width={3000}
                        height={3000}
                        className=" w-6 h-6"
                        src={`${BUCKET_URL}/stall-view/website.svg`}
                      ></Image>
                      <p className=" text-xs font-quickSand font-bold mt-[2px] text-white">
                        Website
                      </p>
                    </a>
                  )}
                {stallData.stall &&
                  stallData.stall.social_media &&
                  stallData.stall.social_media.facebook && (
                    <a
                      href={stallData.stall.social_media.facebook}
                      target="_blank"
                      className="flex flex-col justify-center items-center cursor-pointer"
                    >
                      <Image
                        alt="img"
                        width={3000}
                        height={3000}
                        className=" w-6 h-6"
                        src={`${BUCKET_URL}/stall-view/facebook.svg`}
                      ></Image>
                      <p className=" text-xs font-quickSand font-bold mt-[2px] text-white">
                        facebook
                      </p>
                    </a>
                  )}
                {stallData.stall &&
                  stallData.stall.social_media &&
                  stallData.stall.social_media.instagram && (
                    <a
                      href={stallData.stall.social_media.instagram}
                      target="_blank"
                      className="flex flex-col justify-center items-center cursor-pointer"
                    >
                      <Image
                        alt="img"
                        width={3000}
                        height={3000}
                        className=" w-6 h-6"
                        src={`${BUCKET_URL}/stall-view/instagram.svg`}
                      ></Image>
                      <p className=" text-xs font-quickSand font-bold mt-[2px] text-white">
                        Instagram
                      </p>
                    </a>
                  )}
                {stallData.stall &&
                  stallData.stall.social_media &&
                  stallData.stall.social_media.twitter && (
                    <a
                      href={stallData.stall.social_media.twitter}
                      target="_blank"
                      className="flex flex-col justify-center items-center cursor-pointer"
                    >
                      <Image
                        alt="img"
                        width={3000}
                        height={3000}
                        className=" w-6 h-6"
                        src={`${BUCKET_URL}/social/x.svg`}
                      ></Image>
                      <p className=" text-xs font-quickSand font-bold mt-[2px] text-white">
                        Twitter
                      </p>
                    </a>
                  )}
                {stallData.stall &&
                  stallData.stall.social_media &&
                  stallData.stall.social_media.youtube && (
                    <a
                      href={stallData.stall.social_media.youtube}
                      target="_blank"
                      className="flex flex-col justify-center items-center cursor-pointer"
                    >
                      <Image
                        alt="img"
                        width={3000}
                        height={3000}
                        className=" w-6 h-6"
                        src={`${BUCKET_URL}/stall-view/youtube.svg`}
                      ></Image>
                      <p className=" text-xs font-quickSand font-bold mt-[2px] text-white">
                        Youtube
                      </p>
                    </a>
                  )}
                {stallData.stall &&
                  stallData.stall.social_media &&
                  stallData.stall.social_media.whatsapp && (
                    <a
                      href={`https://wa.me/${stallData.stall.social_media.whatsapp}`}
                      target="_blank"
                      className="flex flex-col justify-center items-center cursor-pointer"
                    >
                      <Image
                        alt="img"
                        width={3000}
                        height={3000}
                        className=" w-6 h-6"
                        src={`${BUCKET_URL}/stall-view/whatsapp.svg`}
                      ></Image>
                      <p className=" text-xs font-quickSand font-bold mt-[2px] text-white">
                        Whatsapp
                      </p>
                    </a>
                  )}
              </div>
              <div className=" fixed z-[20] top-0 left-0 nav-wrapper top px-4 py-2 flex flex-row gap-6 bg-black">
                <Link
                  href="/exhibitor"
                  className="flex flex-col justify-center items-center cursor-pointer"
                >
                  <Image
                    alt="img"
                    width={3000}
                    height={3000}
                    className=" w-6 h-6"
                    src={`${BUCKET_URL}/dashboard1.svg`}
                  ></Image>
                  <p className=" text-xs font-quickSand font-bold mt-[2px] text-white">
                    Dashbord
                  </p>
                </Link>
              </div>
            </>
          ) : (
            ""
          )}
          {device === "desktop" && height < 150 ? (
            <>
              <div className=" fixed z-[20] bottom-0 right-0 nav-wrapper bottom1 px-2 py-2 flex flex-row gap-6 bg-black">
                <div
                  onClick={() => setAuditoriumModelOpen(true)}
                  className="flex flex-col justify-center items-center cursor-pointer"
                >
                  <Image
                    alt="img"
                    width={3000}
                    height={3000}
                    className=" w-6 h-6"
                    src={`${BUCKET_URL}/audi.png`}
                    unoptimized
                  ></Image>
                  <p className=" text-xs font-quickSand font-bold mt-[2px] text-white">
                    Auditorium
                  </p>
                </div>
              </div>
              <div className=" fixed z-[20] bottom-0 left-0 nav-wrapper left1 px-3 py-2 flex flex-row gap-6 bg-black">
                <div
                  onClick={() => setSupport(!support)}
                  className="flex flex-col justify-center items-center cursor-pointer"
                >
                  <Image
                    alt="img"
                    width={3000}
                    height={3000}
                    className=" w-6 h-6"
                    src={`${BUCKET_URL}/support.png`}
                    unoptimized
                  ></Image>
                  <p className=" text-xs font-quickSand font-bold mt-[2px] text-white">
                    Support
                  </p>
                </div>
                {/* )} */}
              </div>
            </>
          ) : (
            ""
          )}
        </section>
      )}
    </main>
  );
};

export default Page;
