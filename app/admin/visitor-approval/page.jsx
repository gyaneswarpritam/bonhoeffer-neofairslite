"use client";
import React, { useState } from "react";
import VisitorApprovalListComponent from "@/components/admin/VisitorApprovalComponent/VisitorApprovalListComponent";
import { getByApprovalStatus } from "@/lib/util";

export default function Visitors() {
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
            <p className="text-base">Requested Visitors</p>
            <p className="font-normal text-accent-font-color">
              Pending approvals for visitors
            </p>
          </div>
          <div className="ml-4">
            <select
              className="border-2 text-lg rounded-lg"
              onChange={(e) => changeStatus(e.target.value)}
            >
              <option value={"current"}>Current Visitor</option>
              {/* <option value={"requested"}>Visitor Request</option> */}
              <option value={"blocked"}>Blocked Visitor</option>
              <option value={"rejected"}>Declined Visitor</option>
            </select>
          </div>
        </div>
        <div className="divider w-[100%] mt-2"></div>

        <div className="h-auto">
          <VisitorApprovalListComponent status={status} />
        </div>
      </div>
    </section>
  );
}
