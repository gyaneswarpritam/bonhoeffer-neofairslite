"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { modelClose } from "@/GlobalRedux/features/dialogs/dialogSlice";
import PdfModal from "../PdfModal";
import VideoModal from "../VideoModal";
import { request } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BUCKET_URL } from "@/config/constant";
import { trackUtil } from "@/lib/track";
import StarRatingComponent from "react-star-rating-component";
import Image from "next/image";
import "./model.css";
import dayjs from "dayjs";
import CommonProductDataTableView from "../grid/CommonProductDataTableView";
import CommonDataTableView from "../grid/CommonDataTableView";

const Model = ({
  stallData,
  productdata,
  profiledata,
  videodata,
  briefcaseData,
}) => {
  const queryClient = useQueryClient();
  const visitorId =
    typeof window !== "undefined" ? localStorage.getItem("id") : null;
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [headerName, SetHeaderName] = useState("");
  const [openPdf, setOpenPdf] = useState(false);
  const [pdfFile, setPdfFile] = useState();
  const [openYoutube, setOpenYoutube] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const dialogName = useSelector((state) => state.dialog.name);

  const {
    mutate: addToBriefCase,
    isLoading: loadingUpdate,
    isError,
    error,
  } = useMutation({
    mutationFn: async (requestData) => {
      const inputData = { ...requestData };
      return request({
        url: `visitor/add-briefcase`,
        method: "post",
        data: inputData,
      });
    },
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries("stall-data");
      const updatedProductsList = productdata.map((product) => {
        if (product._id === variables.product) {
          return { ...product, briefcase: true };
        }
        return product;
      });
      if (dialogName == "product") setRowData(updatedProductsList);
    },
  });

  useEffect(() => {
    productdata =
      productdata &&
      productdata.map((product) => {

        // Check if the product exists in briefcaseData by comparing the product URL
        const existsInBriefcase = briefcaseData && briefcaseData.length ? briefcaseData.some(
          (briefcase) => briefcase.productUrl === product.url
        ) : false;

        // Return the product with the briefcase property
        return { ...product, briefcase: existsInBriefcase };
      });
  }, [productdata, briefcaseData]);

  const {
    mutate: addLikes,
    isLoading: loadingLike,
    isError: isErrorLike,
    error: errorLike,
  } = useMutation({
    mutationFn: async (requestData) => {
      const inputData = { ...requestData };
      return request({
        url: `visitor/add-like`,
        method: "post",
        data: inputData,
      });
    },
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries("stall-data");
    },
  });

  const {
    mutate: updateRating,
    isLoading: loadingRating,
    isError: isErrorRating,
    error: errorRating,
  } = useMutation({
    mutationFn: async (requestData) => {
      const inputData = { ...requestData };
      return request({
        url: `visitor/review`,
        method: "post",
        data: inputData,
      });
    },
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries("stall-data");
    },
  });

  const { mutate: addProductVisited } = useMutation({
    mutationFn: async (requestData) => {
      const inputData = { ...requestData };
      return request({
        url: `visitor/increment-visited-product`,
        method: "post",
        data: inputData,
      });
    },
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data, variables, context) => { },
  });

  const briefcaseClick = (value) => {
    const payload = {
      stall: value.stall,
      visitor: visitorId,
      exhibitor: stallData.stall.exhibitor,
      product: value._id,
      locked: value.locked,
    };
    addToBriefCase(payload);
    trackUtil({
      trackEventType: `Added To Briefcase`,
      data: {
        productName: value.title,
        stallName: stallData.stall.stallName,
      },
    });
  };

  const likeClick = (value) => {
    const payload = {
      stallId: value.stall,
      visitorId: visitorId,
      productListId: value._id,
    };
    addLikes(payload);
  };

  const handleRatingClick = (params, nextValue) => {
    const rowData = params?.row || params; // Complete row data
    const selectedRating = nextValue; // Selected rating value

    // Use rowData and selectedRating as needed
    const payload = {
      productListId: rowData._id,
      stallId: rowData.stall,
      visitorId: visitorId,
      review: selectedRating,
    };

    updateRating(payload);
  };

  const dispatch = useDispatch();

  const handleModelClose = () => {
    dispatch(modelClose());
  };

  const imageclick = async (value) => {
    if (headerName === "Brief Case") {
      value = {
        url: value.productUrl,
        stall: value.stallName
      }
    }

    setPdfFile(value.url);
    setOpenPdf(true);
    if (stallData && stallData.stall) {
      trackUtil({
        trackEventType: `Product View`,
        data: {
          productName: value.title,
          stallName: stallData.stall.stallName,
        },
      });
      const payload = {
        stallId: value.stall,
        visitorId: visitorId,
        productId: value._id,
      };
      await addProductVisited(payload);
    }
  };

  const pdfclick = async (value) => {
    setPdfFile(value.productUrl);
    setOpenPdf(true);
  };
  const close = () => {
    setOpenPdf(false);
  };
  const requestFileButton = (e, param) => {
    request({
      url: `visitor/briefcase/${param.id}`,
      method: "put",
      data: { catalog: true },
    });
    queryClient.invalidateQueries("briefcaseData");
    e.target.innerText = "Catalogue Requested";
    e.target.style.opacity = "0.6";
    if (stallData && stallData.stall) {
      trackUtil({
        trackEventType: `Catalogue Requested`,
        data: {
          name: param.productName,
          stallName: stallData.stall.stallName,
        },
      });
    }
  };
  const yotubeIconClick = (e) => {
    setVideoUrl(e.toString());
    setOpenYoutube(true);
    if (stallData && stallData.stall) {
      trackUtil({
        trackEventType: `Stall Video`,
        data: {
          stallName: stallData.stall.stallName,
        },
      });
    }
  };
  const handleYoutubeClose = () => {
    setOpenYoutube(!openYoutube);
  };

  const handleDownload = async (param) => {
    try {
      const response = await fetch(param?.productUrl, {
        method: "GET",
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", param?.productName);

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("File download failed:", error);
    }
  };

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
      field: "productName",
      filter: true,
      flex: 3,
      minWidth: 350,
    },
    {
      headerName: "Date",
      field: "updatedAt",
      filter: true,
      flex: 2,
      minWidth: 250,
      renderCell: (params) => {
        return dayjs(params.value).format("DD-MM-YYYY HH:mm");
      },
    },
    {
      headerName: "File",
      field: "productUrl",
      filter: true,
      width: 100,
      renderCell: (params) => {
        return (
          <Image
            alt="pdf file"
            width={200}
            height={200}
            src={`${BUCKET_URL}/PDF_file_icon.svg`}
            className="h-auto w-5 my-auto cursor-pointer mt-3"
            onClick={() => pdfclick(params.row)}
          />
        );
      },
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Request Catalogue",
      field: "catalog",
      renderCell: (params) => {
        const value = params.row.catalog;

        return (
          <div>
            {params.row.productLocked == true ? (
              value == true ? (
                <p>Catalogue Requested</p>
              ) : (
                <button
                  style={{ color: "blue" }}
                  className=" cursor-pointer border-0 bg-none"
                  onClick={(e) => requestFileButton(e, params.row)}
                >
                  Request for Catalogue
                </button>
              )
            ) : (
              <button
                onClick={() => handleDownload(params?.row)}
                className="w-5 h-auto cursor-pointer"
              >
                <Image
                  alt="download"
                  src={`${BUCKET_URL}/download.svg`}
                  height={100}
                  width={100}
                  className=" w-5 h-auto cursor-pointer"
                ></Image>
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
      renderCell: (params) => {
        return (
          <Image
            alt="pdf file"
            width={200}
            height={200}
            src={`${BUCKET_URL}/PDF_file_icon.svg`}
            className="h-auto w-5 my-auto cursor-pointer mt-3"
            onClick={() => imageclick(params.row)}
          />
        );
      },
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "BriefCase",
      field: "briefcase",
      renderCell: (params) => {
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
                onClick={() => briefcaseClick(params.row)}
                unoptimized
                style={{ marginTop: "10px" }}
              ></Image>
            )}
          </div>
        );
      },
      flex: 2,
      minWidth: 250,
    },
    {
      headerName: "Like",
      field: "liked",
      renderCell: (params) => {
        return (
          <div>
            {params.value ? (
              <Image
                alt="Likes"
                src={`${BUCKET_URL}/stalls/like.svg`}
                height={200}
                width={200}
                className=" w-5 h-auto cursor-pointer mt-3"
                unoptimized
              ></Image>
            ) : (
              <Image
                alt="Likes"
                src={`${BUCKET_URL}/stalls/unlike.svg`}
                height={200}
                width={200}
                className=" w-5 h-auto cursor-pointer mt-3"
                onClick={() => likeClick(params.row)}
                unoptimized
              ></Image>
            )}
          </div>
        );
      },
      flex: 2,
      minWidth: 250,
    },
    {
      headerName: "Review",
      field: "review",
      renderCell: (params) => {
        return (
          <>
            {params.value ? (
              <StarRatingComponent
                name={params.row._id}
                value={params.value || 0}
                starCount={5}
                starColor={"#ffb400"}
                emptyStarColor={"#ccc"}
              />
            ) : (
              <StarRatingComponent
                name={params.row._id}
                value={params.value || 0}
                onStarClick={(nextValue) =>
                  handleRatingClick(params, nextValue)
                }
                starCount={5}
                starColor={"#ffb400"}
                emptyStarColor={"#ccc"}
              />
            )}
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
    },
    {
      headerName: "File",
      field: "url",
      filter: true,
      width: 100,
      renderCell: (params) => {
        return (
          <Image
            alt="pdf file"
            width={200}
            height={200}
            src={`${BUCKET_URL}/PDF_file_icon.svg`}
            className="h-auto w-5 my-auto cursor-pointer mt-3"
            onClick={() => imageclick(params.row)}
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
      renderCell: (params) => {
        return (
          <Image
            alt="youtube video"
            width={200}
            height={200}
            src={`${BUCKET_URL}/youtube.png`}
            className="h-auto w-5 mx-auto my-auto cursor-pointer mt-3"
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
      case "briefcase":
        SetHeaderName("Brief Case");
        setRowData(briefcaseData);
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
        SetHeaderName("Video");
        setRowData(videodata);
        setColumnDefs(videoColumnDef);
      default:
        console.log("");
    }
  }, [
    dialogName,
    productdata,
    briefcaseData,
    profiledata,
    videodata,
    stallData,
  ]);

  return (
    <>
      <div className="w-full h-[100%] bg-white fixed left-0 right-0 top-0 bottom-0 z-[400] mx-auto my-auto flex flex-col justify-center items-start">
        <div className=" headerDiv w-full md:h-20 sm:h-14 mb-1 flex justify-between items-center bg-[#222222] text-white text-lg font-lato  px-8">
          <p className=" header md:text-2xl sm:text-xl font-lato font-bold">{headerName}</p>
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
        <div className="ag-theme-alpine h-full gridContainer w-full overflow-y-scroll px-4">
          {
            headerName == "Brief Case" ?
              <CommonDataTableView
                columns={columnDefs}
                rowData={rowData}
                imageclick={imageclick}
                requestFileButton={requestFileButton}
                handleDownload={handleDownload}
              />
              :
              <CommonProductDataTableView
                columns={columnDefs}
                rowData={rowData}
                filename={""}
                imageclick={imageclick}
                headerName={headerName}
                yotubeIconClick={yotubeIconClick}
                likeClick={likeClick}
                handleRatingClick={handleRatingClick}
                briefcaseClick={briefcaseClick}
              />
          }

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

export default Model;
