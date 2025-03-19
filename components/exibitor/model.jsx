"use client";
import React, { useState, useEffect, useRef } from "react";
import { breifcaseModel, profileModel, videoModel } from "@/models/data";
import "./model.css";
import CommonDataTableView from "../grid/CommonDataTableView";

const Model = (props, { change }) => {
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [headerName, SetHeaderName] = useState("");

  const stallViewData = breifcaseModel.datas;
  const stallViewDef = [
    {
      headerName: "Name",
      field: "stallName",
      filter: true,
      width: 300,
      flex: 3,
      minWidth: 350,
    },
    {
      headerName: "Email",
      field: "email",
      filter: true,
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: "Company Name",
      field: "stallProduct",
      filter: true,
      flex: 3,
      minWidth: 350,
    },
    {
      headerName: "Phone",
      field: "phone",
      filter: true,
      flex: 2,
      minWidth: 250,
    },
    {
      headerName: "Time",
      field: "date",
      filter: true,
      flex: 1,
      minWidth: 250,
    },
  ];

  const productdata = breifcaseModel.datas;
  const productColumnDef = [
    {
      headerName: "Stall Name",
      field: "stallName",
      filter: true,
      width: 300,
      flex: 3,
      minWidth: 350,
    },
    {
      headerName: "Stall Product",
      field: "stallProduct",
      filter: true,
      flex: 3,
      minWidth: 350,
    },
  ];

  const profiledata = profileModel.datas;
  const profileColumnDef = [
    {
      headerName: "Title",
      field: "stallName",
      filter: true,
      width: 300,
      flex: 3,
      minWidth: 350,
    },
    {
      headerName: "Description",
      field: "stallProduct",
      filter: true,
      flex: 3,
      minWidth: 350,
    },
  ];

  useEffect(() => {
    switch (props.value) {
      case "stallVisitors":
        SetHeaderName("Stall Visitors");
        setRowData(stallViewData);
        setColumnDefs(stallViewDef);
        break;
      case "requestedCatalogues":
        SetHeaderName("Requested Catalogues");
        setRowData(productdata);
        setColumnDefs(productColumnDef);
        break;
      case "directMessages":
        SetHeaderName("Direct Messages");
        setRowData(profiledata);
        setColumnDefs(profileColumnDef);
        break;
      default:
        console.log("");
    }
  }, []);
  //   const [columnDefs] = useState([
  //     { field: "Stall Name" },
  //     { field: "Stall Product" },
  //     { field: "Date" },
  //     { field: "File" },
  //     { field: "Download" },
  //   ]);
  return (
    <>
      <div className="w-full h-[30rem] min-h-[30rem] md:h-auto bg-white flex flex-col justify-center items-start">
        <div className=" headerDiv w-full h-20 bg-[#222222] text-white text-lg font-lato flex items-center justify-between px-8">
          <p className=" header md:text-2xl sm:text-xl font-lato font-bold">{headerName}</p>
          <p
            className=" text-white text-xl font-bold cursor-pointer"
            onClick={() => props.change()}
          >
            Back
          </p>
        </div>
        <div className="ag-theme-alpine h-full gridContainer w-full">
          <CommonDataTableView
            columns={columnDefs}
            rowData={rowData}
            filename={""}
          />
        </div>
      </div>
    </>
  );
};

export default Model;
