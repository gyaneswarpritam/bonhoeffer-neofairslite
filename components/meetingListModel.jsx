import React from "react";
import Image from "next/image";
import "./contactModel.css";
import { AgGridReact } from "ag-grid-react";
import { request } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { BUCKET_URL } from "@/config/constant";
import dayjs from "dayjs";

const MeetingListModel = ({ rowData, handleClick }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const id =
    typeof window !== "undefined" ? sessionStorage.getItem("id") : null;

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
      const response = await request({
        url: `exhibitor/instant-meeting/${id}`,
        method: "put",
        data: { approve: true },
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
      const response = await request({
        url: `exhibitor/instant-meeting/${id}`,
        method: "put",
        data: { rejected: true },
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
      filter: true,
      width: 500,
    },
    {
      headerName: "Date & Time",
      field: "updatedAt",
      filter: true,
      width: 500,
      cellRenderer: (params) => {
        return dayjs(params.value).format("DD-MM-YYYY HH:mm");
      },
    },
    {
      headerName: "Action",
      width: 200,
      cellRenderer: (params) => {
        return (
          <>
            <Image
              alt="Approve"
              width={200}
              height={200}
              src={`${BUCKET_URL}/admin/isApproved.svg`}
              className="h-auto w-5 mx-auto my-auto cursor-pointer"
              onClick={() => approve(params.data)}
            />
            <Image
              alt="Reject"
              width={200}
              height={200}
              src={`${BUCKET_URL}/admin/notApproved.svg`}
              className="h-auto w-5 mx-auto my-auto cursor-pointer"
              onClick={() => reject(params.data)}
            />
          </>
        );
      },
      flex: 1,
      minWidth: 150,
    },
  ];
  return (
    <div className="w-full h-[100%] bg-white fixed left-0 right-0 top-0 bottom-0 z-[400] mx-auto my-auto flex flex-col justify-center items-start">
      <div className=" headerDiv w-full h-20 flex justify-between items-center bg-[#222222] text-white text-lg font-lato  px-8">
        <p className=" header text-2xl font-lato font-bold">
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
        <AgGridReact
          rowData={instantMeeting}
          columnDefs={columnDefs}
          rowHeight={50}
          autoSizeColumns={true}
        ></AgGridReact>
      </div>
    </div>
  );
};

export default MeetingListModel;
