import { request } from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

function MeetingConfig({ settingStateData }) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      meetingType: settingStateData.meetingType || "defaultVideo",
      customVideoLink: settingStateData.customVideoLink || "",
    },
  });

  useEffect(() => {
    // Reset the form when the settingStateData changes
    reset({
      meetingType: settingStateData.meetingType || "defaultVideo",
      customVideoLink: settingStateData.customVideoLink || "",
    });
  }, [settingStateData, reset]);

  // Function to handle form submission
  const saveMeetingConfiguration = async (settingId, meetingConfigData) => {
    await request({
      url: `admin/settings/${settingId}`,
      method: "put",
      data: meetingConfigData,
    });
    toast.success("Meeting Configuration updated successfully", {
      position: toast.POSITION.TOP_RIGHT,
    });
    queryClient.invalidateQueries("settings");
  };

  return (
    <div className="pt-5 pb-5 flex flex-col items-start bg-color[#f5f5f5] justify-start rounded-lg">
      <form
        className="w-full mt-4"
        onSubmit={handleSubmit((data) => {
          const meetingConfigData = {
            meetingType: data.meetingType,
            customVideoLink:
              data.meetingType === "customVideo" ? data.customVideoLink : "",
          };
          saveMeetingConfiguration(settingStateData._id, meetingConfigData);
        })}
      >
        <div className="input-type-1">
          <label className="font-semibold">Choose Meeting Type</label>
          <div className="flex items-center mt-2">
            <label className="mr-4">
              <input
                type="radio"
                value="defaultVideo"
                {...register("meetingType")}
                className="mr-1"
              />
              Default Video
            </label>
            <label>
              <input
                type="radio"
                value="customVideo"
                {...register("meetingType")}
                className="mr-1"
              />
              Custom Video Link
            </label>
          </div>
        </div>

        {watch("meetingType") === "customVideo" && (
          <div className="input-type-1 mt-4">
            <label className="font-semibold">Custom Video Link</label>
            <input
              type="url"
              placeholder="Enter Custom Video Link"
              {...register("customVideoLink")}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        )}

        <input
          type="submit"
          value="Update"
          className="cursor-pointer font-lato text-base font-bold text-white bg-static-black rounded-lg px-10 py-3 mt-6"
        />
      </form>
    </div>
  );
}

export default MeetingConfig;
