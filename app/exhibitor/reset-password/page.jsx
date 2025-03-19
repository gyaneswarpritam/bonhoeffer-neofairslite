"use client";
import { request } from "@/lib/axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const Page = () => {
  const exhibitorId =
    typeof window !== "undefined" ? sessionStorage.getItem("id") : null;
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const [customErrors, setCustomErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [fromLink, setFromLink] = useState(false);

  const onSubmit = async (data) => {
    const { oldPassword, newPassword, confirmPassword } = data;

    // Manual validation
    let validationErrors = {};
    if (!oldPassword) {
      validationErrors.oldPassword = "Old password is required";
    }
    if (!newPassword) {
      validationErrors.newPassword = "New password is required";
    } else if (newPassword.length < 8) {
      validationErrors.newPassword =
        "New password must be at least 8 characters long";
    } else if (!/\d/.test(newPassword)) {
      validationErrors.newPassword = "New password must contain a number";
    } else if (!/[A-Z]/.test(newPassword)) {
      validationErrors.newPassword =
        "New password must contain an uppercase letter";
    } else if (!/[a-z]/.test(newPassword)) {
      validationErrors.newPassword =
        "New password must contain a lowercase letter";
    }
    if (confirmPassword !== newPassword) {
      validationErrors.confirmPassword = "Passwords must match";
    }

    // If there are validation errors, set them and return early
    if (Object.keys(validationErrors).length > 0) {
      setCustomErrors(validationErrors);
      return;
    }

    try {
      const res = await request({
        url: `exhibitor/reset-password`,
        method: "post",
        data: {
          oldPassword,
          newPassword,
          exhibitorId,
        },
      });
      toast.success("Password reset successully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setServerError("");
      reset(); // Reset form fields after successful submission
    } catch (error) {
      if (error.response && error.response.data.message) {
        setServerError(error.response.data.message);
      } else {
        setServerError("Something went wrong");
      }
    }
  };

  return (
    <section
      className="no-scrollbar lg:pl-3 lg:pr-5 lg:py-5 bg-white w-full relative pt-20 pb-10 px-3 lg:min-h-screen  flex flex-col gap-[1.25rem]"
      id="main-content-body"
    >
      <div className=" flex md:flex-row flex-col justify-start items-center">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className="text-3xl font-bold text-black font-quickSand">
            Reset Your Password
          </h1>
          <div className="mt-1 flex flex-col">
            <label className="text-black font-bold font-quickSand text-base">
              *Old Password
            </label>
            <input
              type="password"
              {...register("oldPassword")}
              className="border border-black h-12 rounded-lg text-black px-3 font-quickSand font-semibold text-sm"
            />
            {customErrors.oldPassword && (
              <p className="text-red text-sm mt-1">
                {customErrors.oldPassword}
              </p>
            )}

            <label className="text-black font-bold font-quickSand text-base mt-4">
              *New Password
            </label>
            <input
              type="password"
              {...register("newPassword")}
              className="border border-black h-12 rounded-lg text-black px-3 font-quickSand font-semibold text-sm"
            />
            {customErrors.newPassword && (
              <p className="text-red text-sm mt-1">
                {customErrors.newPassword}
              </p>
            )}

            <label className="text-black font-bold font-quickSand text-base mt-4">
              *Re-Type Password
            </label>
            <input
              type="password"
              {...register("confirmPassword")}
              className="border border-black h-12 rounded-lg text-black px-3 font-quickSand font-semibold text-sm"
            />
            {customErrors.confirmPassword && (
              <p className="text-red text-sm mt-1">
                {customErrors.confirmPassword}
              </p>
            )}
          </div>

          {serverError && (
            <p className="text-red text-sm mt-2">{serverError}</p>
          )}

          <button
            type="submit"
            className="mt-10 bg-black text-white px-6 py-3 rounded-lg font-lato font-bold text-base w-full md:w-auto"
          >
            Reset Password
          </button>
          <button
            onClick={() => setFromLink(false)}
            type="button"
            className="ml-4 mt-10 bg-black text-white px-6 py-3 rounded-lg font-lato font-bold text-base w-full md:w-auto"
          >
            Close
          </button>
        </form>
      </div>
    </section>
  );
};

export default Page;
