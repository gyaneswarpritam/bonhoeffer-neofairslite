"use client";
import CommonReportListComponent from "@/components/admin/CommonReportComponent/CommonReportListComponent";
import React from "react";
import { request } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { LoggedInVisitorsDef } from "@/components/tableColumnDef/reports/loggedInVisitorsDef";

export default function LoggedVisitorReport() {
  const fetchExhibitors = async () => {
    return request({
      url: `admin/logged-visitor-report`,
      method: "get",
    });
  };

  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["logged-visitor-report"],
    queryFn: fetchExhibitors,
    refetchOnWindowFocus: true,
  });
  return (
    <section className="flex flex-row items-stretch justify-between">
      <div className="w-full p-4">
        <div className="flex items-center text-sm font-semibold px-1 flex-row">
          <div>
            <p className="text-base">Logged Visitor Report</p>
            {/* <p className="font-normal text-accent-font-color">
              Pending approvals for exhibitors
            </p> */}
          </div>
        </div>
        <div className="divider w-[100%] mt-2"></div>

        <div className="h-[90vh]">
          <CommonReportListComponent
            columns={LoggedInVisitorsDef}
            rowData={data}
            filename={"Logged-Visitor-Report"}
          />
        </div>
      </div>
    </section>
  );
}
