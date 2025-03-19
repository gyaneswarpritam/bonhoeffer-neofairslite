"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import "./model.css";
import PdfModal from "../PdfModal";
import VideoModal from "../VideoModal";
import { BUCKET_URL } from "@/config/constant";
import CommonDataTableView from "../grid/CommonDataTableView";

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

  useEffect(() => {
    setHeaderName(tableName);
    setRowData(tableList);
    setColumnDefs(tableColDef);
  }, []);

  return (
    <>
      <div className="w-full h-[100%] bg-white fixed left-0 right-0 top-0 bottom-0 z-[400] mx-auto my-auto flex flex-col justify-center items-start">
        <div className=" headerDiv w-full md:h-20 sm:h-14 mb-1 flex justify-between items-center bg-[#222222] text-white text-lg font-lato  px-8">
          <p className=" header md:text-2xl sm:text-xl font-lato font-bold">{headerName}</p>
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

        <div className="ag-theme-alpine h-full gridContainer w-full overflow-y-scroll px-4">
          <CommonDataTableView
            columns={columnDefs}
            rowData={rowData}
            filename={""}
          />
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
