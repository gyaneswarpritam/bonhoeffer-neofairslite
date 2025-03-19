"use client";
import React, { useEffect, useRef, useState } from "react";
import { request } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { trackUtil } from "@/lib/track";
import { dayjsShortFormat } from "@/lib/dayjs";
import CommonDataTableView from "../grid/CommonDataTableView";

export default function NotificationComponent({ showHeader = true }) {
  const gridRef = useRef();
  const exhibitorId =
    typeof window !== "undefined" ? localStorage.getItem("id") : null;
  const [processedNotifications, setProcessedNotifications] = useState([]);
  // Function to fetch notifications
  const fetchNotification = async () => {
    return request({
      url: `exhibitor/notification-all/${exhibitorId}`,
      method: "get",
    });
  };

  // Function to mark all notifications as read
  const markAllNotificationsAsRead = async () => {
    return request({
      url: `exhibitor/notification/${exhibitorId}`,
      method: "put",
    });
  };

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotification,
  });

  useEffect(() => {
    trackUtil({
      trackEventType: "Notifications",
    });

    // Mark all notifications as read when the component loads
    if (exhibitorId) {
      markAllNotificationsAsRead().catch((error) => {
        console.error("Error marking notifications as read:", error);
      });
    }
  }, [exhibitorId]);

  useEffect(() => {
    if (notifications) {
      const transformedNotifications = notifications.map((item) => ({
        ...item,
        visitorName: item.visitor?.name || "",
        visitorCompany: item.visitor?.companyName || "",
        visitorEmail: item.visitor?.email || "",
        visitorPhone: item.visitor?.phone || "",
      }));
      console.log(
        transformedNotifications,
        `transformedNotifications&&&&&&&&&&&777`
      );
      setProcessedNotifications(transformedNotifications);
    }
  }, [notifications]);

  const noficationColumnDef = [
    {
      headerName: "Notification Type",
      field: "notificationType",
      width: 200,
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: "Meeting Date",
      field: "createdAt",
      width: 250,
      flex: 1,
      minWidth: 250,
      valueFormatter: (params) => (params ? dayjsShortFormat(params) : ""),
    },
    {
      headerName: "Visitor Name",
      field: "visitorName", // Access the name directly
      width: 200,
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: "Company Name",
      field: "visitorCompany",
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: "Email",
      field: "visitorEmail",
      width: 250,
      flex: 2,
      minWidth: 250,
    },
    {
      headerName: "Phone Number",
      field: "visitorPhone",
      width: 200,
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: "Date & Time",
      field: "updatedAt",
      filter: true,
      minWidth: 300,
      flex: 1,
      minWidth: 300,
      autoHeight: true,
      valueFormatter: (params) => dayjsShortFormat(params),
    },
  ];

  return (
    <>
      {showHeader && (
        <div
          className=" headerDiv w-full h-8 flex justify-between items-center
         bg-[#222222] text-white text-lg font-lato  px-8"
        >
          <p className=" header md:text-2xl sm:text-xl font-lato font-bold">Notifications</p>
        </div>
      )}
      <CommonDataTableView
        columns={noficationColumnDef}
        rowData={processedNotifications}
        filename={""}
      />
    </>
  );
}
