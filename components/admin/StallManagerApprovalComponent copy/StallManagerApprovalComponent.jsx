"use client";
import { request } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";
import { BUCKET_URL } from "@/config/constant";
import CommonDataTable from "@/components/grid/CommonDataTable";

const StallManagerApprovalComponent = ({ status }) => {
  let columns;
  if (status.active) {
    columns = [
      {
        headerName: "Name",
        field: "name",
        filter: true,
        width: 150,
      },
      { headerName: "Company", field: "companyName", filter: true, width: 150 },
      {
        headerName: "Company Address",
        field: "companyAddress",
        filter: true,
        width: 250,
      },
      { headerName: "Email", field: "email", filter: true, width: 250 },
      { headerName: "Phone", field: "phone", filter: true, width: 150 },
      {
        field: "Block",
        filter: true,
        width: 130,
        renderCell: (params) => {
          return (
            <div className="flex flex-col items-start justify-center h-full">
              <Image
                onClick={() => blockExhibitor(params.row._id)}
                alt="block_icon"
                width={100}
                height={100}
                className={`cursor-pointer w-auto h-4`}
                src={`${BUCKET_URL}/admin/isBlocked.svg`}
              />
            </div>
          );
        },
      },
    ];
  } else if (status.blocked) {
    columns = [
      {
        headerName: "Name",
        field: "name",
        filter: true,
        width: 150,
      },
      { headerName: "Company", field: "companyName", filter: true, width: 150 },
      {
        headerName: "Company Address",
        field: "companyAddress",
        filter: true,
        width: 250,
      },
      { headerName: "Email", field: "email", filter: true, width: 250 },
      { headerName: "Phone", field: "phone", filter: true, width: 150 },
      {
        field: "Restore",
        filter: true,
        width: 130,
        renderCell: (params) => {
          return (
            <div className="flex flex-col items-start justify-center h-full">
              <Image
                onClick={() => restoreExhibitor(params.row._id)}
                alt="approval_icon"
                width={100}
                height={100}
                className={`cursor-pointer w-auto h-4`}
                src={`${BUCKET_URL}/admin/isRestore.svg`}
              />
            </div>
          );
        },
      },
    ];
  } else if (status.reject) {
    columns = [
      {
        headerName: "Name",
        field: "name",
        filter: true,
        width: 150,
      },
      { headerName: "Company", field: "companyName", filter: true, width: 150 },
      {
        headerName: "Company Address",
        field: "companyAddress",
        filter: true,
        width: 250,
      },
      { headerName: "Email", field: "email", filter: true, width: 250 },
      { headerName: "Phone", field: "phone", filter: true, width: 150 },
      {
        field: "Restore To Request",
        filter: true,
        width: 130,
        renderCell: (params) => {
          return (
            <div className="flex flex-col items-start justify-center h-full">
              <Image
                onClick={() => restoreToRequest(params.row._id)}
                alt="approval_icon"
                width={100}
                height={100}
                className={`cursor-pointer w-auto h-4`}
                src={`${BUCKET_URL}/admin/isRestore.svg`}
              />
            </div>
          );
        },
      },
    ];
  } else {
    columns = [
      {
        headerName: "Name",
        field: "name",
        filter: true,
        width: 150,
      },
      { headerName: "Company", field: "companyName", filter: true, width: 150 },
      {
        headerName: "Company Address",
        field: "companyAddress",
        filter: true,
        width: 250,
      },
      { headerName: "Email", field: "email", filter: true, width: 250 },
      { headerName: "Phone", field: "phone", filter: true, width: 150 },
      {
        field: "Approve",
        filter: true,
        width: 130,
        renderCell: (params) => {
          return (
            <div className="flex flex-col items-start justify-center h-full">
              <Image
                onClick={() =>
                  approveExhibitor(params.row._id, params.row.email)
                }
                alt="approval_icon"
                width={100}
                height={100}
                className={`cursor-pointer w-auto h-4`}
                src={`${BUCKET_URL}/admin/isApproved.svg`}
              />
            </div>
          );
        },
      },
      {
        field: "Reject",
        filter: true,
        width: 130,
        renderCell: (params) => {
          return (
            <div className="flex flex-col items-start justify-center h-full">
              <Image
                alt="approval_icon"
                width={100}
                height={100}
                className={`cursor-pointer w-auto h-4`}
                src={`${BUCKET_URL}/admin/notApproved.svg`}
                onClick={() => rejectExhibitor(params.row._id)}
              />
            </div>
          );
        },
      },
    ];
  }

  const approveExhibitor = (id) => {
    updateExhibitorData({ id: id, data: { active: true, reject: false } });
  };
  const rejectExhibitor = (id) => {
    updateExhibitorData({ id: id, data: { active: false, reject: true } });
  };
  const blockExhibitor = (id) => {
    updateExhibitorData({ id: id, data: { active: true, blocked: true } });
  };
  const restoreExhibitor = (id) => {
    updateExhibitorData({ id: id, data: { active: true, blocked: false } });
  };
  const restoreToRequest = (id) => {
    updateExhibitorData({
      id: id,
      data: { active: false, blocked: false, reject: false },
    });
  };
  const queryClient = useQueryClient();
  const updateExhibitorsData = ({ id, data }) => {
    request({
      url: `admin/approve-exhibitor-child/${id}`,
      method: "put",
      data: data,
    });
  };
  const updateExhibitorApprovalMutation = useMutation({
    mutationFn: updateExhibitorsData,
    onSuccess: () => {
      queryClient.invalidateQueries("exhibitors-child-approval");
    },
  });

  const fetchExhibitorsChild = async () => {
    const queryString = new URLSearchParams(status).toString();
    return request({
      url: `admin/fetch-exhibitor-child?${queryString}`,
      method: "post",
      status,
    });
  };

  const {
    isLoading,
    data = [],
    isError,
    error,
  } = useQuery({
    queryKey: ["exhibitors-child-approval", status],
    queryFn: fetchExhibitorsChild,
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return <h2>Loading ...</h2>;
  }

  if (isError) {
    return <h2>{error.message}</h2>;
  }

  const updateExhibitorData = (id, data) => {
    updateExhibitorApprovalMutation.mutate(id, data);
  };

  return (
    <>
      <CommonDataTable
        columns={columns}
        rowData={data}
        filename={"Exhibitor-Approval"}
      />
    </>
  );
};

export default StallManagerApprovalComponent;
