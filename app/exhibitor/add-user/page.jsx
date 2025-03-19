"use client";
import "../../globals.css";
import React, { useState } from "react";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import { Controller, useForm } from "react-hook-form";
import { request } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CommonDataTableView from "@/components/grid/CommonDataTableView";
import Image from "next/image";
import { BUCKET_URL } from "@/config/constant";

const Page = () => {
  const exhibitorId =
    typeof window !== "undefined" ? localStorage.getItem("id") : null;
  const queryClient = useQueryClient();
  const [addUserModal, setAddUserModal] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const [process, setProcess] = useState(false);

  const {
    mutate: createChildUser,
    isLoading: loadingCreate,
    isError,
    error,
  } = useMutation({
    mutationFn: (resData) => {
      const userData = {
        ...resData, exhibitor: exhibitorId
      }
      return request({ url: "exhibitor/add-user", method: "post", data: userData });
    },
    onError: (error) => {
      console.log(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("user-list");
    },
  });

  const fetchExhibitors = async () => {
    return request({
      url: `exhibitor/user-list`,
      method: "get",
    });
  };

  const {
    isLoading,
    data: childExhibitor,
  } = useQuery({
    queryKey: ["exhibitors-approval"],
    queryFn: fetchExhibitors,
    refetchOnWindowFocus: true,
  });

  const onSubmit = async (data) => {
    setProcess(true);
    if (Object.keys(data).length) {
      const inputData = { ...data };
      await createChildUser(inputData);
      reset();
      setProcess(false);
      setAddUserModal(false)
    }

  };

  const childExhibitorColumnDef = [
    {
      headerName: "Name",
      field: "name",
      filter: true,
      width: 150,
    },
    { headerName: "Company", field: "companyName", filter: true, width: 150 },
    {
      headerName: "Company Address",
      field: "companyAddress",
      filter: true,
      width: 250,
    },
    { headerName: "Email", field: "email", filter: true, width: 250 },
    { headerName: "Phone", field: "phone", filter: true, width: 150 },
    {
      field: "Status",
      filter: true,
      width: 300,
      renderCell: (params) => {
        return (
          <div className="flex flex-col items-start justify-center h-full">
            <b>
              {!params.row.active && !params.row.blocked && !params.row.reject ? "Waiting For Approval" : (
                params.row.reject ? "Rejected" : (params.row.reject ? "Blocked" : "Approved")
              )}
            </b>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <section
        className="lg:pl-3 lg:pr-5 lg:py-5 bg-white w-full h-full relative pt-20 pb-4 px-3 lg:min-h-screen  flex flex-col"
        id="main-content-body"
      >
        <div className="w-full min-h-[100vh] h-[100vh] relative bottom-0 bg-white mx-auto my-auto flex flex-col justify-center items-start mt-5 rounded-lg overflow-hidden">
          <div className=" headerDiv w-full py-4 flex justify-between items-center bg-[#222222] text-white text-lg font-lato  px-8 mt-10">
            <p className=" header md:text-2xl sm:text-xl font-lato font-bold">Stall Manager List</p>
            <button className="bg-brand-color  text-black px-2 py-2 rounded-lg font-lato font-bold text-base w-full md:w-auto"
              onClick={() => setAddUserModal(true)}>
              Create Stall Manager
            </button>
          </div>
          <div className="ag-theme-alpine h-full gridContainer pb-1 w-full ">
            <CommonDataTableView
              columns={childExhibitorColumnDef}
              rowData={childExhibitor}
              filename={""}
            />
          </div>
        </div>
      </section>
      {
        addUserModal ? <div className="w-full h-[100%] bg-white fixed left-0 right-0 top-0 bottom-0 z-[400] mx-auto my-auto flex flex-col justify-center items-start">
          <div className=" headerDiv w-full md:h-20 sm:h-14 mb-1 flex justify-between items-center bg-[#222222] text-white text-lg font-lato  px-8">
            <p className=" header md:text-2xl sm:text-xl font-lato font-bold">
              Add Stall Manager
            </p>
            <div
              onClick={() => setAddUserModal(false)}
              className=" w-6 h-6 p-2 rounded-full bg-brand-color cursor-pointer"
            >
              <Image
                alt="close"
                height={100}
                width={100}
                src={`${BUCKET_URL}/Close.png`}
                unoptimized
                className=" w-full h-auto"
              ></Image>
            </div>
          </div>
          <div className="ag-theme-alpine h-full gridContainer w-full px-8">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col md:flex-row gap-5">
                <div className="w-full flex flex-col ">
                  <div className="mt-2 flex flex-col gap-2">
                    <p className="text-black font-bold font-quickSand text-base">
                      *Name
                    </p>
                    <input
                      type="text"
                      {...register("name", {
                        required: "Name is required",
                      })}
                      className={`border border-black h-12 rounded-lg text-black px-3 font-quickSand font-semibold text-sm ${errors.name ? "border-red-500" : ""
                        }`}
                    />
                    {errors.name && (
                      <p className="text-red font-semibold font-lato text-xs mt-2">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="mt-2 flex flex-col gap-2">
                    <p className="text-black font-bold font-quickSand text-base">
                      *Email
                    </p>
                    <input
                      type="text"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Enter a valid email address",
                        },
                      })}
                      className={`border border-black h-12 rounded-lg text-black px-3 font-quickSand font-semibold text-sm ${errors.email ? "border-red-500" : ""
                        }`}
                    />
                    {errors.email && (
                      <p className="text-red font-semibold font-lato text-xs mt-2">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="mt-2 flex flex-col gap-2">
                    <p className="text-black font-bold font-quickSand text-base">
                      *Password
                    </p>
                    <input
                      type="password"
                      {...register("password", {
                        required: "Password is required",
                        pattern: {
                          value:
                            /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                          message:
                            "Password must be at least 8 characters long, with at least 1 uppercase letter, 1 number, and 1 special character",
                        },
                      })}
                      className="border border-black h-12 rounded-lg text-black px-3 font-quickSand font-semibold text-sm"
                    />
                    {errors.password && (
                      <p className="text-red font-semibold font-lato text-xs mt-2">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                  <div className="mt-4">
                    {process ? (
                      <button
                        type="button"
                        className="bg-black text-white px-6 py-3 rounded-lg font-lato font-bold text-base w-full md:w-auto inline-flex items-center"
                        disabled
                      >
                        <svg
                          className="animate-spin h-5 w-5 mr-3 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          ></path>
                        </svg>
                        Processing...
                      </button>
                    ) : (
                      <button className="bg-black text-white px-6 py-3 rounded-lg font-lato font-bold text-base w-full md:w-auto">
                        Create
                      </button>
                    )}
                  </div>
                </div>

                <div className="w-full flex flex-col">
                  <div className="mt-2 flex flex-col gap-2">
                    <p className="text-black font-bold font-quickSand text-base">
                      *Company Name
                    </p>
                    <input
                      type="text"
                      {...register("companyName", {
                        required: "Company Name is required",
                      })}
                      className={`border border-black h-12 rounded-lg text-black px-3 font-quickSand font-semibold text-sm ${errors.companyName ? "border-red-500" : ""
                        }`}
                    />
                    {errors.companyName && (
                      <p className="text-red font-semibold font-lato text-xs mt-2">
                        {errors.companyName.message}
                      </p>
                    )}
                  </div>
                  <div className="mt-2 flex flex-col gap-2">
                    <p className="text-black font-bold font-quickSand text-base">
                      *Company Address
                    </p>
                    <textarea
                      {...register("companyAddress", {
                        required: "Company Address is required",
                      })}
                      className={`border border-black h-12 rounded-lg text-black px-3 font-quickSand font-semibold text-sm p-2 ${errors.companyAddress ? "border-red-500" : ""
                        }`}
                    />
                    {errors.companyAddress && (
                      <p className="text-red font-semibold font-lato text-xs mt-2">
                        {errors.companyAddress.message}
                      </p>
                    )}
                  </div>
                  <div className="mt-2 flex flex-col gap-2">
                    <p className="text-black font-bold font-quickSand text-base">
                      *WhatsApp Number
                    </p>
                    <Controller
                      name="phone"
                      {...register("phone", {
                        required: {
                          value: true,
                          message: "Phone Number is required.",
                        },
                        pattern: {
                          value: /^[0-9]{11,12}$/, // Ensures only digits and 9 or 10 length
                          message:
                            "Phone number should contain only 9 or 10 digits.",
                        },
                      })}
                      render={({ field: { name, onChange, value } }) => (
                        <PhoneInput
                          name={name}
                          value={value}
                          onChange={onChange}
                          inputclassName="!rounded-lg !text-black !font-quickSand !font-semibold !text-sm"
                          inputStyle={{
                            width: "100%",
                            maxWidth: "100%",
                            height: "48px",
                            border: "solid 1px #23272D",
                          }}
                          country={"in"}
                        // onChange={(e) => handlePhoneChange(e)}
                        />
                      )}
                      control={control}
                    />

                    {errors.phone && (
                      <p className="text-red font-semibold font-lato text-xs mt-2">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div> : <></>
      }

    </>

  );
};

export default Page;
