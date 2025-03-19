import React from "react";
import Image from "next/image";
import { BUCKET_URL } from "@/config/constant";

const List = ({ data, active, listId, device, onclick }) => {
  return (
    <div
      onClick={() => onclick(data)}
      className={`${active === listId ? "bg-brand-color" : ""} cursor-pointer`}
    >
      <div
        className={`ml-5 ${
          device === "mobile" ? "mr-5" : "mr-4"
        } py-2 border-b border-static-black flex flex-row gap-2 relative`}
      >
        <div className="absolute right-0 top-2">
          {data.unread > 0 ? (
            <div className="w-5 aspect-square h-5 bg-brand-color rounded-full flex justify-center items-center">
              <p className="font-lato text-xs font-bold">
                {data.unread > 9 ? "9+" : data.unread}
              </p>
            </div>
          ) : (
            <Image
              alt="chat"
              src={`${BUCKET_URL}/chat/arrow.svg`}
              width={12}
              height={12}
              className="h-3 w-auto"
            />
          )}
        </div>
        <Image
          alt="chat"
          src={`${BUCKET_URL}/chat/chat-profile.svg`}
          width={40}
          height={40}
          className="w-10 aspect-square h-auto rounded-full"
        />
        <div className="w-full">
          <h2 className="font-lato text-base font-bold">
            {data.companyName && data.companyName.length > 24
              ? data.companyName.substring(0, 24) + "..."
              : data.companyName}
          </h2>
          <span
            style={{
              position: "absolute",
              fontSize: 11,
              marginTop: "-8px",
              right: "-5px",
              fontStyle: "italic",
            }}
          >
            ({data.name})
          </span>
          <div className="w-full flex justify-between items-center">
            <p className="font-lato text-[10px] font-normal">
              {data.lastMessage && data.lastMessage.length > 15
                ? data.lastMessage.substring(0, 15) + "..."
                : data.lastMessage}
            </p>
            <p className="font-lato text-xs font-normal">{data.lastSent}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
