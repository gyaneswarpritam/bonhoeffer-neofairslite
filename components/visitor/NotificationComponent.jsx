"use client";
import React, { useEffect, useRef, useState } from "react";
import { request } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { trackUtil } from "@/lib/track";
import { dayjsShortFormat } from "@/lib/dayjs";
import CommonDataTableView from "../grid/CommonDataTableView";

const NotificationComponent = () => {
  const gridRef = useRef();
  const visitorId =
    typeof window !== "undefined" ? localStorage.getItem("id") : null;
  const [processedNotifications, setProcessedNotifications] = useState([]);
  const fetchNotification = async () => {
    return request({
      url: `visitor/all-notification/${visitorId}`,
      method: "get",
    });
  };

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotification,
    refetchInterval: 5000,
  });

  const markAllNotificationsAsRead = async () => {
    return request({
      url: `visitor/notification/${visitorId}`,
      method: "put",
    });
  };

  useEffect(() => {
    trackUtil({
      trackEventType: "Notifications",
    });
    // Mark all notifications as read when the component loads
    if (visitorId) {
      markAllNotificationsAsRead().catch((error) => {
        console.error("Error marking notifications as read:", error);
      });
    }
  }, []);

  useEffect(() => {
    if (notifications) {
      const transformedNotifications = notifications.map((item) => ({
        ...item,
        exhibitorName: item.exhibitor?.name || "",
        exhibitorCompany: item.exhibitor?.companyName || "",
        exhibitorEmail: item.exhibitor?.email || "",
        exhibitorPhone: item.exhibitor?.phone || "",
      }));
      setProcessedNotifications(transformedNotifications);
    }
  }, [notifications]);

  const noficationColumnDef = [
    {
      headerName: "Notification Type",
      field: "notificationType",
      filter: true,
      width: 300,
    },
    {
      headerName: "Meeting Date",
      field: "createdAt",
      filter: true,
      width: 300,
      valueFormatter: (params) => dayjsShortFormat(params),
    },
    {
      headerName: "Exhibitor Name",
      field: "exhibitorName",
      filter: true,
      width: 200,
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: "Company Name",
      field: "exhibitorCompany",
      filter: true,
      width: 200,
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: "Email",
      field: "exhibitorEmail",
      filter: true,
      width: 250,
      flex: 2,
      minWidth: 250,
    },
    {
      headerName: "Phone Number",
      field: "exhibitorPhone",
      filter: true,
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
    <section
      className="lg:pl-3 lg:pr-5 lg:py-5 bg-white w-full h-full relative pt-2 pb-4 px-3 lg:min-h-screen  flex flex-col"
      id="main-content-body"
    >
      <div className="w-full min-h-[80vh] h-[80vh] relative bottom-0 bg-white mx-auto my-auto flex flex-col justify-center items-start mt-5 rounded-lg overflow-hidden">
        <div className="ag-theme-alpine h-full gridContainer pb-1 w-full ">
          <CommonDataTableView
            columns={noficationColumnDef}
            rowData={processedNotifications}
            filename={""}
          />
        </div>
      </div>
    </section>
  );
};
export default NotificationComponent;
