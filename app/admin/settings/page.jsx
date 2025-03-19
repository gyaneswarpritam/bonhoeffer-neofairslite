"use client";
import dynamic from "next/dynamic";
import SettingsListComponent from "@/components/admin/SettingsComponent/SettingsListComponent";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { request } from "@/lib/axios";
import { getTimezonesWithGMT } from "@/lib/timezones";
import "react-quill/dist/quill.snow.css";
import MeetingConfig from "@/components/admin/MeetingConfig";
import { toast } from "react-toastify";

// Dynamically import ReactQuill for client-side rendering only
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function Settings() {
  const timeZones = getTimezonesWithGMT();
  const [message, setMessage] = useState("");
  const [dataLength, setDataLength] = useState(0);
  const [settingStateData, setSettingStateData] = useState({});

  const fetchSetting = async () => {
    return request({ url: "admin/settings", method: "get" });
  };

  const { isLoading, data: settingData } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSetting,
  });

  useEffect(() => {
    if (settingData && settingData.length > 0) {
      setSettingStateData(settingData[0]);
      setMessage(settingData[0].blockMessage);
    }
  }, [settingData]);

  const handleContentChange = (contentState) => {
    setMessage(contentState);
  };

  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({});

  const {
    mutate: createSettings,
    isLoading: loadingCreate,
    isError,
    error,
  } = useMutation({
    mutationFn: (data) => {
      return request({ url: "admin/settings", method: "post", data });
    },
    onError: (error) => {
      console.log(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("settings");
    },
  });

  const onSubmit = async (data) => {
    if (Object.keys(data).length) {
      const inputData = { ...data };
      await createSettings(inputData);
      reset();
    }
  };

  const blockVisitorLogin = async (settingId, status) => {
    await request({
      url: `admin/settings/${settingId}`,
      method: "put",
      data: { blockVisitorLogin: !status },
    });
    queryClient.invalidateQueries("settings");
  };

  const blockExhibitorLogin = async (settingId, status) => {
    await request({
      url: `admin/settings/${settingId}`,
      method: "put",
      data: { blockExhibitorLogin: !status },
    });
    queryClient.invalidateQueries("settings");
  };

  const resetInauguration = async (settingId, status) => {
    await request({
      url: `admin/settings/${settingId}`,
      method: "put",
      data: { inauguration: !status },
    });
    queryClient.invalidateQueries("settings");
  };

  const saveBlockMessage = async (settingId) => {
    await request({
      url: `admin/settings/${settingId}`,
      method: "put",
      data: { blockMessage: message },
    });
    toast.success("Block Message updated successfully", {
      position: toast.POSITION.TOP_RIGHT,
    });
    queryClient.invalidateQueries("settings");
  };

  if (loadingCreate) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <h2>{error.message}</h2>;
  }

  return (
    <section className="flex lg:flex-row flex-col items-stretch justify-between">
      <div className="font-lato font-medium lg:w-[30%] w-full flex flex-col items-stretch">
        <div className="text-static-black font-semibold text-xl ml-10 mb-1">
          Settings
        </div>
        <div className="divider mt-1 mb-1"></div>
        <div className="px-3 flex lg:flex-row flex-col items-start justify-between">
          <div className="px-3 pt-2 pb-5 min-h-[60vh] w-full flex flex-col items-start justify-start bg-[#F5F5F5] rounded-lg">
            <form
              className="w-full"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div className="input-type-1">
                <div className="label">Fair Name</div>
                <input
                  type="text"
                  placeholder="Enter Fair Name"
                  name="fairName"
                  {...register("fairName")}
                />
              </div>
              <div className="input-type-1">
                <div className="label">Location</div>
                <input
                  type="text"
                  placeholder="Enter Location"
                  name="location"
                  {...register("location")}
                />
              </div>
              <div className="input-type-1">
                <div className="label">Country</div>
                <input
                  type="text"
                  placeholder="Enter Country"
                  name="country"
                  {...register("country")}
                />
              </div>
              <div className="input-type-1">
                <div className="label">Fair Start Date</div>
                <input
                  type="datetime-local"
                  name="startDateTime"
                  {...register("startDateTime")}
                />
              </div>
              <div className="input-type-1">
                <div className="label">Fair End Date</div>
                <input
                  type="datetime-local"
                  name="endDateTime"
                  {...register("endDateTime")}
                />
              </div>
              <div className="input-type-1">
                <div className="label">Timezone</div>
                <select name="timezone" {...register("timezone")}>
                  {timeZones &&
                    timeZones.map((tz, index) => (
                      <option key={index} value={tz.timezone}>
                        {tz.timezone} ({tz.gmt})
                      </option>
                    ))}
                </select>
              </div>
              <div className="input-type-1">
                <div className="label">Meeting Duration</div>
                <input
                  type="text"
                  placeholder="Enter Duration"
                  name="duration"
                  {...register("duration")}
                />
              </div>
              <input
                disabled={dataLength > 0}
                type="submit"
                value="Add Settings"
                name="submit"
                className={`cursor-pointer font-lato text-base font-bold text-white ${
                  dataLength > 0 ? "bg-accent-font-color" : "bg-static-black"
                } rounded-lg px-10 py-3 mt-10 md:w-min w-full`}
              />
            </form>
          </div>
        </div>
      </div>

      <div className="lg:w-[70%] w-full p-4">
        <SettingsListComponent totalRecord={(res) => setDataLength(res)} />
        <div className="pt-5 pb-5 flex flex-col items-start bg-color[#f5f5f5] justify-start rounded-lg">
          <div>
            {settingStateData && settingStateData.blockVisitorLogin ? (
              <input
                onClick={() =>
                  blockVisitorLogin(
                    settingStateData._id,
                    settingStateData.blockVisitorLogin
                  )
                }
                type="button"
                value="Open Visitor Login"
                name="submit"
                className="cursor-pointer mr-2 font-lato text-base font-bold text-white bg-static-black rounded-lg px-4 py-2 mt-10 mb-4 md:w-min w-full"
              />
            ) : (
              <input
                onClick={() =>
                  blockVisitorLogin(
                    settingStateData._id,
                    settingStateData.blockVisitorLogin
                  )
                }
                type="button"
                value="Block Visitor Login"
                name="submit"
                className="cursor-pointer mr-2 font-lato text-base font-bold text-white bg-static-black rounded-lg px-4 py-2 mt-10 mb-4 md:w-min w-full"
              />
            )}

            {settingStateData && settingStateData.blockExhibitorLogin ? (
              <input
                onClick={() =>
                  blockExhibitorLogin(
                    settingStateData._id,
                    settingStateData.blockExhibitorLogin
                  )
                }
                type="button"
                value="Open Exhibitor Login"
                name="submit"
                className="cursor-pointer mr-2 font-lato text-base font-bold text-white bg-static-black rounded-lg px-4 py-2 mt-10 mb-4 md:w-min w-full"
              />
            ) : (
              <input
                onClick={() =>
                  blockExhibitorLogin(
                    settingStateData._id,
                    settingStateData.blockExhibitorLogin
                  )
                }
                type="button"
                value="Block Exhibitor Login"
                name="submit"
                className="cursor-pointer mr-2 font-lato text-base font-bold text-white bg-static-black rounded-lg px-4 py-2 mt-10 mb-4 md:w-min w-full"
              />
            )}

            {settingStateData && settingStateData.inauguration ? (
              <input
                onClick={() =>
                  resetInauguration(
                    settingStateData._id,
                    settingStateData.inauguration
                  )
                }
                type="button"
                value="Reset Inauguration"
                name="submit"
                className="cursor-pointer mr-2 font-lato text-base font-bold text-white bg-static-black rounded-lg px-4 py-2 mt-10 mb-4 md:w-min w-full"
              />
            ) : (
              <input
                onClick={() =>
                  resetInauguration(
                    settingStateData._id,
                    settingStateData.inauguration
                  )
                }
                type="button"
                value="Inaugurate Fair"
                name="submit"
                className="cursor-pointer mr-2 font-lato text-base font-bold text-white bg-static-black rounded-lg px-4 py-2 mt-10 mb-4 md:w-min w-full"
              />
            )}
          </div>

          {/* ReactQuill editor for block message */}
          <div className="w-full">
            <ReactQuill value={message} onChange={handleContentChange} />
            <button
              onClick={() => saveBlockMessage(settingStateData._id)}
              className="cursor-pointer font-lato text-base font-bold text-white bg-static-black rounded-lg px-10 py-3 mt-10 "
            >
              Save Block Message
            </button>
          </div>
        </div>
        <MeetingConfig settingStateData={settingStateData} />
      </div>
    </section>
  );
}
