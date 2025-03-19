"use client";
import AuditoriumListComponent from "@/components/admin/AuditoriumComponent/AuditoriumListComponent";
import { BUCKET_URL } from "@/config/constant";
import { request } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function Auditorium() {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({});

  const {
    mutate: createAuditorium,
    isLoading: loadingCreate,
    isError,
    error,
  } = useMutation({
    mutationFn: (data) => {
      return request({ url: "admin/auditorium", method: "post", data });
    },
    onError: (error) => {
      console.log(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("auditoriums");
    },
  });

  const onSubmit = async (data) => {
    if (Object.keys(data).length) {
      const inputData = { ...data };
      await createAuditorium(inputData);
      reset();
    }
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
        <div className="flex flex-col items-center text-sm font-semibold cursor-pointer">
          <Image
            width={100}
            height={100}
            src={`${BUCKET_URL}/admin/back.svg`}
            alt="back_icon"
            className="w-7 h-auto mb-1"
          />
          <p>Go Back</p>
        </div>
        <div className="divider"></div>
        <AuditoriumListComponent />
      </div>

      <div className="lg:w-[70%] w-full p-4">
        <div className="flex flex-col items-start text-sm font-semibold px-5">
          <p className="text-base">Add Auditorium Video</p>
          <p className="font-normal text-accent-font-color">
            Add your Auditorium Video Information
          </p>
        </div>
        <div className="divider w-[100%] mt-2"></div>

        <div className="px-5 pt-2 pb-5 min-h-[80vh] max-h-[80vh] flex flex-col items-start justify-start bg-[#F5F5F5] rounded-lg">
          <form className="w-full" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="input-type-1">
              <input
                placeholder="Add your Video URL"
                name="url"
                type="text"
                {...register("url")}
              />
            </div>

            <input
              type="submit"
              value="Add Auditorium Video"
              name="submit"
              className="cursor-pointer font-lato text-base font-bold text-white bg-static-black rounded-lg px-10 py-3 mt-10 md:w-min w-full"
            />
          </form>
        </div>
      </div>
    </section>
  );
}
