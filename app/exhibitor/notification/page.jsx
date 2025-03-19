"use client";
import React, { useEffect, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { request } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { trackUtil } from "@/lib/track";
import { dayjsShortFormat } from "@/lib/dayjs";

export default function Page() {
  const gridRef = useRef();
  const exhibitorId =
    typeof window !== "undefined" ? sessionStorage.getItem("id") : null;

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

  const noficationColumnDef = [
    {
      headerName: "Notification Type",
      field: "notificationType",
      filter: true,
      width: 200,
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: "Booking Date",
      field: "createdAt",
      filter: true,
      width: 250,
      flex: 1,
      minWidth: 250,
      valueFormatter: (params) => dayjsShortFormat(params.value),
    },
    {
      headerName: "Exhibitor Name",
      field: "visitor.name",
      filter: true,
      valueGetter: (params) => `${params.data.visitor.name}`,
      width: 200,
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: "Company Name",
      field: "visitor.companyName",
      filter: true,
      width: 200,
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: "Email",
      field: "visitor.email",
      filter: true,
      width: 250,
      flex: 2,
      minWidth: 250,
    },
    {
      headerName: "Phone Number",
      field: "visitor.phone",
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
      <div className="w-full min-h-[100vh] h-[100vh] relative bottom-0 bg-white mx-auto my-auto flex flex-col justify-center items-start mt-5 rounded-lg overflow-hidden">
        <div className=" headerDiv w-full h-14 flex justify-between items-center bg-[#222222] text-white text-lg font-lato  px-8">
          <p className=" header text-2xl font-lato font-bold">Notifications</p>
        </div>
        <div className="ag-theme-alpine h-full gridContainer pb-1 w-full ">
          <AgGridReact
            ref={gridRef}
            rowData={notifications || []}
            columnDefs={noficationColumnDef}
            rowHeight={50}
            autoSizeColumns={true}
          ></AgGridReact>
        </div>
      </div>
    </section>
  );
}
