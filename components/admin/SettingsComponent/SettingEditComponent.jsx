"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { request } from "@/lib/axios";
import { getTimezonesWithGMT } from "@/lib/timezones";
import { convertDateTime } from "@/lib/dayjs";

export default function SettingEditComponent({ id, closeModal }) {
  const timeZones = getTimezonesWithGMT();
  const queryClient = useQueryClient();

  const fetchSettingsById = async (id) => {
    return await request({ url: `admin/settings/${id}`, method: "get" });
  };

  const {
    data: settingsRes,
    isLoading: isLoadingSettings,
    isError,
    error,
  } = useQuery({
    queryKey: ["settingsResById", id],
    queryFn: () => fetchSettingsById(id),
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  // Populate form values when settings data is fetched
  useEffect(() => {
    if (settingsRes) {
      setValue(
        "startDateTime",
        (settingsRes?.startDateTime &&
          convertDateTime(settingsRes?.startDateTime)) ||
        ""
      );
      setValue(
        "endDateTime",
        (settingsRes?.endDateTime &&
          convertDateTime(settingsRes?.endDateTime)) ||
        ""
      );
      setValue("timezone", settingsRes.timezone || "");
      setValue("duration", settingsRes.duration || "");
      setValue("fairName", settingsRes.fairName || "");
      setValue("location", settingsRes.location || "");
      setValue("country", settingsRes.country || "");
    }
  }, [settingsRes, setValue]);

  const { mutate: updateSettings, isLoading: loadingUpdate } = useMutation({
    mutationFn: async (data) => {
      return await request({
        url: `admin/settings/${id}`,
        method: "put",
        data,
      });
    },
    onError: (error) => {
      console.error("Update failed:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("settings");
      closeModal();
    },
  });

  const onSubmit = async (data) => {
    await updateSettings(data);
    reset();
  };

  if (isLoadingSettings) {
    return <h2>Loading settings...</h2>;
  }

  if (isError) {
    return <h2>Error loading settings: {error.message}</h2>;
  }

  return (
    <section className="flex lg:flex-row flex-col items-stretch justify-between">
      <div className="font-lato font-medium w-full flex flex-col items-stretch">
        <div className="text-static-black font-semibold text-xl ml-10 mb-1">
          Settings
        </div>
        <div className="divider mt-1 mb-1"></div>
        <div className="px-3 flex lg:flex-row flex-col items-start justify-between">
          <div className="px-3 pt-2 pb-5 min-h-[60vh] w-full flex flex-col items-start justify-start bg-[#F5F5F5] rounded-lg">
            <form
              className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div className="input-type-1 input-new">
                <label className="label">Fair Name</label>
                <input
                  type="text"
                  placeholder="Enter Fair Name"
                  {...register("fairName", {
                    required: "Fair Name is required",
                  })}
                />
                {errors.fairName && (
                  <span className="text-red-500">
                    {errors.fairName.message}
                  </span>
                )}
              </div>

              <div className="input-type-1 input-new">
                <label className="label">Location</label>
                <input
                  type="text"
                  placeholder="Enter Location"
                  {...register("location", {
                    required: "Location is required",
                  })}
                />
                {errors.location && (
                  <span className="text-red-500">
                    {errors.location.message}
                  </span>
                )}
              </div>

              <div className="input-type-1 input-new">
                <label className="label">Country</label>
                <input
                  type="text"
                  placeholder="Enter Country"
                  {...register("country", { required: "Country is required" })}
                />
                {errors.country && (
                  <span className="text-red-500">{errors.country.message}</span>
                )}
              </div>

              <div className="input-type-1 input-new">
                <label className="label">Fair Start Date</label>
                <input
                  type="datetime-local"
                  {...register("startDateTime", {
                    required: "Start date is required",
                  })}
                />
                {errors.startDateTime && (
                  <span className="text-red-500">
                    {errors.startDateTime.message}
                  </span>
                )}
              </div>

              <div className="input-type-1 input-new">
                <label className="label">Fair End Date</label>
                <input
                  type="datetime-local"
                  {...register("endDateTime", {
                    required: "End date is required",
                  })}
                />
                {errors.endDateTime && (
                  <span className="text-red-500">
                    {errors.endDateTime.message}
                  </span>
                )}
              </div>

              <div className="input-type-1 input-new">
                <label className="label">Timezone</label>
                <select
                  {...register("timezone", {
                    required: "Timezone is required",
                  })}
                >
                  {timeZones.map((tz, index) => (
                    <option key={index} value={tz.timezone}>
                      {tz.timezone} ({tz.gmt})
                    </option>
                  ))}
                </select>
                {errors.timezone && (
                  <span className="text-red-500">
                    {errors.timezone.message}
                  </span>
                )}
              </div>

              <div className="input-type-1 input-new">
                <label className="label">Meeting Duration</label>
                <input
                  type="text"
                  placeholder="Enter Duration"
                  {...register("duration", {
                    required: "Duration is required",
                  })}
                />
                {errors.duration && (
                  <span className="text-red-500">
                    {errors.duration.message}
                  </span>
                )}
              </div>

              <div className="col-span-2 flex justify-center gap-4">
                <button
                  type="submit"
                  className="cursor-pointer font-lato text-base font-bold text-white bg-static-black rounded-lg px-10 py-3"
                >
                  Update Settings
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="cursor-pointer font-lato text-base font-bold text-white bg-static-black rounded-lg px-10 py-3"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
