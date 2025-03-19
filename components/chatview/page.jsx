"use client";
import React, { useState, useEffect, useRef } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "./Chatview.css";
import List from "./list";
import { io } from "socket.io-client";
import { BASE_URL, BUCKET_URL, SOCKET_HOST } from "@/config/constant";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useQuery } from "@tanstack/react-query";
import { request } from "@/lib/axios";
import Welcome from "./Welcome";
import axios from "axios";
import ExhibitorChatContainer from "./ExhibitorChatContainer";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Image from "next/image";

const Chatview = ({ handleClose, exhibitorId }) => {
  const visitorId =
    typeof window !== "undefined" ? localStorage.getItem("id") : null;
  const socket = useRef();

  const [activeList, setActiveList] = useState(0);
  const [screen, setScreen] = useState("list");
  const [name, setName] = useState("Exhibitors");
  const [displaydata, setData] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [listNumber, setListNumber] = useState(0);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentExhibitorChat, setCurrentExhibitorChat] = useState(undefined);
  const [isMobileView, setIsMobileView] = useState(false);

  const fetchExhibitor = async () => {
    return request({
      url: `visitor/exhibitorChatList/${exhibitorId}`,
      method: "get",
    });
  };

  const { data: exhibitorData } = useQuery({
    queryKey: ["exhibitorList"],
    queryFn: fetchExhibitor,
  });

  const fetchChatExhibitor = async () => {
    return request({
      url: `exhibitor-messages/getChatUser/${visitorId}`,
      method: "get",
    });
  };

  const { data: chatExhibitor } = useQuery({
    queryKey: ["getChatExhibitorList"],
    queryFn: fetchChatExhibitor,
    refetchInterval: 5000,
  });

  const fetchVisitor = async () => {
    return request({
      url: `visitor/visitorChatList/${exhibitorId}`,
      method: "get",
    });
  };

  const { data: visitorData, refetch: refetchVisitor } = useQuery({
    queryKey: ["visitorList"],
    queryFn: fetchVisitor,
  });

  useEffect(() => {
    if (visitorId) setCurrentUser(visitorId);
  }, []);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(SOCKET_HOST);
      socket.current.emit("add-user", currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleListClickExhibitor = (value) => {
    setActiveList(value._id);
    const fullName = `${value.companyName}(${value.name})`;
    setDisplayName(fullName);
    setScreen("message");
    setCurrentExhibitorChat(value);
  };

  const handleSendMsg = async (currentChat) => {
    const chatExist = await axios.post(
      `${BASE_URL}exhibitor-messages/checkChatUserExist`,
      {
        from: currentUser,
        to: currentChat._id,
      }
    );
    if (chatExist.data.status === 0) {
      socket.current.emit("send-msg", {
        to: currentChat._id,
        from: currentUser,
        msg: "Hello",
      });
      await axios.post(`${BASE_URL}exhibitor-messages/addmsg`, {
        from: currentUser,
        to: currentChat._id,
        message: "Hello",
      });
      refetchVisitor(); // Refetch visitor list to update lastMessage
    }
  };

  return (
    <div
      className="fixed max-w-6xl bg-white m-auto flex flex-row z-[1000] w-full h-full md:w-[100%] md:h-[90%] md:max-h-[710px] md:rounded-2xl"
    >
      {/* List Section */}
      <div
        className={`h-full border-r ${isMobileView ? (screen === "list" ? "w-full" : "hidden") : "w-[25%] min-w-[295px]"
          }`}
      >
        <Tabs selectedIndex={listNumber} className="flex flex-col">
          <TabList className="w-full font-lato text-base font-medium">
            <div className="border-b ml-5 pr-4 flex flex-row justify-between gap-2 pb-1 h-12">
              <Tab
                onClick={() => {
                  setActiveList(0);
                  setListNumber(0);
                  setName("Exhibitors");
                  setDisplayName("");
                }}
                className="px-3 rounded-full cursor-pointer h-10 flex justify-center items-center"
              >
                Exhibitors
              </Tab>
              {isMobileView ?
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
                </div> : <></>}
            </div>
          </TabList>
          <TabPanel>
            {exhibitorData && (
              <Autocomplete
                disablePortal
                options={exhibitorData}

                getOptionLabel={(option) =>
                  `${option.companyName} (${option.name})`
                }
                renderInput={(params) => (
                  <TextField {...params} label="Search Exhibitor" />
                )}
                style={{ paddingTop: 10 }}
                onChange={(event, newValue) => {
                  handleSendMsg(newValue);
                }}
              />
            )}
            {chatExhibitor &&
              chatExhibitor.map((item) => (
                <List
                  key={item._id}
                  data={item}
                  listId={item._id}
                  active={activeList}
                  onclick={handleListClickExhibitor}
                />
              ))}
          </TabPanel>
        </Tabs>
      </div>

      {/* Chat Section */}
      <div
        className={`h-full flex flex-col ${isMobileView ? (screen === "message" ? "w-full" : "hidden") : "w-[75%]"
          }`}
      >
        {isMobileView && screen === "message" ? (
          <div className="flex border-b">
            <div
              className="flex items-center p-3 bg-gray-100 cursor-pointer"
              onClick={() => setScreen("list")}
            >
              <ArrowBackIcon />
              <span className="ml-2">Back</span>
            </div>
            <div className="pl-5 mr-5 min-h-[48px] flex items-center justify-between ">
              <h1 className="text-sm font-bold font-lato">
                {displayName !== "Groups" ? (displayName === "" ? "" : `Chat With ${displayName}`) : displayName}
              </h1>
            </div>
          </div>

        ) :
          <div className="pl-5 mr-5 min-h-[48px] flex items-center justify-between border-b">
            <h1 className="text-xl font-bold font-lato">
              {displayName !== "Groups" ? (displayName === "" ? "" : `Chat With ${displayName}`) : displayName}
            </h1>
          </div>
        }

        {displayName === "" && <Welcome handleClose={handleClose} />}
        {displayName && name === "Exhibitors" && (
          <ExhibitorChatContainer
            displayName={displayName}
            displaydata={displaydata}
            currentChat={currentExhibitorChat}
            socket={socket}
            handleClose={handleClose}
          />
        )}
      </div>
    </div>
  );
};

export default Chatview;
