"use client";
import React, { useRef, useState, useEffect, Suspense } from "react";
import Image from "next/image";
import "./stallView.css";
import { isMobile, isTablet } from "react-device-detect";
import { userDetails } from "@/models/data";
import ContactModel from "@/components/contactModel";
import { useDispatch, useSelector } from "react-redux";
import GalleryModel from "@/components/galleryModel";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  modelChange,
  modelOpen,
} from "@/GlobalRedux/features/dialogs/dialogSlice";
import { toggleNavbar } from "@/GlobalRedux/features/common/commonSlice";
import Model from "@/components/visitor/model";
import { request } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { trackUtil } from "@/lib/track";
import ConfirmModel from "@/components/confirmModel";
import { notificationVisitorUtil } from "@/lib/notification";
import { BUCKET_URL } from "@/config/constant";

const VisitorStallView = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const visitorId =
    typeof window !== "undefined" ? sessionStorage.getItem("id") : null;
  const visitorName =
    typeof window !== "undefined" ? sessionStorage.getItem("name") : null;

  const fetchStallData = async () => {
    return request({ url: `visitor/stall/${id}/${visitorId}`, method: "get" });
  };

  const {
    isLoading,
    data: stallData,
    isError,
    error,
  } = useQuery({
    queryKey: ["stall-data", id], // Include id in the queryKey
    queryFn: fetchStallData,
    enabled: !!id, // Enable the query only if id is present
  });

  /*Stall*/
  const fetchAllStall = async () => {
    return request({ url: "visitor/all-stall", method: "get" });
  };
  const { data: stallList } = useQuery({
    queryKey: ["all-stall"],
    queryFn: fetchAllStall,
  });

  const isModelOpen = useSelector((state) => state.dialog.isopen);
  const router = useRouter();
  const dispatch = useDispatch();

  const [device, setDevice] = useState(null);
  const [height, setHeight] = useState(null);
  const user = userDetails;
  const [contactInfo, setContactInfoOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [galleryModel, setGalleryModel] = useState(false);
  const [floorModel, setFloorModel] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [stallsListDetails, setStallsListDetails] = useState([]);
  const [totalStalls, setTotalStalls] = useState(0);
  const [meetingId, setMeetingId] = useState("");

  const fetchInstantMeetingData = async () => {
    return request({
      url: `visitor/instant-meeting-by-stall/${id}/${visitorId}`,
      method: "get",
    });
  };

  const { data: instantMeeting } = useQuery({
    queryKey: ["instant-meeting", id], // Include id in the queryKey
    queryFn: fetchInstantMeetingData,
    enabled: !!id, // Enable the query only if id is present
    refetchInterval: 5000,
  });
  // Function to sort stallList by position
  const sortStallListByPosition = (list) => {
    return list.sort((a, b) => {
      return a.position - b.position;
    });
  };

  useEffect(() => {
    const createOrUpdateVisitedStall = async () => {
      try {
        if (stallData) {
          await request({
            url: "visitor/visited-stall",
            method: "post",
            data: {
              stall: id,
              exhibitor: stallData.stall.exhibitor,
              visitor: visitorId,
            },
          });
        }
      } catch (error) {
        console.error("Error creating or updating visited stall:", error);
      }
    };
    createOrUpdateVisitedStall();
  }, [stallData, id, visitorId]);
  useEffect(() => {
    if (stallList && stallList.length) {
      const sortedStallList = sortStallListByPosition([...stallList]);
      setTotalStalls(stallList.length);
      setStallsListDetails(sortedStallList);
    }
  }, [stallList]);
  const image = useRef(null);
  useEffect(() => {
    if (isMobile || isTablet) {
      setDevice(isMobile === true && isTablet === false ? "mobile" : "tablet");
    } else {
      setDevice("desktop");
    }
    return () => {};
  }, []);
  useEffect(() => {
    dispatch(toggleNavbar(false));
    return () => {
      dispatch(toggleNavbar(true));
    };
  }, []);
  useEffect(() => {
    if (stallData && stallData.stall) {
      trackUtil({
        trackEventType: "Stall View",
        data: {
          stallName: stallData.stall.stallName,
        },
      });
      notificationVisitorUtil(
        {
          notificationType: "Stall Visit",
          data: {
            stallName: stallData.stall.stallName,
          },
        },
        stallData.stall.exhibitor
      );
    }
    return () => {
      setConfirmOpen(false);
      setMeetingId("");
    };
  }, [stallData]);

  const mousedown = (e) => {
    icon.current.classList.add("iconani");
    setTimeout(() => {
      likeButton.current.classList.remove("hidden");
      dislikeButton.current.classList.remove("hidden");
    }, 1000);
  };
  const mouseup = (e) => {
    icon.current.classList.remove("iconani");
    likeButton.current.classList.add("hidden");
    dislikeButton.current.classList.add("hidden");
  };

  const likeButton = useRef(null);
  const dislikeButton = useRef(null);
  const icon = useRef(null);

  const handlemouseover = (e) => {
    console.log("like");
    e.target.classList.add("likeicon");
    setTimeout(() => {
      icon.current.classList.remove("iconani");
      likeButton.current.classList.add("hidden");
      dislikeButton.current.classList.add("hidden");
    }, 1000);
  };

  const handleContactInfo = () => {
    setContactInfoOpen(!contactInfo);
    setGalleryModel(false);
    if (stallData && stallData.stall) {
      trackUtil({
        trackEventType: "Stall View Contact Info",
        data: {
          stallName: stallData.stall.stallName,
        },
      });
    }
  };
  const handleConfirm = () => {
    setConfirmOpen(false);
  };
  const openGallery = () => {
    setGalleryModel(true);
    setContactInfoOpen(false);
    if (stallData && stallData.stall) {
      trackUtil({
        trackEventType: "Stall View Gallery",
        data: {
          stallName: stallData.stall.stallName,
        },
      });
    }
  };
  const closeGallery = () => {
    setGalleryModel(false);
  };
  const openFloor = () => {
    setFloorModel(true);
  };
  const closeFloor = () => {
    setFloorModel(false);
  };

  const handleModelopen = (e) => {
    dispatch(modelChange(e));
    dispatch(modelOpen());
    if (stallData && stallData.stall) {
      trackUtil({
        trackEventType: e,
        data: {
          stallName: stallData.stall.stallName,
        },
      });
    }
  };

  const moveToStall = (stallPosition, nextOrPrev) => {
    let upcomingStallPosition;
    if (nextOrPrev === "next" && stallPosition !== totalStalls) {
      upcomingStallPosition = parseInt(stallPosition) + 1;
    } else if (nextOrPrev === "prev" && stallPosition !== 0) {
      upcomingStallPosition = parseInt(stallPosition) - 1;
    } else {
      return; // Do nothing if already at the beginning or end
    }

    const stallRedirectId = stallsListDetails.find(
      (res) => res?.position == upcomingStallPosition
    )._id;

    if (stallRedirectId) {
      router.push(`/visitor/stall-view?id=${stallRedirectId}`);
    }
  };

  const socialTrack = (social) => {
    if (stallData && stallData.stall) {
      trackUtil({
        trackEventType: `View ${social}`,
        data: {
          stallName: stallData.stall.stallName,
        },
      });
    }
  };

  const requestForInstantMeeting = async () => {
    const meetingData = await request({
      url: `visitor/instant-meeting`,
      method: "post",
      data: {
        visitor: visitorId,
        name: visitorName,
        stallId: id,
        exhibitor: stallData.stall.exhibitor,
        approve: false,
        completed: false,
        rejected: false,
      },
    });
    if (meetingData) {
      setConfirmOpen(true);
      setMeetingId(meetingData._id);
    }

    notificationVisitorUtil(
      {
        notificationType: "Instant Meeting",
        data: {
          stallName: stallData.stall.stallName,
        },
      },
      stallData.stall.exhibitor
    );
  };

  useEffect(() => {
    setConfirmOpen(false);
    setMeetingId("");
  }, [id]);

  return (
    <main className="w-full h-auto overflow-hidden relative">
      {isModelOpen ? (
        <Model
          productdata={stallData.productsList}
          profiledata={stallData.companyProfileList}
          videodata={stallData.stallVideoList}
          stallData={stallData}
        />
      ) : (
        ""
      )}
      {confirmOpen ? (
        <ConfirmModel
          handleClick={handleConfirm}
          meetingId={meetingId}
          instantMeetingData={instantMeeting}
        />
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
          galleryImages={stallData.galleryImageList}
        ></GalleryModel>
      ) : floorModel ? (
        <FloorModel handleClose={closeFloor} />
      ) : (
        ""
      )}
      <div className=" hidden scroll-icon fixed bottom-5 right-5 z-10">
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
      </div>
      {stallData && (
        <section
          className={`bg-[#808080] w-full mx-auto relative md:pt-0 pb-24 md:pb-12 lg:pb-3 overflow-x-hidden lg:h-screen flex flex-col gap-[1.25rem] ${
            device === "tablet" ? "!h-auto" : ""
          }`}
          id="main-content-body"
          style={{ overflow: "hidden" }}
        >
          <Image
            alt="img"
            ref={image}
            src={stallData?.stall?.stallImage}
            width={3000}
            height={3000}
            className="w-full h-auto"
            unoptimized
            blurDataURL={`${BUCKET_URL}/blurred.svg`}
          ></Image>
          {device === "desktop" && height > 150 ? (
            <div className=" w-[80%] h-auto mx-auto text-center flex flex-col justify-center items-center">
              <div className=" flex flex-row gap-10 py-5 px-5">
                <div
                  onClick={(e) => {
                    moveToStall(stallData.stall.position, "prev");
                  }}
                  className={`${
                    stallData.stall && stallData.stall.position == 1
                      ? " pointer-events-none opacity-50"
                      : " opacity-100"
                  }  h-20 w-20 flex flex-col gap-1 justify-center items-center rounded-full cursor-pointer bg-black `}
                >
                  <Image
                    alt="img"
                    src={`${BUCKET_URL}/arrow-left.svg`}
                    height={100}
                    width={100}
                    className=" w-3 h-auto"
                  ></Image>
                  <p className=" text-[9px] text-white font-bold">
                    Prev <br />
                    Stall
                  </p>
                </div>
                <p className=" text-[14px] text-white font-bold mt-7">
                  Stall {stallData.stall && stallData.stall.position} of{" "}
                  {totalStalls}
                </p>
                <div
                  onClick={(e) => {
                    moveToStall(stallData.stall.position, "next");
                  }}
                  className={`${
                    stallData.stall &&
                    stallData.stall.position == stallsListDetails.length
                      ? " pointer-events-none opacity-50"
                      : " opacity-100"
                  }  h-20 w-20 flex flex-col gap-1 justify-center items-center rounded-full cursor-pointer bg-black `}
                >
                  <Image
                    alt="img"
                    src={`${BUCKET_URL}/arrow-right.svg`}
                    height={100}
                    width={100}
                    className=" w-3 h-auto"
                  ></Image>
                  <p className=" text-[9px] text-white font-bold">
                    Next <br />
                    Stall
                  </p>
                </div>
              </div>
              <div className=" px-4 py-2 flex flex-row flex-wrap gap-6 justify-center mt-10 mb-28">
                {stallData.stall &&
                  stallData.stall.social_media &&
                  stallData.stall.social_media.website && (
                    <a
                      href={stallData.stall.social_media.website}
                      target="_blank"
                      className="flex flex-col justify-center items-center cursor-pointer"
                      onClick={() => socialTrack("Website")}
                    >
                      <Image
                        alt="img"
                        width={3000}
                        height={3000}
                        className=" w-6 h-6"
                        src={`${BUCKET_URL}/stall-view/website.svg`}
                      ></Image>
                      <p className=" text-xs font-quickSand font-bold mt-[2px]">
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
                      onClick={() => socialTrack("facebook")}
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
                      onClick={() => socialTrack("Instagram")}
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
                      onClick={() => socialTrack("Twitter")}
                    >
                      <Image
                        alt="img"
                        width={3000}
                        height={3000}
                        className=" w-6 h-6"
                        src={`${BUCKET_URL}/stall-view/twitter.svg`}
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
                      onClick={() => socialTrack("Youtube")}
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
                      onClick={() => socialTrack("Whatsapp")}
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
            <div className=" fixed z-50 left-1/2 -translate-x-1/2 bottom-16 flex flex-row gap-10 py-5 px-5">
              <div
                onClick={(e) => {
                  moveToStall(stallData.stall.position, "prev");
                }}
                className={`${
                  stallData.stall && stallData.stall.position == 1
                    ? " pointer-events-none opacity-50"
                    : " opacity-100"
                }  h-20 w-20 flex flex-col gap-1 justify-center items-center rounded-full cursor-pointer bg-black `}
              >
                <Image
                  alt="img"
                  src={`${BUCKET_URL}/arrow-left.svg`}
                  height={100}
                  width={100}
                  className=" w-3 h-auto"
                ></Image>
                <p className=" text-[9px] text-white font-bold">
                  Prev <br />
                  Stall
                </p>
              </div>
              <p className=" text-[14px] text-white font-bold mt-7">
                Stall {stallData.stall && stallData.stall.position} of{" "}
                {totalStalls}
              </p>

              <div
                onClick={(e) => {
                  moveToStall(stallData.stall.position, "next");
                }}
                className={`${
                  stallData.stall &&
                  stallData.stall.position == stallsListDetails.length
                    ? " pointer-events-none opacity-50"
                    : " opacity-100"
                }  h-20 w-20 flex flex-col gap-1 justify-center items-center rounded-full cursor-pointer bg-black `}
              >
                <Image
                  alt="img"
                  src={`${BUCKET_URL}/arrow-right.svg`}
                  height={100}
                  width={100}
                  className=" w-3 h-auto"
                ></Image>
                <p className=" text-[9px] text-white font-bold">
                  Next <br />
                  Stall
                </p>
              </div>
            </div>
          )}

          {/* For Desktop */}
          {device === "desktop" ? (
            <>
              <div className=" fixed z-[20] top-0 left-0 nav-wrapper top px-4 py-2 flex flex-row gap-6 bg-black">
                <div
                  className="flex flex-col justify-center items-center cursor-pointer"
                  onClick={openFloor}
                >
                  <p className=" text-xs font-quickSand font-bold mt-[2px] text-white">
                    Move To Halls
                  </p>
                </div>
              </div>
              <div className=" fixed z-[20] top-1/2 -translate-y-1/2 left-0 nav-wrapper left px-6 py-4 flex flex-col gap-6">
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
                  <p className=" text-xs font-quickSand font-bold mt-1">
                    Products
                  </p>
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
                  <p className=" text-xs font-quickSand font-bold mt-1 text-center">
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
                  <p className=" text-xs font-quickSand font-bold mt-1">
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
                  <p className=" text-xs font-quickSand font-bold mt-1">
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
                  <p className=" text-xs font-quickSand font-bold mt-1 text-center">
                    Contact Info
                  </p>
                </div>
              </div>
              <div className=" fixed z-[20] top-1/2 -translate-y-1/2 right-0 nav-wrapper right px-6 py-4 flex flex-col gap-6">
                <div
                  className=" max-w-[45px] flex flex-col justify-center items-center cursor-pointer"
                  onClick={() => requestForInstantMeeting()}
                  // onClick={() => router.push(`/visitor/video-chat?id=${id}`)}
                >
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
                      src={`${BUCKET_URL}/stall-view/chat.svg`}
                    ></Image>
                  </div>
                  <p className=" text-xs font-quickSand font-bold mt-1">chat</p>
                </div>
              </div>
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
                <div className=" max-w-[45px] flex flex-col justify-start items-center cursor-pointer">
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
                </div>
              </div>
              {/* repeating elements for landscape */}
              <div className=" px-4 py-2 flex flex-row flex-wrap gap-6 justify-center bottomSocial">
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
                        src={`${BUCKET_URL}/stall-view/twitter.svg`}
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
                        src={`${BUCKET_URL}/stall-view/twitter.svg`}
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
            <div className=" fixed z-[20] top-0 right-0 nav-wrapper top px-4 py-2 flex flex-row gap-6 bg-black">
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
                    <p className=" text-xs font-quickSand font-bold mt-[2px]">
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
                      src={`${BUCKET_URL}/stall-view/twitter.svg`}
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
          ) : (
            ""
          )}

          {/* Like Area */}
          {/* {device === "desktop" ? (
            <div
              onMouseDown={mousedown}
              onMouseUp={mouseup}
              className="fixed z-[200] bottom-14 right-16 iconwrap max-w-[105px] flex justify-center items-center flex-col"
            >
              <div className="relative">
                <Image
                  alt="img"
                  ref={icon}
                  src={`${BUCKET_URL}/stall-view/care-emoji-for-mobile.svg`}
                  className=" w-16 h-16 cursor-pointer relative z-30"
                  width={3000}
                  height={3000}
                  draggable="false"
                ></Image>
                <Image
                  alt="img"
                  src={`${BUCKET_URL}/stall-view/like.svg`}
                  width={3000}
                  height={3000}
                  onMouseEnter={handlemouseover}
                  ref={likeButton}
                  className="w-7 h-7 absolute z-40 -left-3 -top-3 hidden"
                ></Image>
                <Image
                  alt="img"
                  src={`${BUCKET_URL}/stall-view/dislike.svg`}
                  width={3000}
                  height={3000}
                  onMouseEnter={handlemouseover}
                  ref={dislikeButton}
                  className="w-7 h-7 absolute z-40 -right-3 -top-3 hidden"
                ></Image>
              </div>
              <p className=" text-center font-quickSand text-xs font-bold select-none">
                Long Press to React to the Store
              </p>
            </div>
          ) : (
            ""
          )} */}
        </section>
      )}
    </main>
  );
};

export default VisitorStallView;
