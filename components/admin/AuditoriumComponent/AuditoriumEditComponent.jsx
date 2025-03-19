"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { request, requestObject } from "@/lib/axios";

export default function AuditoriumEditComponent({ id, closeModal }) {
  const queryClient = useQueryClient();
  // Function to fetch auditorium data by ID
  const fetchAuditoriumById = async (id) => {
    try {
      const response = await requestObject({
        url: `admin/auditorium/${id}`,
        method: "get",
      });
      return response.data || {}; // Ensure it never returns undefined
    } catch (error) {
      console.error("Error fetching auditorium data:", error);
      return {}; // Return an empty object in case of error
    }
  };

  // Use query to fetch auditorium data if in edit mode
  const {
    data: auditoriumData,
    isLoading: isLoadingAuditorium,
    error: fetchError,
  } = useQuery({
    queryKey: ["auditoriumById", id],
    queryFn: () => fetchAuditoriumById(id),
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({});

  // Use useEffect to set form values if in edit mode
  useEffect(() => {
    if (auditoriumData) {
      setValue("url", auditoriumData.url || "");
    }
  }, [auditoriumData]);

  const {
    mutate: updateAuditorium,
    isLoading: loadingUpdate,
    isError,
    error: updateError,
  } = useMutation({
    mutationFn: async (requestData) => {
      try {
        const response = await request({
          url: `admin/auditorium/${id}`,
          method: "put",
          data: requestData,
        });
        return response.data;
      } catch (error) {
        console.error("Error updating auditorium data:", error);
        throw error;
      }
    },
    onError: (error) => {
      console.log(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("auditoriums");
      queryClient.invalidateQueries(["auditoriumById", id]);
      closeModal();
    },
  });

  const onSubmit = (requestData) => {
    if (Object.keys(requestData).length) {
      const inputData = { ...requestData };
      updateAuditorium(inputData);
    }
  };

  if (isLoadingAuditorium || loadingUpdate) {
    return <h2>Loading...</h2>;
  }

  if (fetchError) {
    return <h2>{fetchError.message}</h2>;
  }

  if (isError) {
    return <h2>{updateError.message}</h2>;
  }

  return (
    <section className="flex lg:flex-row flex-col items-stretch justify-between">
      <div className="font-lato font-medium w-full flex flex-col items-stretch">
        <div className="text-static-black font-semibold text-xl ml-10 mb-1">
          Edit Auditorium
        </div>
        <div className="divider mt-1 mb-1"></div>
        <div className="px-3 flex lg:flex-row flex-col items-start justify-between">
          <div className="px-3 pt-2 pb-5 min-h-[60vh] w-full flex flex-col items-start justify-start bg-[#F5F5F5] rounded-lg">
            <form className="w-full" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="input-type-1">
                <div className="label">Video Url</div>
                <input
                  placeholder="Enter your Title"
                  name="url"
                  type="text"
                  {...register("url", { required: true })}
                />
                {errors.url && <span>Video Url is required</span>}
              </div>

              <input
                type="submit"
                value="Update Auditorium"
                name="submit"
                className="cursor-pointer font-lato text-base font-bold text-white bg-static-black rounded-lg px-10 py-3"
              />
              <button
                type="button"
                onClick={closeModal}
                className="cursor-pointer font-lato text-base font-bold text-white bg-static-black rounded-lg px-10 py-3"
              >
                Close
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
