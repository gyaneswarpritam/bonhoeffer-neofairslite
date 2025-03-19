"use client";
import { request } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { dayjsFormat, formatDateTime } from "@/lib/dayjs";
import TableMain from "../tableMain";
import Image from "next/image";
import Link from "next/link";
import { BUCKET_URL } from "@/config/constant";

const SettingsListComponent = ({ totalRecord }) => {
  const fetchSetting = async () => {
    return request({ url: "admin/settings", method: "get" });
  };

  const {
    isLoading,
    data = [],
    isError,
    error,
  } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSetting,
    //refetchOnWindowFocus: true,
  });

  const queryClient = useQueryClient();
  const deleteSettingsData = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this setting?"
    );
    if (confirmDelete) {
      request({
        url: `admin/settings/${id}`,
        method: "delete",
        data: {},
      });
    }
  };
  const deleteSettingMutation = useMutation({
    mutationFn: deleteSettingsData,
    onSuccess: () => {
      queryClient.invalidateQueries("settings");
    },
  });

  if (isLoading) {
    return <h2>Loading ...</h2>;
  }

  if (isError) {
    return <h2>{error.message}</h2>;
  }

  if (data && data.length > 0) {
    totalRecord(data.length);
  }

  const deleteSettingData = (id) => {
    deleteSettingMutation.mutate(id);
  };

  const columns = [
    {
      headerName: "Fair Name",
      field: "fairName",
      filter: true,
      width: 200,
    },
    {
      headerName: "Location",
      field: "location",
      filter: true,
      width: 200,
    },
    {
      headerName: "Country",
      field: "country",
      filter: true,
      width: 200,
    },
    {
      headerName: "Start Date & Time",
      field: "startDateTime",
      filter: true,
      width: 200,
      cellRenderer: (params) => {
        const formattedDate = formatDateTime(params.value);
        return <span>{formattedDate}</span>;
      },
    },
    {
      headerName: "End Date & Time",
      field: "endDateTime",
      filter: true,
      width: 200,
      cellRenderer: (params) => {
        const formattedDate = formatDateTime(params.value);
        return <span>{formattedDate}</span>;
      },
    },
    {
      headerName: "Timezone",
      field: "timezone",
      filter: true,
      width: 140,
    },
    {
      headerName: "Duration",
      field: "duration",
      filter: true,
      width: 140,
    },
    {
      headerName: "Edit",
      field: "_id",
      width: 150,
      cellRenderer: (params) => {
        return (
          <Link href={`/admin/settings/${params.value}`}>
            <div className="rounded-full aspect-square flex flex-col items-center justify-center bg-brand-color h-7 cursor-pointer">
              <Image
                width={100}
                alt="edit_icon"
                height={100}
                src={`${BUCKET_URL}/admin/edit.svg`}
                className="h-4 w-auto"
              />
            </div>
          </Link>
        );
      },
    },
  ];
  return data && data.length ? (
    <TableMain columnDefs={columns} rowData={data} filename={"Setting"} />
  ) : (
    <TableMain columnDefs={columns} rowData={[]} filename={"Setting"} />
  );
};

export default SettingsListComponent;
