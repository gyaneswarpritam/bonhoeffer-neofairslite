"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import "./stallView.css";
import { isMobile, isTablet } from "react-device-detect";
import SideNav from "@/components/side-nav";
import { userDetails } from "@/models/data";
import Link from "next/link";
import ContactModel from "@/components/contactModel";
import { useDispatch, useSelector } from "react-redux";
import {
  modelChange,
  modelOpen,
  modelClose,
} from "../../GlobalRedux/features/dialogs/dialogSlice";
import GalleryModel from "@/components/galleryModel";
import { useParams } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { activeChange } from "../../GlobalRedux/features/stallview/stallView";
import { useRouter } from "next/navigation";
import Signup from "./Signup";
import { BUCKET_URL } from "@/config/constant";

const Page = () => {
  const modelName = useSelector((state) => state.dialog.name);
  const lengthOfList = useSelector((state) => state.stallview.num);
  let itemsList = useSelector((state) => state.stallview.list);
  const activeItem = useSelector((state) => state.stallview.active);
  const initialName = useSelector((state) => state.stallview.initialName);
  const [signUpModel, setSignUpModel] = useState(true);
  // const params = useParams();
  // const searchParams = useSearchParams();
  // let r = searchParams.get("name");
  const router = useRouter();
  // let sorted = itemsList.forEach(function (item, i) {
  //   if (item.name === r) {
  //     itemsList.splice(i, 1);
  //     itemsList.unshift(item);
  //   }
  // });
  const foundIdx = itemsList.findIndex((el) => el.name == initialName);
  let ele = itemsList[foundIdx];
  const arrCopy = [...itemsList];
  // if (activeItem === 0) {
  arrCopy.splice(foundIdx, 1);
  arrCopy.unshift(ele);
  // }

  const dispatch = useDispatch();

  const [device, setDevice] = useState(null);
  const [height, setHeight] = useState(null);
  const user = userDetails;
  const [contactInfo, setContactInfoOpen] = useState(false);
  const [galleryModel, setGalleryModel] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const image = useRef(null);
  useEffect(() => {
    if (signUpModel) {
      document.body.style.overflow = "hidden";
    }
  }, [signUpModel]);
  useEffect(() => {
    if (isMobile || isTablet) {
      setDevice(isMobile === true && isTablet === false ? "mobile" : "tablet");
    } else {
      setDevice("desktop");
    }
    return () => {};
  }, []);
  useEffect(() => {
    setTimeout(() => {
      setHeight(window.innerHeight - image.current.height);
    }, 1000);
    return () => {};
  }, [loaded]);

  // alert(height);
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
  };
  const openGallery = () => {
    setGalleryModel(true);
    setContactInfoOpen(false);
  };
  const closeGallery = () => {
    setGalleryModel(false);
  };

  const handleModelopen = (e) => {
    dispatch(modelChange(e));
    dispatch(modelOpen());
  };

  // const switchStall = (e) => {
  //   dispatch(activeChange(e));
  //   let n = activeItem + e;
  //   if (n >= 0 || n < arrCopy.length) {
  //     router.push(`/organiser/stall-view/?name=${arrCopy[n].name}`);
  //   }
  // };

  return (
    <>
      {signUpModel && <Signup></Signup>}
      <main className="w-full h-auto overflow-hidden relative">
        {contactInfo && (
          <ContactModel handleClick={handleContactInfo}></ContactModel>
        )}
        {galleryModel && (
          <GalleryModel handleClose={closeGallery}></GalleryModel>
        )}

        <div className=" hidden scroll-icon fixed bottom-5 right-5 z-10">
          <Image
            src="/stall-view/scroll-down.svg"
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
        <section
          className={`bg-[#808080] w-full mx-auto relative md:pt-0 pb-24 md:pb-12 lg:pb-3 overflow-x-hidden lg:h-screen overflow-y-auto flex flex-col gap-[1.25rem] ${
            device === "tablet" ? "!h-auto" : ""
          }`}
          id="main-content-body"
        >
          <Image
            alt="img"
            ref={image}
            src={`${BUCKET_URL}/stall-view/background.png`}
            width={3000}
            height={3000}
            className="w-full h-auto"
            onLoad={() => setLoaded(true)}
          ></Image>

          {device === "desktop" && height > 150 ? (
            <div className=" w-[80%] h-auto mx-auto text-center flex flex-col justify-center items-center">
              {/* <div className=" flex flex-row gap-10 py-5 px-5">
              <div
                onClick={(e) => {
                  switchStall(-1);
                }}
                className={`${
                  activeItem === 0
                    ? " pointer-events-none opacity-50"
                    : " opacity-100"
                }  h-20 w-20 flex flex-col gap-1 justify-center items-center rounded-full cursor-pointer bg-black `}
              >
                <Image
                  src="/arrow-left.svg"
                  height={100}
                  width={100}
                  className=" w-3 h-auto"
                ></Image>
                <p className=" text-[9px] text-white font-bold">
                  Prev <br />
                  Stall
                </p>
              </div>
              <div
                onClick={(e) => {
                  switchStall(1);
                }}
                className={`${
                  activeItem === itemsList.length - 1
                    ? " pointer-events-none opacity-50"
                    : " opacity-100"
                }  h-20 w-20 flex flex-col gap-1 justify-center items-center rounded-full cursor-pointer bg-black `}
              >
                <Image
                  src="/arrow-right.svg"
                  height={100}
                  width={100}
                  className=" w-3 h-auto"
                ></Image>
                <p className=" text-[9px] text-white font-bold">
                  Next <br />
                  Stall
                </p>
              </div>
            </div> */}
              <p className=" font-bold text-xl font-quickSand">Title</p>
              <p className="font-semibold font-quickSand text-sm max-w-lg">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vel
                labore nisi animi rerum blanditiis totam nulla veniam
                consequuntur minima qui
              </p>
              <div className=" px-4 py-2 flex flex-row flex-wrap gap-6 justify-center mt-10 mb-28">
                <Link
                  href="/"
                  className="flex flex-col justify-center items-center cursor-pointer"
                >
                  <Image
                    alt="img"
                    width={3000}
                    height={3000}
                    className=" w-6 h-6"
                    src="/stall-view/website.svg"
                  ></Image>
                  <p className=" text-xs font-quickSand font-bold mt-[2px]">
                    Website
                  </p>
                </Link>
                <Link
                  href="/"
                  className="flex flex-col justify-center items-center cursor-pointer"
                >
                  <Image
                    alt="img"
                    width={3000}
                    height={3000}
                    className=" w-6 h-6"
                    src="/stall-view/facebook.svg"
                  ></Image>
                  <p className=" text-xs font-quickSand font-bold mt-[2px]">
                    facebook
                  </p>
                </Link>
                <Link
                  href="/"
                  className="flex flex-col justify-center items-center cursor-pointer"
                >
                  <Image
                    alt="img"
                    width={3000}
                    height={3000}
                    className=" w-6 h-6"
                    src="/stall-view/instagram.svg"
                  ></Image>
                  <p className=" text-xs font-quickSand font-bold mt-[2px]">
                    Instagram
                  </p>
                </Link>
                <Link
                  href=""
                  className="flex flex-col justify-center items-center cursor-pointer"
                >
                  <Image
                    alt="img"
                    width={3000}
                    height={3000}
                    className=" w-6 h-6"
                    src="/stall-view/twitter.svg"
                  ></Image>
                  <p className=" text-xs font-quickSand font-bold mt-[2px]">
                    Twitter
                  </p>
                </Link>
                <Link
                  href=""
                  className="flex flex-col justify-center items-center cursor-pointer"
                >
                  <Image
                    alt="img"
                    width={3000}
                    height={3000}
                    className=" w-6 h-6"
                    src="/stall-view/youtube.svg"
                  ></Image>
                  <p className=" text-xs font-quickSand font-bold mt-[2px]">
                    Youtube
                  </p>
                </Link>
                <Link
                  href=""
                  className="flex flex-col justify-center items-center cursor-pointer"
                >
                  <Image
                    alt="img"
                    width={3000}
                    height={3000}
                    className=" w-6 h-6"
                    src="/stall-view/whatsapp.svg"
                  ></Image>
                  <p className=" text-xs font-quickSand font-bold mt-[2px]">
                    Whatsapp
                  </p>
                </Link>
              </div>
            </div>
          ) : (
            ""
            // <div className=" fixed z-50 left-1/2 -translate-x-1/2 bottom-16 flex flex-row gap-10 py-5 px-5">
            //   <div
            //     onClick={(e) => {
            //       switchStall(-1);
            //     }}
            //     className={`${
            //       activeItem === 0
            //         ? " pointer-events-none opacity-50"
            //         : " opacity-100"
            //     }  h-20 w-20 flex flex-col gap-1 justify-center items-center rounded-full cursor-pointer bg-black `}
            //   >
            //     <Image
            //       src="/arrow-left.svg"
            //       height={100}
            //       width={100}
            //       className=" w-3 h-auto"
            //     ></Image>
            //     <p className=" text-[9px] text-white font-bold">
            //       Prev <br />
            //       Stall
            //     </p>
            //   </div>
            //   <div
            //     onClick={(e) => {
            //       switchStall(1);
            //     }}
            //     className={`${
            //       activeItem === itemsList.length - 1
            //         ? " pointer-events-none opacity-50"
            //         : " opacity-100"
            //     }  h-20 w-20 flex flex-col gap-1 justify-center items-center rounded-full cursor-pointer bg-black `}
            //   >
            //     <Image
            //       src="/arrow-right.svg"
            //       height={100}
            //       width={100}
            //       className=" w-3 h-auto"
            //     ></Image>
            //     <p className=" text-[9px] text-white font-bold">
            //       Next <br />
            //       Stall
            //     </p>
            //   </div>
            // </div>
          )}

          {/* For Desktop */}
          {device === "desktop" ? (
            <>
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
                      src="/stall-view/product.svg"
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
                      src="/stall-view/companyProfile.svg"
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
                      src="/stall-view/gallery.svg"
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
                      src="/stall-view/videoLeft.svg"
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
                      src="/stall-view/contact.svg"
                    ></Image>
                  </div>
                  <p className=" text-xs font-quickSand font-bold mt-1 text-center">
                    Contact Info
                  </p>
                </div>
              </div>
              <div className=" fixed z-[20] top-1/2 -translate-y-1/2 right-0 nav-wrapper right px-6 py-4 flex flex-col gap-6">
                <div className=" max-w-[45px] flex flex-col justify-center items-center cursor-pointer">
                  <div className=" w-10 h-10 p-2 bg-[#23272D] rounded-md">
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className="w-full h-auto"
                      src="/stall-view/Meeting.svg"
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
                      src="/stall-view/video.svg"
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
                      src="/stall-view/chat.svg"
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
                      src="/stall-view/product.svg"
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
                      src="/stall-view/companyProfile.svg"
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
                      src="/stall-view/gallery.svg"
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
                      src="/stall-view/videoLeft.svg"
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
                      src="/stall-view/contact.svg"
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
                      src="/stall-view/Meeting.svg"
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
                      src="/stall-view/video.svg"
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
                      src="/stall-view/chat.svg"
                    ></Image>
                  </div>
                  <p className=" text-xs font-quickSand font-bold mt-1">chat</p>
                </div>
              </div>
              {/* repeating elements for landscape */}
              <div className=" px-4 py-2 flex flex-row flex-wrap gap-6 justify-center bottomSocial">
                <Link
                  href="/"
                  className="flex flex-col justify-center items-center cursor-pointer"
                >
                  <Image
                    alt="img"
                    width={3000}
                    height={3000}
                    className=" w-6 h-6"
                    src="/stall-view/website.svg"
                  ></Image>
                  {/* <p className=" text-xs font-quickSand font-bold mt-[2px]">
                  Website
                </p> */}
                </Link>
                <Link
                  href="/"
                  className="flex flex-col justify-center items-center cursor-pointer"
                >
                  <Image
                    alt="img"
                    width={3000}
                    height={3000}
                    className=" w-6 h-6"
                    src="/stall-view/facebook.svg"
                  ></Image>
                  {/* <p className=" text-xs font-quickSand font-bold mt-[2px]">
                  facebook
                </p> */}
                </Link>
                <Link
                  href="/"
                  className="flex flex-col justify-center items-center cursor-pointer"
                >
                  <Image
                    alt="img"
                    width={3000}
                    height={3000}
                    className=" w-6 h-6"
                    src="/stall-view/instagram.svg"
                  ></Image>
                  {/* <p className=" text-xs font-quickSand font-bold mt-[2px]">
                  Instagram
                </p> */}
                </Link>
                <Link
                  href=""
                  className="flex flex-col justify-center items-center cursor-pointer"
                >
                  <Image
                    alt="img"
                    width={3000}
                    height={3000}
                    className=" w-6 h-6"
                    src="/stall-view/twitter.svg"
                  ></Image>
                  {/* <p className=" text-xs font-quickSand font-bold mt-[2px]">
                  Twitter
                </p> */}
                </Link>
                <Link
                  href=""
                  className="flex flex-col justify-center items-center cursor-pointer"
                >
                  <Image
                    alt="img"
                    width={3000}
                    height={3000}
                    className=" w-6 h-6"
                    src="/stall-view/youtube.svg"
                  ></Image>
                  {/* <p className=" text-xs font-quickSand font-bold mt-[2px]">
                  Youtube
                </p> */}
                </Link>
                <Link
                  href=""
                  className="flex flex-col justify-center items-center cursor-pointer"
                >
                  <Image
                    alt="img"
                    width={3000}
                    height={3000}
                    className=" w-6 h-6"
                    src="/stall-view/whatsapp.svg"
                  ></Image>
                  {/* <p className=" text-xs font-quickSand font-bold mt-[2px]">
                  Whatsapp
                </p> */}
                </Link>
              </div>
              <div className="hidden fixed z-[20] top-0 right-0 nav-wrapper top px-4 py-2 topNavSocial flex-row gap-6 bg-black">
                <Link
                  href=""
                  className="flex flex-col justify-center items-center cursor-pointer"
                >
                  <Image
                    alt="img"
                    width={3000}
                    height={3000}
                    className=" w-6 h-6"
                    src="/stall-view/website.svg"
                  ></Image>
                  {/* <p className=" text-xs font-quickSand font-bold mt-[2px] text-white">
                  Website
                </p> */}
                </Link>
                <Link
                  href=""
                  className="flex flex-col justify-center items-center cursor-pointer"
                >
                  <Image
                    alt="img"
                    width={3000}
                    height={3000}
                    className=" w-6 h-6"
                    src="/stall-view/facebook.svg"
                  ></Image>
                  {/* <p className=" text-xs font-quickSand font-bold mt-[2px] text-white">
                  facebook
                </p> */}
                </Link>
                <Link
                  href=""
                  className="flex flex-col justify-center items-center cursor-pointer"
                >
                  <Image
                    alt="img"
                    width={3000}
                    height={3000}
                    className=" w-6 h-6"
                    src="/stall-view/instagram.svg"
                  ></Image>
                  {/* <p className=" text-xs font-quickSand font-bold mt-[2px] text-white">
                  Instagram
                </p> */}
                </Link>
                <Link
                  href=""
                  className="flex flex-col justify-center items-center cursor-pointer"
                >
                  <Image
                    alt="img"
                    width={3000}
                    height={3000}
                    className=" w-6 h-6"
                    src="/stall-view/twitter.svg"
                  ></Image>
                  {/* <p className=" text-xs font-quickSand font-bold mt-[2px] text-white">
                  Twitter
                </p> */}
                </Link>
                <Link
                  href=""
                  className="flex flex-col justify-center items-center cursor-pointer"
                >
                  <Image
                    alt="img"
                    width={3000}
                    height={3000}
                    className=" w-6 h-6"
                    src="/stall-view/youtube.svg"
                  ></Image>
                  {/* <p className=" text-xs font-quickSand font-bold mt-[2px] text-white">
                  Youtube
                </p> */}
                </Link>
                <Link
                  href=""
                  className="flex flex-col justify-center items-center cursor-pointer"
                >
                  <Image
                    alt="img"
                    width={3000}
                    height={3000}
                    className=" w-6 h-6"
                    src="/stall-view/whatsapp.svg"
                  ></Image>
                  {/* <p className=" text-xs font-quickSand font-bold mt-[2px] text-white">
                  Whatsapp
                </p> */}
                </Link>
              </div>
              <div className=" flex justify-center items-center gap-3 rotateText">
                <Image
                  alt="img"
                  src="/rotate-screen.svg"
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
              <Link
                href=""
                className="flex flex-col justify-center items-center cursor-pointer"
              >
                <Image
                  alt="img"
                  width={3000}
                  height={3000}
                  className=" w-6 h-6"
                  src="/stall-view/website.svg"
                ></Image>
                <p className=" text-xs font-quickSand font-bold mt-[2px] text-white">
                  Website
                </p>
              </Link>
              <Link
                href=""
                className="flex flex-col justify-center items-center cursor-pointer"
              >
                <Image
                  alt="img"
                  width={3000}
                  height={3000}
                  className=" w-6 h-6"
                  src="/stall-view/facebook.svg"
                ></Image>
                <p className=" text-xs font-quickSand font-bold mt-[2px] text-white">
                  facebook
                </p>
              </Link>
              <Link
                href=""
                className="flex flex-col justify-center items-center cursor-pointer"
              >
                <Image
                  alt="img"
                  width={3000}
                  height={3000}
                  className=" w-6 h-6"
                  src="/stall-view/instagram.svg"
                ></Image>
                <p className=" text-xs font-quickSand font-bold mt-[2px] text-white">
                  Instagram
                </p>
              </Link>
              <Link
                href=""
                className="flex flex-col justify-center items-center cursor-pointer"
              >
                <Image
                  alt="img"
                  width={3000}
                  height={3000}
                  className=" w-6 h-6"
                  src="/stall-view/twitter.svg"
                ></Image>
                <p className=" text-xs font-quickSand font-bold mt-[2px] text-white">
                  Twitter
                </p>
              </Link>
              <Link
                href=""
                className="flex flex-col justify-center items-center cursor-pointer"
              >
                <Image
                  alt="img"
                  width={3000}
                  height={3000}
                  className=" w-6 h-6"
                  src="/stall-view/youtube.svg"
                ></Image>
                <p className=" text-xs font-quickSand font-bold mt-[2px] text-white">
                  Youtube
                </p>
              </Link>
              <Link
                href=""
                className="flex flex-col justify-center items-center cursor-pointer"
              >
                <Image
                  alt="img"
                  width={3000}
                  height={3000}
                  className=" w-6 h-6"
                  src="/stall-view/whatsapp.svg"
                ></Image>
                <p className=" text-xs font-quickSand font-bold mt-[2px] text-white">
                  Whatsapp
                </p>
              </Link>
            </div>
          ) : (
            ""
          )}

          {/* Like Area */}
          {device === "desktop" ? (
            <div
              onMouseDown={mousedown}
              onMouseUp={mouseup}
              className="fixed z-[200] bottom-14 right-16 iconwrap max-w-[105px] flex justify-center items-center flex-col"
            >
              <div className="relative">
                <Image
                  alt="img"
                  ref={icon}
                  src="/stall-view/care-emoji-for-mobile.svg"
                  className=" w-16 h-16 cursor-pointer relative z-30"
                  width={3000}
                  height={3000}
                  draggable="false"
                ></Image>
                <Image
                  alt="img"
                  src="/stall-view/like.svg"
                  width={3000}
                  height={3000}
                  onMouseEnter={handlemouseover}
                  ref={likeButton}
                  className="w-7 h-7 absolute z-40 -left-3 -top-3 hidden"
                ></Image>
                <Image
                  alt="img"
                  src="/stall-view/dislike.svg"
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
          )}
        </section>
      </main>
    </>
  );
};

export default Page;
