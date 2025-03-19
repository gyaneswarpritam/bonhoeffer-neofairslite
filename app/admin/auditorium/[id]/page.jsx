"use client";
import AuditoriumListComponent from "@/components/admin/AuditoriumComponent/AuditoriumListComponent";
import { BUCKET_URL } from "@/config/constant";
import { request, requestObject } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

const Auditoriums = ({ params }) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  // Access the 'id' parameter from the URL
  const { id } = params;

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
      router.push("/admin/auditoriums");
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
      <div className="font-lato font-medium lg:w-[30%] w-full flex flex-col items-stretch">
        <Link href="/admin/auditoriums">
          <div className="flex flex-col items-center text-sm font-semibold cursor-pointer">
            <Image
              width={100}
              height={100}
              src={`${BUCKET_URL}/admin/back.svg`}
              className="w-7 h-auto mb-1"
              alt="back"
            />
            <p>Go Back</p>
          </div>
        </Link>
        <div className="divider"></div>
        <AuditoriumListComponent addMoreListStatus={() => setAddMore(false)} />
      </div>

      <div className="lg:w-[70%] w-full p-4">
        <div className="flex flex-col items-start text-sm font-semibold px-5">
          <p className="text-base">Edit Auditorium</p>
          <p className="font-normal text-accent-font-color">
            Edit your Auditorium informations
          </p>
        </div>
        <div className="divider w-[100%] mt-2"></div>

        <div className="px-5 pt-2 pb-5 min-h-[80vh] max-h-[80vh] flex flex-col items-start justify-start bg-[#F5F5F5] rounded-lg">
          <form className="w-full" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="input-type-1">
              <div className="label">Title</div>
              <input
                placeholder="Enter your Title"
                name="url"
                type="text"
                {...register("url", { required: true })}
              />
              {errors.url && <span>This field is required</span>}
            </div>

            <input
              type="submit"
              value="Update Auditorium"
              name="submit"
              className="cursor-pointer font-lato text-base font-bold text-white bg-static-black rounded-lg px-10 py-3 mt-10 md:w-min w-full"
            />
          </form>
        </div>
      </div>
    </section>
  );
};

export default Auditoriums;
