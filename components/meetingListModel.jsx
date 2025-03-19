import React from "react";
import Image from "next/image";
import "./contactModel.css";
import { request } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { BUCKET_URL } from "@/config/constant";
import dayjs from "dayjs";
import CommonDataTableView from "./grid/CommonDataTableView";
import Link from "next/link";

const MeetingListModel = ({ rowData, handleClick }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const id =
    typeof window !== "undefined" ? localStorage.getItem("id") : null;
  const role =
    typeof window !== "undefined" ? localStorage.getItem("role") : null;
  const stallManagerId =
    typeof window !== "undefined" ? localStorage.getItem("stallManagerId") : null;

  const fetchInstantMeetingData = async () => {
    return request({
      url: `exhibitor/instant-meeting/${id}`,
      method: "get",
    });
  };

  const {
    isLoading,
    data: instantMeeting,
    isError,
    error,
  } = useQuery({
    queryKey: ["instant-meeting", id], // Include id in the queryKey
    queryFn: fetchInstantMeetingData,
    enabled: !!id, // Enable the query only if id is present
  });

  const { mutate: updateInstantMeeting } = useMutation({
    mutationFn: async (id) => {
      const approveData = stallManagerId ? { approve: true, inProgress: true, stallManagerId: stallManagerId } : { approve: true, inProgress: true }
      const response = await request({
        url: `exhibitor/instant-meeting/${id}`,
        method: "put",
        data: approveData,
      });
      return { id: response._id };
    },
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("instant-meeting");
      handleClick();
      router.push(`/exhibitor/video-chat?id=${data.id}`);
    },
  });
  const { mutate: rejectInstantMeeting } = useMutation({
    mutationFn: async (id) => {
      const rejectData = stallManagerId ? { rejected: true, stallManagerId: stallManagerId } : { rejected: true }

      const response = await request({
        url: `exhibitor/instant-meeting/${id}`,
        method: "put",
        data: rejectData,
      });
      return { id: response._id };
    },
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("instant-meeting");
    },
  });
  const approve = (value) => {
    updateInstantMeeting(value?._id);
  };
  const reject = (value) => {
    rejectInstantMeeting(value?._id);
  };
  const columnDefs = [
    {
      headerName: "Visitor Name",
      field: "name",
      width: 500,
    },
    {
      headerName: "Date & Time",
      field: "updatedAt",
      width: 500,
      renderCell: (params) => {
        return dayjs(params.value).format("DD-MM-YYYY HH:mm");
      },
    },
    {
      headerName: "Meeting Link",
      field: "meetingLink",
      width: 200,
      renderCell: (params) => {
        return (
          <>
            {params.row.approve ? (
              <div className="flex justify-around">
                <Link
                  href={`/exhibitor/video-chat?id=${params.row._id}`}
                  className="flex flex-col justify-center items-center cursor-pointer"
                >
                  Join Meeting
                </Link>
              </div>
            ) : (
              <></>
            )}
          </>
        );
      },
      minWidth: 150,
    },
    {
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <>
            {params.row.approve || params.row.rejected ? <></> : (
              <div className="flex justify-around mt-2">
                <Image
                  alt="Approve"
                  width={200}
                  height={200}
                  src={`${BUCKET_URL}/admin/isApproved.svg`}
                  className="h-auto w-5 mx-auto my-auto cursor-pointer mr-4"
                  onClick={() => approve(params.row)}
                />
                <Image
                  alt="Reject"
                  width={200}
                  height={200}
                  src={`${BUCKET_URL}/admin/notApproved.svg`}
                  className="h-auto w-5 mx-auto my-auto cursor-pointer"
                  onClick={() => reject(params.row)}
                />
              </div>)}
          </>
        );
      },
      minWidth: 150,
    },
  ];
  return (
    <div className="w-full h-[100%] bg-white fixed left-0 right-0 top-0 bottom-0 z-[400] mx-auto my-auto flex flex-col justify-center items-start">
      <div className=" headerDiv w-full md:h-20 sm:h-14 mb-1 flex justify-between items-center bg-[#222222] text-white text-lg font-lato  px-8">
        <p className=" header md:text-2xl sm:text-xl font-lato font-bold">
          Waiting Meeting List
        </p>
        <div
          onClick={() => handleClick()}
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
        <CommonDataTableView
          columns={columnDefs}
          rowData={instantMeeting}
          filename={""}
        />
      </div>
    </div>
  );
};

export default MeetingListModel;
