"use client";
import CommonReportListComponent from "@/components/admin/CommonReportComponent/CommonReportListComponent";
import React from "react";
import { request } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { ExhibitorsDef } from "@/components/tableColumnDef/reports/exhibitorsDef";

export default function ExhibitorReport() {
  const fetchExhibitors = async () => {
    return request({
      url: `admin/exhibitor-report`,
      method: "get",
    });
  };

  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["exhibitor-report"],
    queryFn: fetchExhibitors,
    refetchOnWindowFocus: true,
  });
  const newData =
    data &&
    data.map((item) => {
      const newProductInfo = {};
      for (const key in item.productInfo) {
        if (Array.isArray(item.productInfo[key])) {
          newProductInfo[key] = item.productInfo[key].join(", ");
        } else {
          newProductInfo[key] = "-";
        }
      }

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
            <p className="text-base">Exhibitor Report</p>
          </div>
        </div>
        <div className="divider w-[100%] mt-2"></div>

        <div className="h-[90vh]">
          <CommonReportListComponent
            columns={ExhibitorsDef}
            rowData={newData}
            filename={"Exhibitor-Report"}
          />
        </div>
      </div>
    </section>
  );
}
