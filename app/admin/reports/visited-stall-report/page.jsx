"use client";
import CommonReportListComponent from "@/components/admin/CommonReportComponent/CommonReportListComponent";
import React from "react";
import { request } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { visitedStallReportDef } from "@/components/tableColumnDef/visitedStallReportDef";

export default function LoggedVisitorReport() {
  const fetchExhibitors = async () => {
    return request({
      url: `admin/visited-stall-report`,
      method: "get",
    });
  };

  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["visited-stall-report"],
    queryFn: fetchExhibitors,
    refetchOnWindowFocus: true,
  });
  return (
    <section className="flex flex-row items-stretch justify-between">
      <div className="w-full p-4">
        <div className="flex items-center text-sm font-semibold px-1 flex-row">
          <div>
            <p className="text-base">Visited Stall Report</p>
          </div>
        </div>
        <div className="divider w-[100%] mt-2"></div>

        <div className="h-[90vh]">
          <CommonReportListComponent
            columns={visitedStallReportDef}
            rowData={data}
            filename={"Visited-Stall-Report"}
          />
        </div>
      </div>
    </section>
  );
}
