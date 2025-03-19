"use client";
import React, { useState } from "react";
import { getByApprovalStatus } from "@/lib/util";
import StallManagerApprovalComponent from "@/components/admin/StallManagerApprovalComponent copy/StallManagerApprovalComponent";

export default function StallManagerApproval() {
  const [status, setStatus] = useState({
    active: true,
    blocked: false,
    reject: false,
  });

  const changeStatus = (value) => {
    setStatus(getByApprovalStatus(value));
  };

  return (
    <section className="flex flex-row items-stretch justify-between">
      <div className="w-full p-4">
        <div className="flex items-center text-sm font-semibold px-1 flex-row">
          <div>
            <p className="text-base">Requested Stall Manager</p>
            <p className="font-normal text-accent-font-color">
              Pending approvals for Stall Manager
            </p>
          </div>
          <div className="ml-4">
            <select
              className="border-2 text-lg rounded-lg"
              onChange={(e) => changeStatus(e.target.value)}
            >
              <option value={"current"}>Current Stall Manager</option>
              <option value={"requested"}>Stall Manager Request</option>
              <option value={"blocked"}>Blocked Stall Manager</option>
              <option value={"rejected"}>Declined Stall Manager</option>
            </select>
          </div>
        </div>
        <div className="divider w-[100%] mt-2"></div>

        <div className="h-auto">
          <StallManagerApprovalComponent status={status} />
        </div>
      </div>
    </section>
  );
}
