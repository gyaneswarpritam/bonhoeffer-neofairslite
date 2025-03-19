"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { request } from "@/lib/axios";
import SettingsListComponent from "@/components/admin/SettingsComponent/SettingsListComponent";
import { useRouter } from "next/navigation";
import { getTimezonesWithGMT } from "@/lib/timezones";
import { convertDateTime } from "@/lib/dayjs";

export default function Settings({ params }) {
  const timeZones = getTimezonesWithGMT();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = params;

  const fetchSettingsById = async (id) => {
    return await request({ url: `admin/settings/${id}`, method: "get" });
  };

  const { data: settingsRes, isLoading: isLoadingSettings } = useQuery({
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
  } = useForm({});

  // Set form values when settingsRes is loaded
  useEffect(() => {
    if (settingsRes) {
      // Format the date to 'YYYY-MM-DDTHH:mm' for datetime-local inputs
      const formattedStartDateTime = convertDateTime(settingsRes.startDateTime);
      const formattedEndDateTime = convertDateTime(settingsRes.endDateTime);
      setValue("startDateTime", formattedStartDateTime);
      setValue("endDateTime", formattedEndDateTime);
      setValue("timezone", settingsRes.timezone);
      setValue("duration", settingsRes.duration);
      setValue("fairName", settingsRes.fairName);
      setValue("location", settingsRes.location);
      setValue("country", settingsRes.country);
    }
  }, [settingsRes, setValue]);

  const {
    mutate: updateSettings,
    isLoading: loadingUpdate,
    isError,
    error,
  } = useMutation({
    mutationFn: async (data) => {
      const inputData = { ...data };
      return await request({
        url: `admin/settings/${id}`,
        method: "put",
        data: inputData,
      });
    },
    onError: (error) => {
      console.log(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("settings");
      router.push("/admin/settings");
    },
  });

  const onSubmit = async (data) => {
    if (Object.keys(data).length) {
      await updateSettings(data);
      reset();
    }
  };

  if (loadingUpdate || isLoadingSettings) {
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
                  {timeZones.map((tz, index) => (
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
                type="submit"
                value="Update Settings"
                name="submit"
                className={`cursor-pointer font-lato text-base font-bold text-white bg-static-black rounded-lg px-10 py-3 mt-10 md:w-min w-full`}
              />
            </form>
          </div>
        </div>
      </div>

      <div className="lg:w-[70%] w-full p-4">
        <SettingsListComponent totalRecord={(res) => {}} />
      </div>
    </section>
  );
}
