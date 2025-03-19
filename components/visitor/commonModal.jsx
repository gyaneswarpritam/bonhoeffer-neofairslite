"use client";
import React, { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import Image from "next/image";
import "./model.css";
import PdfModal from "../PdfModal";
import VideoModal from "../VideoModal";
import { BUCKET_URL } from "@/config/constant";

const CommonModal = ({
  tableName,
  tableColDef,
  tableList,
  handleTableClose,
}) => {
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [headerName, setHeaderName] = useState("");
  const [openPdf, setOpenPdf] = useState(false);
  const [pdfFile, setPdfFile] = useState();
  const [openYoutube, setOpenYoutube] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const imageclick = (e) => {
    setPdfFile(e);
    setOpenPdf(true);
  };
  const close = () => {
    setOpenPdf(false);
  };

  const stallViewDef = [
    {
      headerName: "Title",
      field: "title",
      filter: true,
      width: 300,
      flex: 3,
      minWidth: 350,
    },
    {
      headerName: "File",
      field: "url",
      filter: true,
      width: 100,
      cellRenderer: (params) => {
        return (
          <Image
            alt="pdf file"
            width={200}
            height={200}
            src={`${BUCKET_URL}/PDF_file_icon.svg`}
            className="h-auto w-5 mx-auto my-auto cursor-pointer"
            onClick={() => imageclick(params.value)}
          />
        );
      },
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "BriefCase",
      field: "briefcase",
      cellRenderer: (params) => {
        return (
          <div>
            {params.value ? (
              "Added To BriefCase"
            ) : (
              <Image
                alt="briefcase"
                src={`${BUCKET_URL}/stalls/briefcase.png`}
                height={100}
                width={100}
                className=" w-5 h-auto cursor-pointer"
                onClick={() => briefcaseClick(params.data)}
                unoptimized
              ></Image>
            )}
          </div>
        );
      },
      flex: 2,
      minWidth: 250,
    },
  ];

  useEffect(() => {
    setHeaderName(tableName);
    setRowData(tableList);
    setColumnDefs(tableColDef);
  }, []);

  return (
    <>
      <div className="w-full h-[100%] bg-white fixed left-0 right-0 top-0 bottom-0 z-[400] mx-auto my-auto flex flex-col justify-center items-start">
        <div className=" headerDiv w-full h-20 flex justify-between items-center bg-[#222222] text-white text-lg font-lato  px-8">
          <p className=" header text-2xl font-lato font-bold">{headerName}</p>
          <div
            onClick={handleTableClose}
            className=" w-6 h-6 p-2 rounded-full bg-brand-color cursor-pointer"
          >
            <Image
              alt="close"
              height={100}
              width={100}
              src={`${BUCKET_URL}/Close.png`}
              unoptimized
              className=" w-full h-auto"
            ></Image>
          </div>
        </div>
        <div className="ag-theme-alpine h-full gridContainer w-full ">
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            rowHeight={50}
            autoSizeColumns={true}
          ></AgGridReact>
        </div>
      </div>
      {openPdf ? (
        <PdfModal pdfFile={pdfFile} closePDFFile={close} />
      ) : openYoutube ? (
        <div className="w-full h-[100%] bg-white fixed left-0 right-0 top-0 bottom-0 z-[400] mx-auto my-auto flex flex-col justify-center items-start">
          <div className="w-full h-20 flex justify-end items-center bg-[#222222] px-8">
            <div
              onClick={() => handleYoutubeClose()}
              className=" w-6 h-6 p-2 rounded-full bg-brand-color"
            >
              <Image
                alt="close"
                height={100}
                width={100}
                src={`${BUCKET_URL}/Close.png`}
                unoptimized
                className=" w-full h-auto"
              ></Image>
            </div>
          </div>
          <div className="ag-theme-alpine h-full pb-20 w-full ">
            <VideoModal
              title={"Stall Video"}
              videoUrl={videoUrl}
              handleModelClose={handleModelClose}
            />
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default CommonModal;
