"use client";

import MeetingTrackingReportComponent from "@/components/admin/MeetingTrackingReportComponent";
import React from "react";

export default function MeetingTrackingReport() {
  return (
    <section className="flex flex-row items-stretch justify-between">
      <div className="w-full p-4">
        <div className="flex items-center text-sm font-semibold px-1 flex-row">
          <div>
            <p className="text-base">Meeting Tracking Report</p>
          </div>
        </div>
        <div className="divider w-[100%] mt-2"></div>

        <div className="h-auto">
          <MeetingTrackingReportComponent />
        </div>
      </div>
    </section>
  );
}
