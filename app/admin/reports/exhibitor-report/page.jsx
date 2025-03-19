"use client";
import React from "react";
import { request } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { ExhibitorsDef } from "@/components/tableColumnDef/reports/exhibitorsDef";
import CommonDataTable from "@/components/grid/CommonDataTable";

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

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

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
        id: item._id, // Map _id to id for DataGrid
        productInfo: newProductInfo, // Include formatted productInfo
        status:
          item.active == true
            ? "Approved"
            : item.blocked == true
              ? "Blocked"
              : item.active == false
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
        <div className="h-auto">
          <CommonDataTable
            columns={ExhibitorsDef}
            rowData={newData}
            filename={"Exhibitor-Report"}
          />
        </div>
      </div>
    </section>
  );
}
