"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { reportsData, visitorsData } from "@/models/adminData";
import TableMain from "./tableMain";

export default function Reports() {
  const [option, setOption] = useState(0);

  useEffect(() => {
    const els = document.getElementsByClassName("side-panel");

    for (var i = 0; i < els.length; i++) {
      els[i].addEventListener("click", (e) => handleClick(e));
    }

    return () => {
      for (var i = 0; i < els.length; i++) {
        els[i].removeEventListener("click", (e) => handleClick(e));
      }
    };
  }, []);

  const handleClick = (e) => {
    const n = Number(e.target.getAttribute("data-tag"));
    console.log(n);
    setOption(n);
    const els = document.getElementsByClassName("side-panel");
    for (var r = 0; r < els.length; r++) {
      if (r === n && !els[r].classList.contains("active")) {
        els[r].classList.add("active");
      } else {
        els[r].classList.remove("active");
      }
    }
  };

  const [columnDefs, setColumnDefs] = useState([]);
  const [rowData, setRowData] = useState([]); // Set rowData to Array of Objects, one Object per Row

  useEffect(() => {
    const data = reportsData;
    setRowData(data);
    setColumnDefs([
      { headerName: "Column 1", field: "column1", filter: true, width: 150 },
      { headerName: "Column 2", field: "column2", filter: true, width: 150 },
      { headerName: "Column 3", field: "column3", filter: true, width: 150 },
      { headerName: "Column 4", field: "column4", filter: true, width: 150 },
      { headerName: "Column 5", field: "column5", filter: true, width: 150 },
      { headerName: "Column 6", field: "column6", filter: true, width: 150 },
      { headerName: "Column 7", field: "column7", filter: true, width: 150 },
      { headerName: "Column 8", field: "column8", filter: true, width: 150 },
      { headerName: "Column 9", field: "column9", filter: true, width: 150 },
      { headerName: "Column 10", field: "column10", filter: true, width: 150 },
    ]);
  }, []);

  return (
    <section className="flex flex-row items-stretch justify-between">
      <div className="w-full p-4">
        <div className="flex items-center text-sm font-semibold px-1 flex-row">
          <div>
            <p className="text-base">Requested Reports</p>
            <p className="font-normal text-accent-font-color">
              Lorem Ipsum dolor init.
            </p>
          </div>
        </div>
        <div className="divider w-[100%] mt-2"></div>

        <div className="h-[90vh]">
          <TableMain rowData={rowData} columnDefs={columnDefs} />
        </div>
      </div>
    </section>
  );
}
