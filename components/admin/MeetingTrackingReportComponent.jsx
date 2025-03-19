"use client";

import React from "react";
import { meetingTrackingDef } from "../tableColumnDef/reports/meetingTrackingDef";
import { requestWithCount } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import CommonDataTable from "../grid/CommonDataTable";
import { dayjsFormat } from "@/lib/dayjs";

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
        visitorName: item.visitor?.name,
        visitorEmail: item.visitor?.email,
        visitorCompanyName: item.visitor?.companyName,
        visitorPhone: item.visitor?.phone,
        exhibitorName: item.exhibitor?.name,
        exhibitorEmail: item.exhibitor?.email,
        exhibitorCompanyName: item.exhibitor?.companyName,
        exhibitorPhone: item.exhibitor?.phone,
        meetingDate: item?.data?.slotDate || item?.data?.date,
        meetingTime: item?.data?.time,
        status: item?.data?.status,
        ip: item.ip,
        createdAt: dayjsFormat(item.createdAt),
        timeZone: item.data.timeZone,
      }))
      : [];

  return (
    <div className="h-auto">
      <CommonDataTable
        columns={meetingTrackingDef}
        rowData={newData}
        filename={"Meeting-Tracking-Report"}
      />
    </div>
  );
}
