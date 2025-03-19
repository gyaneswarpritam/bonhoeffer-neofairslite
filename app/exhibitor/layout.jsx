"use client";
import "../globals.css";
import { useEffect, useState } from "react";
import ExhibitorChatModal from "@/components/ExhibitorChatModal";
import { useSelector } from "react-redux";
import SideNav from "@/components/exibitor/side-nav";
import BlackFooter from "@/components/exibitor/blackFooter";
import { useRouter } from "next/navigation";
import { request } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import moment from "moment-timezone";
import MessageModel from "@/components/messageModel";

export default function RootLayout({ children }) {
  const router = useRouter();
  const [exhibitorId, setExhibitorId] = useState(null);
  const [name, setName] = useState(null);
  const [chatView, setChatView] = useState(false);
  const { showNavbar } = useSelector((state) => state.commonStore);
  const [currentMenu, setCurrentMenu] = useState(true);
  const [messageModelOpen, setMessageModelOpen] = useState(false);
  const [messageBody, setMessageBody] = useState(false);

  const handleCloseMessage = () => {
    setMessageModelOpen(false);
  };

  const getTodayDate = () => {
    const today = new Date();
    return (
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate()).padStart(2, "0")
    );
  };

  const fetchbookedSlots = async () => {
    const todayDate = getTodayDate();
    return await request({
      url: `exhibitor/list-booked-slots?exhibitorId=${exhibitorId}&date=${todayDate}`,
      method: "get",
    });
  };
  const { data: bookedSlots } = useQuery({
    queryKey: ["bookedSlots"],
    queryFn: fetchbookedSlots,
  });

  useEffect(() => {
    // Ensure localStorage is accessed only on the client
    const storedExhibitorId = localStorage.getItem("id");
    const storedName = localStorage.getItem("name");
    const role = localStorage.getItem("role");

    if (role == "visitor") {
      router.push("/visitor");
    } else if (role == "admin") {
      router.push("/admin");
    } else if (role == "exhibitor") {
      setExhibitorId(storedExhibitorId);
      setName(storedName);
    }

    if (!storedExhibitorId) {
      router.push("/exhibitor-login");
    }
  }, []);

  const user = {
    name: name || "",
    role: "Exhibitor",
  };

  const handleChatView = () => setChatView(true);
  const handleClose = () => setChatView(false);
  const toggleMenu = () => setCurrentMenu(!currentMenu);

  useEffect(() => {
    checkForUpcomingMeetings();
  }, [bookedSlots]);

  const checkForUpcomingMeetings = () => {
    if (bookedSlots && bookedSlots.length) {
      const notifiedMeetings = {}; // Track notifications for each slot

      const intervalId = setInterval(() => {
        const now = new Date();

        bookedSlots.forEach((slot) => {
          // Combine Date and Time fields from the slot and parse the timezone
          const meetingDateTime = `${slot.Date} ${slot.Time.replace(
            " PM",
            "PM"
          ).replace(" AM", "AM")}`;
          const meetingTime = moment
            .tz(meetingDateTime, "YYYY-MM-DD hh:mm A", slot.Timezone)
            .toDate();

          const timeDiff = meetingTime - now;
          const minutesLeft = Math.floor(timeDiff / (1000 * 60)); // Convert to minutes

          if (timeDiff > 0 && slot.Status === "booked") {
            // Initialize tracking if not already present
            if (!notifiedMeetings[slot.SerialNo]) {
              notifiedMeetings[slot.SerialNo] = {
                notifiedAt60: false,
                notifiedAt30: false,
                notifiedAt0: false,
              };
            }

            // Notify at 60 minutes if not already notified
            if (minutesLeft <= 60 && minutesLeft > 30 && !notifiedMeetings[slot.SerialNo].notifiedAt60) {
              sendNotification(slot, minutesLeft);
              notifiedMeetings[slot.SerialNo].notifiedAt60 = true;
            }

            // Notify at 30 minutes if not already notified
            if (minutesLeft <= 30 && minutesLeft > 0 && !notifiedMeetings[slot.SerialNo].notifiedAt30) {
              sendNotification(slot, minutesLeft);
              notifiedMeetings[slot.SerialNo].notifiedAt30 = true;
            }

            // Notify at 0 minutes if not already notified
            if (minutesLeft <= 0 && !notifiedMeetings[slot.SerialNo].notifiedAt0) {
              sendNotification(slot, minutesLeft);
              notifiedMeetings[slot.SerialNo].notifiedAt0 = true;
            }
          }
        });

        // Check if all notifications have been sent for all slots, then clear interval
        const allNotified = bookedSlots.every(
          (slot) =>
            notifiedMeetings[slot.SerialNo]?.notifiedAt60 &&
            notifiedMeetings[slot.SerialNo]?.notifiedAt30 &&
            notifiedMeetings[slot.SerialNo]?.notifiedAt0
        );

        if (allNotified) {
          clearInterval(intervalId);
        }
      }, 60 * 1000); // Check every minute
    }
  };

  // Helper function to send notifications
  const sendNotification = (slot, minutesLeft) => {
    setMessageModelOpen(true);
    setMessageBody(`Meeting starts in ${minutesLeft} minutes, please be available.`);
    sendEmailMeetingNotifyVisitorUtil({
      visitorId: slot?.VisitorId,
      exhibitorId: exhibitorId,
      slotDetails: slot,
      minutesLeft,
    });
  };

  // Prevent rendering until exhibitorId is fetched
  if (exhibitorId === null) {
    return null; // Or a loading spinner
  }

  return (
    <main>
      {messageModelOpen ? (
        <MessageModel
          handleClose={handleCloseMessage}
          messageHeader={`Meeting Notification`}
          messageBody={messageBody}
        />
      ) : (
        ""
      )}
      {showNavbar ? (
        <main className="custom-color-bg">
          <div className="mx-auto max-w-[1439px] container md:flex md:flex-row md:items-stretch md:justify-between overflow-hidden">
            {currentMenu && (
              <section
                className="bg-bg-grey lg:w-[20%] md:min-h-screen px-2 lg:px-2 w-[0] side-bar-navi"
                id="side-bar"
              >
                <SideNav userDetails={user} handleChatView={handleChatView} />
              </section>
            )}
            <div
              className={`bg-white ${currentMenu ? "lg:w-[80%]" : "lg:w-[100%]"} w-full lg:py-4 lg:px-4 px-2 py-2`}
            >
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
                onClick={toggleMenu}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
              {children}
            </div>
          </div>
        </main>
      ) : (
        <>{children}</>
      )}

      <BlackFooter />
      {chatView && <ExhibitorChatModal handleClose={handleClose} />}
    </main>
  );
}
