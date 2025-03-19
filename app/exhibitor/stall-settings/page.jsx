"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import StallHomeElement from "./stallHomeElement";
import Tabs from "./tabs";
import "./stallSetting.css";
import { toggleNavbar } from "@/GlobalRedux/features/common/commonSlice";
import { useDispatch } from "react-redux";
import LocationBand from "@/components/exibitor/locationBand";
import { BUCKET_URL } from "@/config/constant";

function Page() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(toggleNavbar(true));
  }, []);
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty(
      "--unlock-url",
      `url("${BUCKET_URL}/stalls/unlock.svg")`
    );
    root.style.setProperty(
      "--lock-url",
      `url("${BUCKET_URL}/stalls/lock.svg")`
    );
  }, []);
  const [displayElement, setDisplayElement] = useState("");

  const click = (e) => {
    setDisplayElement("tabs");
  };
  // const campaign = (e) => {
  //   setDisplayElement("Campaign");
  // };
  return (
    <section
      className="lg:pl-3 lg:pr-5 lg:py-5 bg-white no-scrollbar w-full relative pt-16  px-3 lg:min-h-screen  flex flex-col gap-[1.25rem]"
      id="main-content-body"
    >
      <LocationBand />
      <div className="flex md:flex-row flex-col-reverse gap-5">
        {displayElement && displayElement === "tabs" ? (
          <Tabs />
        ) : (
          <StallHomeElement onButtonClick={click} />
        )}
        {/* <RightComponent /> */}
      </div>
    </section>
  );
}

export default Page;
