"use client";
import React from "react";
import { request } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { VisitorsDef } from "@/components/tableColumnDef/reports/visitorsDef";
import CommonDataTable from "@/components/grid/CommonDataTable";

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

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  const newData =
    data &&
    data.map((item) => ({
      ...item,
      id: item._id, // Map _id to id for DataGrid
      status:
        item.active === "true"
          ? "Approved"
          : item.blocked === "true"
            ? "Blocked"
            : item.active === "false"
              ? "Pending"
              : "Rejected",
    }));

  return (
    <section className="flex flex-row items-stretch justify-between">
      <div className="w-full p-4">
        <div className="flex items-center text-sm font-semibold px-1 flex-row">
          <div>
            <p className="text-base">Visitor Report</p>
          </div>
        </div>
        <div className="divider w-[100%] mt-2"></div>
        <div className="h-auto">
          <CommonDataTable
            columns={VisitorsDef}
            rowData={newData}
            filename={"Visitor-Report"}
          />
        </div>
      </div>
    </section>
  );
}
