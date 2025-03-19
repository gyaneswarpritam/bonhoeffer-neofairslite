import { BUCKET_URL } from "@/config/constant";
import Image from "next/image";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "@/lib/axios";
import Uploading from "@/components/uploading";

const StallVideo = ({
  stallVideo,
  stallVideoList,
  handleOpenStallVideoModel,
  openViewModel,
  deleteStallVideo,
  editStallVideo,
  setEditStallVideo,
  openVideoModel,
}) => {
  const queryClient = useQueryClient();
  const [loadLock, setLoadLock] = useState(false);

  const { mutate: deleteGalleyImage, isLoading: loadingGalleryImage } =
    useMutation({
      mutationFn: (id) => {
        return request({
          url: `exhibitor/stall-video/${id}`,
          method: "delete",
        });
      },
      onError: (error) => {
        setLoadLock(false);
        console.log("Update Error:", error);
      },
      onSuccess: () => {
        setLoadLock(false);
        queryClient.invalidateQueries("products");
      },
    });

  const deleteHandle = (product) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmed == true) {
      setLoadLock(true);
      deleteGalleyImage(product._id);
    }
  };
  return stallVideoList && stallVideoList.length > 0 && editStallVideo ? (
    <div className="w-full flex flex-col gap-4 ">
      <div
        className="border-b-[1px] flex justify-end cursor-pointer"
        onClick={() => setEditStallVideo(false)}
      >
        Add More{" "}
        <Image
          alt="img"
          height={100}
          width={100}
          className="w-5 h-auto cursor-pointer"
          src={`${BUCKET_URL}/stalls/plus.svg`}
        ></Image>
      </div>
      {loadLock ? (
        <Uploading />
      ) : (
        <div className=" flex flex-col gap-5   max-h-[20rem] innerbottomshadow  overflow-auto">
          {stallVideoList.map((item, index) => {
            return (
              <div
                key={index}
                className=" w-full flex flex-row gap-4 justify-between items-center h-10 border-2 border-[#2a9fe8] font-lato text-lg font-medium p-5 rounded-lg cursor-pointer"
              >
                <Image
                  alt="img"
                  height={100}
                  width={100}
                  className=" w-5 h-auto cursor-pointer"
                  src={`${BUCKET_URL}/stalls/playicon.png`}
                  onClick={() => openVideoModel(item.url, item.title)}
                  unoptimized
                ></Image>
                <p className=" font-lato font-semibold text-lg">{item.title}</p>
                <Image
                  alt="img"
                  height={100}
                  width={100}
                  className=" w-5 h-auto cursor-pointer"
                  src={`${BUCKET_URL}/stalls/remove.svg`}
                  onClick={() => deleteHandle(item)}
                ></Image>
              </div>
            );
          })}
        </div>
      )}
    </div>
  ) : (
    <div className="w-full flex flex-col gap-4 ">
      <div
        className="border-b-[1px] flex justify-end cursor-pointer"
        onClick={() => setEditStallVideo(true)}
      >
        Cancel
      </div>
      <div
        onClick={(e) => handleOpenStallVideoModel("stall")}
        className=" w-full h-10 bg-black text-white text-lg  rounded-lg font-lato flex justify-center items-center cursor-pointer"
      >
        <p className=" text-center ">Click to add</p>
      </div>
      <div className=" flex flex-col gap-5 overflow-auto   max-h-[20rem] innerbottomshadow ">
        {stallVideo.map((item, index) => {
          return (
            <div
              key={index}
              className=" w-full flex flex-row gap-4 justify-between items-center h-10 border-2 border-[#2a9fe8] font-lato text-lg font-medium p-5 rounded-lg cursor-pointer"
            >
              <Image
                alt="img"
                height={100}
                width={100}
                className=" w-5 h-auto cursor-pointer"
                src={`${BUCKET_URL}/stalls/playicon.png`}
                onClick={() => openViewModel(index, "stall")}
                unoptimized
              ></Image>
              <p className=" font-lato font-semibold text-lg">{item.title}</p>
              <Image
                alt="img"
                height={100}
                width={100}
                className=" w-5 h-auto cursor-pointer"
                src={`${BUCKET_URL}/stalls/remove.svg`}
                onClick={() => deleteStallVideo(index, "stall")}
              ></Image>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StallVideo;
