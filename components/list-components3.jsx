import { BUCKET_URL } from "@/config/constant";
import Image from "next/image";
import React from "react";

export default function ListComponents3(props) {
  const event = props.event;

  const n = Number(event.stallStatus);

  const color = n >= 80 ? "#C8FB51" : n < 80 && n >= 40 ? "#FBE751" : "#FB5151";

  return (
    <div className="md:bg-white bg-bg-grey my-3 flex flex-row items-stretch justify-between md:px-4 pl-2 md:py-2 rounded-lg">
      <div className="md:w-[50%] md:order-1 order-2 w-[40%] flex flex-row items-center font-quickSand text-sm font-bold text-black">
        <Image
          alt="date-event"
          width={35}
          height={35}
          src={`${BUCKET_URL}/date-event.svg`}
          className="mr-2 hidden md:block"
        />
        {event.name}
      </div>
      <div className="md:min-w-[20%] md:order-2 order-1 mr-5 flex flex-row items-center justify-center rounded-lg">
        <div
          style={{
            borderColor: color,
          }}
          className="font-lato font-bold text-sm p-0 m-0 md:h-full h-12 aspect-square border-4 rounded-full flex flex-row justify-center items-center"
        >
          {event.stallStatus}%
        </div>
      </div>
      <div className="md:w-[30%] md:order-3 order-3 w-[40%] md:h-12 h-14 flex flex-row items-center justify-center rounded-lg  bg-brand-color  text-black font-bold font-quickSand text-base cursor-pointer">
        View Event
      </div>
    </div>
  );
}
