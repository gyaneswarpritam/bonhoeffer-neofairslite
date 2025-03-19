// Chatview.js
"use client";
import React, { useState, useEffect, useRef } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "./Chatview.css";
import List from "./List";
import { io } from "socket.io-client";
import { BASE_URL, SOCKET_HOST } from "@/config/constant";
import { isMobile, isDesktop } from "react-device-detect";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useQuery } from "@tanstack/react-query";
import { request } from "@/lib/axios";
import ChatContainer from "./ChatContainer";
import Welcome from "./Welcome";
import axios from "axios";

const Chatview = ({ handleClose }) => {
  const exhibitorId =
    typeof window !== "undefined" ? sessionStorage.getItem("id") : null;
  const socket = useRef();

  const [activeList, setActiveList] = useState(0);
  const [screen, setScreen] = useState("list");
  const [name, setName] = useState("Visitors");
  const [displayName, setDisplayName] = useState("");
  const [listNumber, setListNumber] = useState(0);

  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);

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

  const fetchChatUser = async () => {
    return request({
      url: `exhibitor-messages/getChatVisitors/${exhibitorId}`,
      method: "get",
    });
  };

  const { data: chatUsers, refetch: refetchChatUsers } = useQuery({
    queryKey: ["getChatUserList"],
    queryFn: fetchChatUser,
    refetchInterval: 2000,
  });

  useEffect(() => {
    if (exhibitorId) setCurrentUser(exhibitorId);
  }, []);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(SOCKET_HOST);
      socket.current.emit("add-user", currentUser);

      socket.current.on("msg-receive", () => {
        refetchVisitor(); // Refetch visitor list on message receive
        refetchChatUsers(); // Refetch chat users on message receive
      });
    }
  }, [currentUser]);

  const handleListClickMobile = (value) => {
    setActiveList(value._id);
    const fullName = `${value.companyName}(${value.name} )`;
    setDisplayName(fullName);
    setScreen("message");
    setCurrentChat(value);
    markMessagesAsReadExhibitor(currentUser, value._id);
  };

  const handleTabChange = (e, value) => {
    setName(value);
    setDisplayName("");
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

  const markMessagesAsReadExhibitor = async (from, to) => {
    await axios.post(`${BASE_URL}exhibitor-messages/markMessagesAsRead`, {
      from,
      to,
    });
    refetchVisitor(); // Update unread count after marking messages as read
  };

  return (
    <div
      className={` ${isMobile && "w-full h-full"} ${
        isDesktop && "w-[100%] h-[90%] max-h-[710px] rounded-2xl"
      } fixed max-w-6xl bg-white m-auto flex flex-row z-[1000]`}
    >
      {isDesktop && (
        <>
          <div className=" w-full max-w-[25%] min-w-[295px] border-r h-full ">
            <Tabs selectedIndex={listNumber} className="flex flex-col">
              <TabList className=" w-full font-lato text-base font-medium">
                <div className=" border-b ml-5 pr-4 flex flex-row justify-between gap-2 pb-1 h-12">
                  <Tab
                    onClick={(e) => {
                      setActiveList(0);
                      setListNumber(0);
                      handleTabChange(e, "Visitors");
                    }}
                    className="px-3 rounded-full cursor-pointer h-10 flex justify-center items-center"
                    style={{ backgroundColor: "#c8fb51" }}
                  >
                    Visitors
                  </Tab>
                </div>
              </TabList>
              <TabPanel>
                {visitorData && (
                  <Autocomplete
                    disablePortal
                    options={visitorData}
                    sx={{ width: 295 }}
                    getOptionLabel={(option) =>
                      `${option.companyName} (${option.name} )`
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Search Visitor" />
                    )}
                    style={{ paddingTop: 10 }}
                    onChange={(event, newValue) => {
                      handleSendMsg(newValue);
                    }}
                  />
                )}

                {chatUsers &&
                  chatUsers.map((item) => (
                    <List
                      key={item._id}
                      data={item}
                      listId={item._id}
                      active={activeList}
                      onclick={handleListClickMobile}
                    />
                  ))}
              </TabPanel>
            </Tabs>
          </div>
          {displayName === "" && <Welcome handleClose={handleClose} />}
          {displayName && name === "Visitors" && (
            <ChatContainer
              displayName={displayName}
              currentChat={currentChat}
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
