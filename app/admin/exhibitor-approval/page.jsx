"use client";
import React, { useState } from "react";
import ExhibitorApprovalListComponent from "@/components/admin/ExhibitorApprovalComponent/ExhibitorApprovalListComponent";
import { getByApprovalStatus } from "@/lib/util";

export default function Exhibitors() {
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
            <p className="text-base">Requested Exhibitors</p>
            <p className="font-normal text-accent-font-color">
              Pending approvals for exhibitors
            </p>
          </div>
          <div className="ml-4">
            <select
              className="border-2 text-lg rounded-lg"
              onChange={(e) => changeStatus(e.target.value)}
            >
              <option value={"current"}>Current Exhibitor</option>
              <option value={"requested"}>Exhibitor Request</option>
              <option value={"blocked"}>Blocked Exhibitor</option>
              <option value={"rejected"}>Declined Exhibitor</option>
            </select>
          </div>
        </div>
        <div className="divider w-[100%] mt-2"></div>

        <div className="h-[90vh]">
          <ExhibitorApprovalListComponent status={status} />
        </div>
      </div>
    </section>
  );
}
