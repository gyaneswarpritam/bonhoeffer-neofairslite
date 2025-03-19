"use client";

import React, { useRef, useCallback } from "react";
import { visitorsTrackingDef } from "../tableColumnDef/reports/visitorsTrackingDef";
import { requestWithCount } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import CommonDataTable from "../grid/CommonDataTable";

export default function VisitorTrackingReportComponent() {
  const fetchTrackingReports = async ({ page = 1, pageSize = 10 }) => {
    return requestWithCount({
      url: `admin/visitor-tracking-report`,
      method: "get",
      params: {
        limit: pageSize,
        offset: (page - 1) * pageSize,
      },
    });
  };

  const { isLoading, data, isError, error, fetchNextPage } = useQuery({
    queryKey: ["visitor-tracking-report"],
    queryFn: ({ pageParam }) => fetchTrackingReports({ page: pageParam ?? 1 }),
    getNextPageParam: (lastPage) =>
      lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined,
    refetchInterval: 5000,
  });

  const newData =
    data && data?.data && data?.data.length > 0
      ? data?.data.map((item) => ({
        ...item,
        name: `${item.visitor?.name} `,
        email: item.visitor?.email,
        phone: item.visitor?.phone,
        companyName: item.visitor?.companyName,
        stallName: item?.data?.stallName,
        productTitle: item?.data?.productName,
        productUrl: item?.data?.url,
        ip: item.ip,
        visitedTime: item.updatedAt,
      }))
      : [];

  return (
    <div>
      <div className={`ag-theme-alpine w-full`}>
        <CommonDataTable
          columns={visitorsTrackingDef}
          rowData={newData}
          filename={`Visitor-Tracking`}
        />
      </div>
    </div>
  );
}
