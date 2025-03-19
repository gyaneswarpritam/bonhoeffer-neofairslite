"use client";
import CommonReportListComponent from "@/components/admin/CommonReportComponent/CommonReportListComponent";
import React from "react";
import { request } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { VisitorsDef } from "@/components/tableColumnDef/reports/visitorsDef";

export default function VisitorReport() {
  const fetchVisitors = async () => {
    return request({
      url: `admin/visitor-report`,
      method: "get",
    });
  };

  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["visitor-report"],
    queryFn: fetchVisitors,
    refetchOnWindowFocus: true,
  });
  const newData =
    data &&
    data.map((item) => {
      return {
        ...item,
        status:
          item.active == "true"
            ? "Approved"
            : item.blocked == "true"
            ? "Blocked"
            : item.active == "false"
            ? "Pending"
            : "Rejected",
      };
    });
  return (
    <section className="flex flex-row items-stretch justify-between">
      <div className="w-full p-4">
        <div className="flex items-center text-sm font-semibold px-1 flex-row">
          <div>
            <p className="text-base">Visitor Report</p>
          </div>
        </div>
        <div className="divider w-[100%] mt-2"></div>

        <div className="h-[90vh]">
          <CommonReportListComponent
            columns={VisitorsDef}
            rowData={newData}
            filename={"Visitor-Report"}
          />
        </div>
      </div>
    </section>
  );
}
