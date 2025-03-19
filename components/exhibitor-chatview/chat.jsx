import React from "react";

const Chat = ({ text, type, time }) => {
  return type == "sent" ? (
    // <div className="bg-white border rounded-2xl px-4 py-2 border-static-black flex gap-2 items-end max-w-[95%] ml-auto">
    //   <p className=" text-base text-black font-semibold">{text}</p>
    //   <p className=" font-medium font-quickSand text-[10px]">11:54 PM</p>
    // </div>
    <div className=" max-w-sm  ml-auto">
      <p className=" bg-white border border-static-black rounded-2xl px-4 py-2 text-base text-black font-semibold overflow-hidden">
        {text}
        <span className=" font-medium font-quickSand text-[10px] float-right align-bottom ml-2  leading-[10px] mt-3">
          {time}
        </span>
      </p>
    </div>
  ) : (
    <div className=" max-w-sm">
      <p className=" bg-brand-color rounded-2xl px-4 py-2 text-base text-black font-semibold overflow-hidden">
        {text}
        <span className=" font-medium font-quickSand text-[10px] float-right align-bottom ml-2  leading-[10px] mt-3">
          {time}
        </span>
      </p>
    </div>
  );
};

export default Chat;
