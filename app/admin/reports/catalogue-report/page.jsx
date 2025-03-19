"use client";
import CommonReportListComponent from "@/components/admin/CommonReportComponent/CommonReportListComponent";
import React from "react";
import { request } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { CatalougeDef } from "@/components/tableColumnDef/reports/catalougeDef";
import { catalougeVisitDef } from "@/components/tableColumnDef/reports/catalougeVisitDef";

export default function CatalogueReport() {
  const fetchCatalogueRequested = async () => {
    return request({
      url: `admin/catalogue-report`,
      method: "get",
    });
  };

  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["catalogue-report"],
    queryFn: fetchCatalogueRequested,
    refetchOnWindowFocus: true,
  });

  const fetchCatalogueData = async () => {
    return request({
      url: `admin/catalogue-visit-report`,
      method: "get",
    });
  };

  const { data: catalogueData } = useQuery({
    queryKey: ["catalogue-visit-report"],
    queryFn: fetchCatalogueData,
    refetchOnWindowFocus: true,
  });
  return (
    <section className="flex flex-row items-stretch justify-between">
      <div className="w-full p-4">
        <div className="flex items-center text-sm font-semibold px-1 flex-row">
          <div>
            <p className="text-base">Catalogue Request Report</p>
            {/* <p className="font-normal text-accent-font-color">
              Pending approvals for exhibitors
            </p> */}
          </div>
        </div>
        <div className="divider w-[100%] mt-2"></div>

        <div className="h-[90vh]">
          <CommonReportListComponent
            columns={CatalougeDef}
            rowData={data}
            filename={"Catalogue-Request-Report"}
          />
        </div>
        <div className="flex items-center text-sm font-semibold px-1 flex-row">
          <div>
            <p className="text-base">Catalogue Visit Report</p>
            {/* <p className="font-normal text-accent-font-color">
              Pending approvals for exhibitors
            </p> */}
          </div>
        </div>
        <div className="divider w-[100%] mt-2"></div>

        <div className="h-[90vh]">
          <CommonReportListComponent
            columns={catalougeVisitDef}
            rowData={catalogueData}
            filename={"Catalogue-Visited-Report"}
          />
        </div>
      </div>
    </section>
  );
}
