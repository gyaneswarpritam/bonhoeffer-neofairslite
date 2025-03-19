"use client";
import { VisitorsDef } from "@/components/tableColumnDef/reports/visitorsDef";
import React from "react";
import { request } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import CommonDataTable from "@/components/grid/CommonDataTable";

export default function ExhibitorTrackingReport() {
  const fetchExhibitors = async () => {
    return request({
      url: `admin/fetch-all-exhibitor`,
      method: "post",
    });
  };

  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["exhibitors-approval"],
    queryFn: fetchExhibitors,
    refetchOnWindowFocus: true,
  });
  return (
    <section className="flex flex-row items-stretch justify-between">
      <div className="w-full p-4">
        <div className="flex items-center text-sm font-semibold px-1 flex-row">
          <div>
            <p className="text-base">Exhibitor Tracking Report</p>
          </div>
        </div>
        <div className="divider w-[100%] mt-2"></div>

        <div className="h-auto">
          <CommonDataTable
            columns={VisitorsDef}
            rowData={data}
            filename={"Exhibitor-Track-Report"}
          />
        </div>
      </div>
    </section>
  );
}
