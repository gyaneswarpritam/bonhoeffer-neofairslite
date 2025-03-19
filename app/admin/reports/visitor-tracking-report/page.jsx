"use client";

import VisitorTrackingReportComponent from "@/components/admin/visitorTrackingReportComponent";
import React from "react";

export default function VisitorTrackingReport() {
  return (
    <section className="flex flex-row items-stretch justify-between">
      <div className="w-full p-4">
        <div className="flex items-center text-sm font-semibold px-1 flex-row">
          <div>
            <p className="text-base">Visitor Tracking Report</p>
          </div>
        </div>
        <div className="divider w-[100%] mt-2"></div>

        <div className="h-[90vh]">
          <VisitorTrackingReportComponent />
        </div>
      </div>
    </section>
  );
}
