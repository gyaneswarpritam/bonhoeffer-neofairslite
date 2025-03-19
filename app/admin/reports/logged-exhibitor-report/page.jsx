"use client";
import React from "react";
import { request } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { LoggedinExhibitorsDef } from "@/components/tableColumnDef/reports/loggedinExhibitorsDef";
import CommonDataTable from "@/components/grid/CommonDataTable";

export default function LoggedExhibitorReport() {
  const fetchExhibitors = async () => {
    return request({
      url: `admin/logged-exhibitor-report`,
      method: "get",
    });
  };

  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["logged-exhibitor-report"],
    queryFn: fetchExhibitors,
    refetchOnWindowFocus: true,
  });
  return (
    <section className="flex flex-row items-stretch justify-between">
      <div className="w-full p-4">
        <div className="flex items-center text-sm font-semibold px-1 flex-row">
          <div>
            <p className="text-base">Logged Exhibitor Report</p>
            {/* <p className="font-normal text-accent-font-color">
              Pending approvals for exhibitors
            </p> */}
          </div>
        </div>
        <div className="divider w-[100%] mt-2"></div>

        <div className="h-auto">
          <CommonDataTable
            columns={LoggedinExhibitorsDef}
            rowData={data}
            filename={"Logged-Exhibitor-Report"}
          />
        </div>
      </div>
    </section>
  );
}
