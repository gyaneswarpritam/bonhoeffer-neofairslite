import { BUCKET_URL } from "@/config/constant";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { isMobile, isTablet } from "react-device-detect";

const LiteStall = () => {
  const [device, setDevice] = useState(null);
  const image = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [height, setHeight] = useState(null);

  return (
    <main className="w-full h-auto overflow-hidden relative">
      {/* <div className=" hidden scroll-icon fixed bottom-5 right-5 z-10">
        <Image
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
      <section
        className={`bg-[#808080] w-full mx-auto relative md:pt-0  md:pb-12 lg:pb-3 overflow-x-hidden lg:h-screen overflow-y-auto flex flex-col gap-[1.25rem] ${device === "tablet" ? "!h-auto" : ""
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
          unoptimized
        ></Image>
      </section>
    </main>
  );
};

export default LiteStall;
