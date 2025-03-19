import { BUCKET_URL } from "@/config/constant";
import Image from "next/image";
import React from "react";

export default function ListComponents2(props) {
  const event = props.event;

  return (
    <div
      className={
        event.ended
          ? `bg-grey-out flex flex-row items-stretch justify-between px-4 py-3 rounded-lg pointer-events-none`
          : `bg-white flex flex-row items-stretch justify-between px-4 py-3 rounded-lg cursor-pointer md:hover:drop-shadow-md transition-all border-[1px] md:border-0`
      }
    >
      <div
        className={
          event.ended
            ? "flex flex-row items-center font-quickSand text-sm font-bold text-accent-font-color"
            : "flex flex-row items-center font-quickSand text-sm font-bold text-black"
        }
      >
        <Image
          alt="date-event"
          width={25}
          height={25}
          src={`${BUCKET_URL}/date-event-1.svg`}
          className="mr-3"
          style={{ opacity: event.ended ? 0.5 : 1 }}
        />
        {event.name}
      </div>
    </div>
  );
}
