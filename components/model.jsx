"use client";
import React, { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { breifcaseModel } from "@/models/data";
import Image from "next/image";
import "./model.css";
import { useDispatch, useSelector } from "react-redux";

import Link from "next/link";
import YouTubePlayer from "./youtubeComp";
import { modelClose } from "@/GlobalRedux/features/dialogs/dialogSlice";
import PdfModal from "./PdfModal";
import VideoModal from "./VideoModal";
import { BUCKET_URL } from "@/config/constant";
import StarRatingComponent from "react-star-rating-component";

const Model = ({ productdata, profiledata, videodata }) => {
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [headerName, SetHeaderName] = useState("");
  const [openPdf, setOpenPdf] = useState(false);
  const [pdfFile, setPdfFile] = useState();
  const [openYoutube, setOpenYoutube] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const dialogName = useSelector((state) => state.dialog.name);

  const dispatch = useDispatch();

  const handleModelClose = () => {
    dispatch(modelClose());
  };

  const imageclick = (e) => {
    setPdfFile(e);
    setOpenPdf(true);
  };
  const close = () => {
    setOpenPdf(false);
  };
  const requestFileButton = (e) => {
    e.target.innerText = "Request Sent";
    e.target.style.opacity = "0.6";
  };
  const yotubeIconClick = (e) => {
    setVideoUrl(e.toString());
    setOpenYoutube(true);
  };
  const handleYoutubeClose = () => {
    setOpenYoutube(!openYoutube);
  };
  const briefcasedata = breifcaseModel.datas;
  const briefcaseColumnDef = [
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
    {
      headerName: "Date",
      field: "date",
      filter: true,
      flex: 2,
      minWidth: 250,
    },
    {
      headerName: "File",
      field: "file",
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
            onClick={() => imageclick(params)}
          />
        );
      },
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Age",
      field: "age",
      cellRenderer: (params) => {
        const value = briefcasedata[params.rowIndex].file;
        return (
          <div>
            {value === "true" ? (
              <Image
                alt="download"
                src={`${BUCKET_URL}/download.svg`}
                height={100}
                width={100}
                className=" w-5 h-auto cursor-pointer"
              ></Image>
            ) : (
              <button
                className=" cursor-pointer border-0 bg-none"
                onClick={requestFileButton}
              >
                Request for the File
              </button>
            )}
          </div>
        );
      },
      flex: 2,
      minWidth: 250,
    },
  ];

  const productColumnDef = [
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
      headerName: "Like",
      field: "liked",
      cellRenderer: (params) => {
        return (
          <>
            <Image
              alt="Likes"
              src={`${BUCKET_URL}/stalls/like.svg`}
              height={200}
              width={200}
              className=" w-5 h-auto cursor-pointer"
              unoptimized
            ></Image>
            ({params.data.like})
          </>
        );
      },
      flex: 2,
      minWidth: 250,
    },
    {
      headerName: "Review",
      field: "review",
      cellRenderer: (params) => {
        return (
          <>
            <StarRatingComponent
              name={params.data._id}
              value={params.value || 0}
              starCount={5}
              starColor={"#ffb400"}
              emptyStarColor={"#ccc"}
            />
            ({params.data.reviewVisitors})
          </>
        );
      },
      flex: 2,
      minWidth: 250,
    },
  ];

  const profileColumnDef = [
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
  ];

  const videoColumnDef = [
    {
      headerName: "Title",
      field: "title",
      filter: true,
      width: 300,
      flex: 3,
      minWidth: 350,
    },
    {
      headerName: "Video",
      field: "url",
      filter: true,
      width: 100,
      cellRenderer: (params) => {
        return (
          <Image
            alt="pdf file"
            width={200}
            height={200}
            src={`${BUCKET_URL}/youtube.png`}
            className="h-auto w-5 mx-auto my-auto cursor-pointer"
            onClick={() => yotubeIconClick(params.value)}
            unoptimized
          />
        );
      },
      flex: 1,
      minWidth: 150,
    },
  ];

  useEffect(() => {
    switch (dialogName) {
      case "breifcase":
        SetHeaderName("BriefCase");
        setRowData(briefcasedata);
        setColumnDefs(briefcaseColumnDef);
        break;
      case "product":
        SetHeaderName("Product List");
        setRowData(productdata);
        setColumnDefs(productColumnDef);
        break;
      case "profile":
        SetHeaderName("Profile");
        setRowData(profiledata);
        setColumnDefs(profileColumnDef);
        break;
      case "video":
        SetHeaderName("video");
        setRowData(videodata);
        setColumnDefs(videoColumnDef);
      default:
        console.log("");
    }
  }, []);

  return (
    <>
      <div className="w-full h-[100%] bg-white fixed left-0 right-0 top-0 bottom-0 z-[400] mx-auto my-auto flex flex-col justify-center items-start">
        <div className=" headerDiv w-full h-20 flex justify-between items-center bg-[#222222] text-white text-lg font-lato  px-8">
          <p className=" header text-2xl font-lato font-bold">{headerName}</p>
          <div
            onClick={() => handleModelClose()}
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
            {/* <YouTubePlayer videoId={videoUrl} /> */}
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

export default Model;
