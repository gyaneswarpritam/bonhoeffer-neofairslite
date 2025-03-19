"use client";
import React, { useEffect, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { request } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { trackUtil } from "@/lib/track";
import { dayjsShortFormat } from "@/lib/dayjs";

const NotificationComponent = () => {
  const gridRef = useRef();
  const visitorId =
    typeof window !== "undefined" ? sessionStorage.getItem("id") : null;
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

  const noficationColumnDef = [
    {
      headerName: "Notification Type",
      field: "notificationType",
      filter: true,
      width: 300,
    },
    {
      headerName: "Booking Date",
      field: "createdAt",
      filter: true,
      width: 300,
      valueFormatter: (params) => dayjsShortFormat(params.value),
    },
    {
      headerName: "Exhibitor Name",
      field: "exhibitor.name",
      filter: true,
      valueGetter: (params) => `${params.data.exhibitor.name} `,
      width: 200,
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: "Company Name",
      field: "exhibitor.companyName",
      filter: true,
      width: 200,
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: "Email",
      field: "exhibitor.email",
      filter: true,
      width: 250,
      flex: 2,
      minWidth: 250,
    },
    {
      headerName: "Phone Number",
      field: "exhibitor.phone",
      filter: true,
      width: 200,
      flex: 1,
      minWidth: 200,
    },
  ];

  return (
    <section
      className="lg:pl-3 lg:pr-5 lg:py-5 bg-white w-full h-full relative pt-20 pb-4 px-3 lg:min-h-screen  flex flex-col"
      id="main-content-body"
    >
      <div className="w-full min-h-[80vh] h-[80vh] relative bottom-0 bg-white mx-auto my-auto flex flex-col justify-center items-start mt-5 rounded-lg overflow-hidden">
        <div className="ag-theme-alpine h-full gridContainer pb-1 w-full ">
          <AgGridReact
            ref={gridRef}
            rowData={notifications}
            columnDefs={noficationColumnDef}
            rowHeight={50}
            autoSizeColumns={true}
          ></AgGridReact>
        </div>
      </div>
    </section>
  );
};
export default NotificationComponent;
