"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import LocationBand from "@/components/exibitor/locationBand";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { breifcaseModel } from "@/models/exibitor-data";

export default function Page() {
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [headerName, SetHeaderName] = useState("");
  const gridRef = useRef();

  const briefcasedata = breifcaseModel.datas;
  const briefcaseColumnDef = [
    {
      headerName: "Time",
      field: "time",
      filter: true,
      width: 100,
      flex: 1,
      minWidth: 100,
    },

    {
      headerName: "Date",
      field: "date",
      filter: true,
      flex: 2,
      minWidth: 250,
    },
    {
      headerName: "Buyer Name",
      field: "stallName",
      filter: true,
      width: 300,
      flex: 3,
      minWidth: 350,
    },
    {
      headerName: "Exibitor Name",
      field: "file",
      filter: true,
      width: 200,
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: "Exibitor Email",
      field: "email",
      filter: true,
      width: 200,
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: "Buyer Company",
      field: "stallProduct",
      filter: true,
      flex: 1,
      minWidth: 150,
    },
  ];
  useEffect(() => {
    SetHeaderName("Pre-fixed Meetings");
    setRowData(briefcasedata);
    setColumnDefs(briefcaseColumnDef);
  }, []);
  const onBtExport = useCallback(() => {
    gridRef.current.api.exportDataAsExcel();
  }, []);
  return (
    <section
      className="lg:pl-3 lg:pr-5 lg:py-5 bg-white w-full h-full relative pt-20 pb-4 px-3 lg:min-h-screen  flex flex-col"
      id="main-content-body"
    >
      <LocationBand></LocationBand>
      <div className=" flex justify-end mt-7">
        <button className=" bg-black text-white px-4 py-3 rounded-lg text-sm font-quickSand font-bold">
          Export as CSV
        </button>
      </div>
      <div className="w-full h-full relative bottom-0 bg-white mx-auto my-auto flex flex-col items-start mt-5 rounded-lg overflow-hidden">
        <div className=" headerDiv w-full h-14 flex justify-between items-center bg-[#222222] text-white text-lg font-lato  px-8">
          <p className=" header text-2xl font-lato font-bold">{headerName}</p>
        </div>
        <div className="ag-theme-alpine h-full gridContainer pb-1 w-full ">
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            rowHeight={50}
            autoSizeColumns={true}
          ></AgGridReact>
        </div>
      </div>
    </section>
  );
}
