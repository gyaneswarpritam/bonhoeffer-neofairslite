"use client";

import React, { useRef, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { meetingTrackingDef } from "../tableColumnDef/reports/meetingTrackingDef";
import { requestWithCount } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export default function MeetingTrackingReportComponent({ height = 80 }) {
  const fetchMeetings = async ({ page = 1, pageSize = 10 }) => {
    return requestWithCount({
      url: `admin/meeting-tracking-report`,
      method: "get",
      params: {
        limit: pageSize,
        offset: (page - 1) * pageSize,
      },
    });
  };

  const { isLoading, data, isError, error, fetchNextPage } = useQuery({
    queryKey: ["meeting-tracking-report"],
    queryFn: ({ pageParam }) => fetchMeetings({ page: pageParam ?? 1 }),
    getNextPageParam: (lastPage) =>
      lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined,
  });

  const newData =
    data && data?.data && data?.data.length > 0
      ? data?.data.map((item) => ({
          ...item,
          // name: item.visitor?.name,
          // email: item.visitor?.email,
          // companyName: item.visitor?.companyName,
          // phone: item.visitor?.phone,
          // stallName: item?.data?.stallName,
          // name: item?.data?.name,
          // ip: item.ip,
          // visitedTime: item.createdAt,
        }))
      : [];
  const gridRef = useRef();

  const onBtnExport = useCallback(() => {
    gridRef.current.api.exportDataAsCsv();
  }, []);

  return (
    <div>
      <div>
        <button
          style={{ backgroundColor: "#c8fb51", marginBottom: "10px" }}
          onClick={onBtnExport}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
        >
          <svg
            className="fill-current w-4 h-4 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
          </svg>
          <span>Download CSV export file</span>
        </button>
      </div>

      <div className={`ag-theme-alpine h-[${height}vh] w-full`}>
        <AgGridReact
          ref={gridRef} // Ref for accessing Grid's API
          rowData={newData} // Row Data for Rows
          columnDefs={meetingTrackingDef} // Column Defs for Columns
          // defaultColDef={defaultColDef} // Default Column Properties
          animateRows={true} // Optional - set to 'true' to have rows animate when sorted
          rowSelection="multiple" // Options - allows click selection of rows
          // onCellClicked={cellClickedListener} // Optional - registering for Grid Event
          paginationAutoPageSize={true}
          pagination={true}
        />
      </div>
    </div>
  );
}
