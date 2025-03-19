"use client";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { request } from "@/lib/axios";
import { formatDateTime } from "@/lib/dayjs";
import Image from "next/image";
import { BUCKET_URL } from "@/config/constant";
import "./SettingsListComponent.css";
import SettingEditComponent from "./SettingEditComponent";
import CommonDataTable from "@/components/grid/CommonDataTable";

const SettingsListComponent = ({ totalRecord }) => {
  const [editSetting, setEditSetting] = useState(null); // state for the setting to be edited

  const fetchSetting = async () => {
    return request({ url: "admin/settings", method: "get" });
  };

  const {
    isLoading,
    data = [],
    isError,
    error,
  } = useQuery({
    queryKey: ["settings-list"],
    queryFn: fetchSetting,
  });

  const columns = [
    {
      headerName: "Fair Name",
      field: "fairName",
      width: 200,
    },
    {
      headerName: "Location",
      field: "location",
      width: 200,
    },
    {
      headerName: "Country",
      field: "country",
      width: 200,
    },
    {
      headerName: "Start Date & Time",
      field: "startDateTime",
      width: 200,
      renderCell: (params) => {
        const formattedDate = formatDateTime(params.value);
        return <span>{formattedDate}</span>;
      },
    },
    {
      headerName: "End Date & Time",
      field: "endDateTime",
      width: 200,
      renderCell: (params) => {
        const formattedDate = formatDateTime(params.value);
        return <span>{formattedDate}</span>;
      },
    },
    {
      headerName: "Timezone",
      field: "timezone",
      width: 140,
    },
    {
      headerName: "Duration",
      field: "duration",
      width: 140,
    },
    {
      headerName: "Edit",
      field: "_id",
      width: 150,
      renderCell: (params) => {
        return (
          <div
            onClick={() => handleEditClick(params.value)} // Open modal when clicked
            className="rounded-full aspect-square flex flex-col items-center justify-center bg-brand-color h-7 cursor-pointer"
          >
            <Image
              width={100}
              alt="edit_icon"
              height={100}
              src={`${BUCKET_URL}/admin/edit.svg`}
              className="h-4 w-auto"
            />
          </div>
        );
      },
    },
  ];

  const handleEditClick = (id) => {
    const settingToEdit = data.find((setting) => setting._id === id);
    setEditSetting(settingToEdit); // Set the setting to be edited
  };

  const closeModal = () => {
    setEditSetting(null); // Close the modal
  };

  return (
    <>
      <CommonDataTable columns={columns} rowData={data} filename={"Setting"} />

      {/* Modal for editing */}
      {editSetting && (
        <div className="modal">
          <div className="modal-content">
            <SettingEditComponent
              id={editSetting?._id}
              closeModal={closeModal}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsListComponent;
