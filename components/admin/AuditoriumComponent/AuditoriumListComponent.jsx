"use client";
import VideoModal from "@/components/VideoModal";
import { BUCKET_URL } from "@/config/constant";
import { request } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const AuditoriumListComponent = () => {
  const queryClient = useQueryClient();
  const [modelOpen, setModelOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState(false);

  const fetchAuditoriums = async () => {
    return request({
      url: "admin/auditorium",
      method: "get",
    });
  };

  const {
    isLoading,
    data = [],
    isError,
    error,
  } = useQuery({
    queryKey: ["auditoriums"],
    queryFn: fetchAuditoriums,
    //refetchOnWindowFocus: true,
  });

  const deleteAuditoriumsData = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this auditorium?"
    );
    if (confirmDelete) {
      request({
        url: `admin/auditorium/${id}`,
        method: "delete",
        data: {},
      });
    }
  };
  const deleteHallMutation = useMutation({
    mutationFn: deleteAuditoriumsData,
    onSuccess: () => {
      queryClient.invalidateQueries("auditoriums");
    },
  });
  if (isLoading) {
    return <h2>Loading ...</h2>;
  }

  if (isError) {
    return <h2>{error.message}</h2>;
  }

  const deleteAuditoriumData = (id) => {
    deleteHallMutation.mutate(id);
  };
  const showVideo = (url) => {
    setVideoUrl(url);
    setModelOpen(true);
  };

  const handleModelClose = (e) => {
    document.getElementsByTagName("body")[0].style.overflow = "unset";
    setModelOpen(false);
  };
  return data && data.length ? (
    data.map((res) => (
      <div className="px-10 flex flex-col items-start" key={res._id}>
        <Image
          width={100}
          height={100}
          src={`${BUCKET_URL}/admin/video.svg`}
          alt="document"
          className="h-12 mt-5 w-auto"
          onClick={() => showVideo(res.url)}
        />
        <div className="flex flex-row items-center justify-between w-full mt-2">
          <div className="w-2/3 flex flex-row items-center justify-start">
            <div className="text-base font-semibold text-static-black">
              <div className="text-xs font-medium text-accent-font-color font-quickSand"></div>
            </div>
          </div>
          <div className="flex flex-row items-center w-1/3 justify-between">
            <div
              className="rounded-full aspect-square flex flex-col items-center justify-center bg-brand-color h-7 cursor-pointer"
              onClick={() => deleteAuditoriumData(res._id)}
            >
              <Image
                width={100}
                height={100}
                alt="delete_icon"
                src={`${BUCKET_URL}/admin/delete.svg`}
                className="h-4 w-auto"
              />
            </div>
            <Link href={`/admin/auditoriums/${res._id}`}>
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
          </div>
        </div>
        <div className="divider w-full h-[1px]"></div>
        {modelOpen ? (
          <VideoModal
            title={"Auditorium Video"}
            videoUrl={videoUrl}
            handleModelClose={handleModelClose}
          />
        ) : (
          ""
        )}
      </div>
    ))
  ) : (
    <></>
  );
};

export default AuditoriumListComponent;
