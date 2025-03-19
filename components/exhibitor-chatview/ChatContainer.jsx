import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { isDesktop } from "react-device-detect";
import axios from "axios";
import { BASE_URL, BUCKET_URL } from "@/config/constant";
import { v4 as uuidv4 } from "uuid";
import { io } from "socket.io-client";

const ChatContainer = ({
  displayName,
  displaydata,
  handleClose,
  currentChat,
  socket,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const visitorId = localStorage.getItem("id");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${BASE_URL}exhibitor-messages/getmsg`,
          {
            from: visitorId,
            to: currentChat._id,
          }
        );
        setMessages(response.data);
      } catch (error) {
        // Handle error
      }
    };

    fetchData();

    return () => {
      // Cleanup code if needed
    };
  }, [currentChat, visitorId]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, [messages]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMsg = async (msg) => {
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: visitorId,
      msg,
    });
    await axios.post(`${BASE_URL}exhibitor-messages/addmsg`, {
      from: visitorId,
      to: currentChat._id,
      message: msg,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMsg(inputValue);
      setInputValue("");
    }
  };

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };
  const handleClick = () => {
    handleSendMsg(inputValue);
    setInputValue("");
  };
  return (
    <div className="w-full max-w-[75%] h-full flex flex-col">
      <div className="pl-5 mr-5 min-h-[48px] flex items-center justify-between border-b">
        <h1 className="text-xl font-bold font-lato">
          {displayName !== "Groups" ? `Chat With ${displayName}` : displayName}
        </h1>
        <div
          className="bg-brand-color w-8 aspect-square h-auto rounded-full flex justify-center items-center cursor-pointer"
          onClick={handleClose}
        >
          <Image
            src={`${BUCKET_URL}/chat/close.svg`}
            width={3000}
            height={3000}
            className="w-4 aspect-square h-auto"
          />
        </div>
      </div>
      <div className="pt-3 px-4 mb-5 h-full overflow-auto flex flex-col justify-start items-start gap-[10px]">
        <div className="w-full">
          <p className="text-center font-semibold font-quickSand text-xs text-[#5E6672]">
            Monday • 21-02-23
          </p>
        </div>
        {messages &&
          messages.map((message, index) => (
            <div
              className={message.fromSelf ? "max-w-sm ml-auto" : "max-w-sm"}
              key={index}
              ref={index === messages.length - 1 ? scrollRef : null}
            >
              {message.fromSelf ? (
                <div className="max-w-sm ml-auto">
                  <p className="bg-white border border-static-black rounded-2xl px-4 py-2 text-base text-black font-semibold overflow-hidden">
                    {message.message}
                    <span className="font-medium font-quickSand text-[10px] float-right align-bottom ml-2 leading-[10px] mt-3">
                      {/* {time} */}
                    </span>
                  </p>
                </div>
              ) : (
                <div className="max-w-sm">
                  <p className="bg-brand-color rounded-2xl px-4 py-2 text-base text-black font-semibold overflow-hidden">
                    {message.message}
                    <span className="font-medium font-quickSand text-[10px] float-right align-bottom ml-2 leading-[10px] mt-3">
                      {/* {time} */}
                    </span>
                  </p>
                </div>
              )}
            </div>
          ))}
      </div>
      <div className="flex flex-row gap-2 justify-between items-center ml-1 mr-5">
        <div className="bg-black rounded-full h-9 flex flex-row w-full overflow-hidden">
          <input
            type="text"
            name="input"
            id="type1"
            placeholder="Type your message…"
            className="h-full w-full font-quickSand text-sm bg-black text-white placeholder:text-white font-normal px-4 bg-transparent focus:outline-none"
            value={inputValue}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            autoComplete="off"
          />
          {/* <input type="file" id="fileMobile" className="hidden" />
          <label
            className="flex justify-center items-center cursor-pointer aspect-square pr-4"
            htmlFor="fileMobile"
          >
            <Image
              onClick={handleKeyPress}
              src="/chat/attachment.svg"
              width={3000}
              height={3000}
              className="h-5 w-auto"
            />
          </label> */}
        </div>
        <Image
          onClick={handleClick}
          src={`${BUCKET_URL}/chat/send.svg`}
          width={3000}
          height={3000}
          className="w-8 aspect-square h-auto cursor-pointer"
        />
      </div>
    </div>
  );
};

export default ChatContainer;
