"use client";
import React, { useState, useEffect, useRef } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "./Chatview.css";
import List from "./list";
import { io } from "socket.io-client";
import { BASE_URL, SOCKET_HOST } from "@/config/constant";
import { isMobile, isTablet, isDesktop } from "react-device-detect";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useQuery } from "@tanstack/react-query";
import { request } from "@/lib/axios";
import ChatContainer from "./ChatContainer";
import Welcome from "./Welcome";
import axios from "axios";
import ExhibitorChatContainer from "./ExhibitorChatContainer";

const Chatview = ({ handleClose, exhibitorId }) => {
  const visitorId =
    typeof window !== "undefined" ? sessionStorage.getItem("id") : null;
  const socket = useRef();

  const [activeList, setActiveList] = useState(0);
  const [device, setDevice] = useState("mobile");
  const [screen, setScreen] = useState("list");
  const [name, setName] = useState("Exhibitors");

  const [displaydata, setData] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [listNumber, setListNumber] = useState(0);

  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentExhibitorChat, setCurrentExhibitorChat] = useState(undefined);

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

  // const fetchChatUser = async () => {
  //   return request({
  //     url: `messages/getChatUser/${visitorId}`,
  //     method: "get",
  //   });
  // };

  // const { data: chatUsers, refetch: refetchVisitor } = useQuery({
  //   queryKey: ["getChatUserList"],
  //   queryFn: fetchChatUser,
  // });

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

  useEffect(() => {
    if (visitorId) setCurrentUser(visitorId);
  }, []);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(SOCKET_HOST);
      socket.current.emit("add-user", currentUser);
    }
  }, [currentUser]);

  const handleListClick = (e) => {
    setActiveList(e);
  };

  const handleListClickMobile = (value) => {
    setActiveList(value._id);
    const fullName = `${value.companyName}(${value.name} )`;
    setDisplayName(fullName);
    setScreen("message");
    setCurrentChat(value);
    markMessagesAsRead(currentUser, value._id);
  };

  const handleListClickExhibitor = (value) => {
    setActiveList(value._id);
    const fullName = `${value.companyName}(${value.name} )`;
    setDisplayName(fullName);
    setScreen("message");
    setCurrentExhibitorChat(value);
    markMessagesAsReadExhibitor(currentUser, value._id);
  };

  const handleTabChange = (e, value) => {
    setName(value);
    setDisplayName("");
  };

  const handleSendMsg = async (currentChat) => {
    const chatExist = await axios.post(
      `${BASE_URL}messages/checkChatUserExist`,
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
      await axios.post(`${BASE_URL}messages/addmsg`, {
        from: currentUser,
        to: currentChat._id,
        message: "Hello",
      });
      refetchVisitor(); // Refetch visitor data after sending message
    }
  };

  const handleSendExhibitorMsg = async (currentChat) => {
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
      // refetchExhibitor(); // Refetch Exhibitor data after sending message
    }
  };

  const markMessagesAsRead = async (from, to) => {
    await axios.post(`${BASE_URL}messages/markMessagesAsRead`, { from, to });
    refetchVisitor();
  };
  const markMessagesAsReadExhibitor = async (from, to) => {
    await axios.post(`${BASE_URL}exhibitor-messages/markMessagesAsRead`, {
      from,
      to,
    });
    // refetchExhibitor();
  };

  return (
    <div
      className={` ${isMobile && "w-full h-full"} ${
        isDesktop && "w-[100%] h-[90%] max-h-[710px] rounded-2xl"
      } fixed max-w-6xl bg-white m-auto flex flex-row z-[1000]`}
    >
      {isDesktop && (
        <>
          <div className="w-full max-w-[25%] min-w-[295px] border-r h-full">
            <Tabs selectedIndex={listNumber} className="flex flex-col">
              <TabList className="w-full font-lato text-base font-medium">
                <div className="border-b ml-5 pr-4 flex flex-row justify-between gap-2 pb-1 h-12">
                  <Tab
                    onClick={(e) => {
                      setActiveList(0);
                      setListNumber(0);
                      handleTabChange(e, "Exhibitors");
                    }}
                    className="px-3 rounded-full cursor-pointer h-10 flex justify-center items-center"
                  >
                    Exhibitors
                  </Tab>
                  {/* <Tab
                    onClick={(e) => {
                      setActiveList(0);
                      setListNumber(1);
                      handleTabChange(e, "Visitors");
                    }}
                    className="px-3 rounded-full cursor-pointer h-10 flex justify-center items-center"
                  >
                    Visitors
                  </Tab> */}
                </div>
              </TabList>
              <TabPanel>
                {exhibitorData && (
                  <Autocomplete
                    disablePortal
                    options={exhibitorData}
                    sx={{ width: 295 }}
                    getOptionLabel={(option) =>
                      `${option.companyName} (${option.name} )`
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Search Exhibitor" />
                    )}
                    style={{ paddingTop: 10 }}
                    onChange={(event, newValue) => {
                      handleSendExhibitorMsg(newValue);
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
                    ></List>
                  ))}
              </TabPanel>
            </Tabs>
          </div>
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
        </>
      )}
    </div>
  );
};

export default Chatview;
