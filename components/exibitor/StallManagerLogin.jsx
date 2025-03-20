import Image from "next/image";
import React, { useState } from "react";
import "react-phone-input-2/lib/bootstrap.css";
import { BASE_URL, BUCKET_URL } from "@/config/constant";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/navigation";
import { trackUtil } from "@/lib/track";
import Link from "next/link";

const StallManagerLogin = () => {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  const [process, setProcess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();


  const onSubmitLogin = async (data) => {
    try {
      setProcess(true);
      const response = await axios.post(`${BASE_URL}exhibitor/child-login`, data);

      // Check if the response status is within the success range (200-299)
      if (response.status == 200) {
        const user = response.data;
        setProcess(false);
        localStorage.setItem("token", user.token);
        localStorage.setItem("role", "visitor");
        localStorage.setItem("name", user.name);
        localStorage.setItem("id", user.exhibitorId);
        localStorage.setItem("stallManagerId", user.id);
        localStorage.setItem("role", user.role);
        trackUtil({
          trackEventType: "Login",
        });
        reset();
        router.push("/exhibitor");
      }
    } catch (error) {
      setProcess(false);
      toast.error(error.response.data.message);
      console.error(error);
    }
  };

  return (
    <div className="bg-[#000000]/[.89] w-full h-[100dvh] absolute z-[1001] flex justify-center items-center">
      <>
        <div className="modelDiv text-white mx-5 max-h-[90%] bg-white rounded-[20px] overflow-y-auto w-full md:w-fit max-w-[90%] flex flex-col justify-between">
          <div className="w-full md:w-[470px] md:p-[30px] p-5">
            <div className="flex flex-row gap-2 items-center">
              <Image
                alt="dummy"
                src={`${BUCKET_URL}/neofairs-lite/Exhibitors.svg`}
                width={3000}
                height={3000}
                className="w-auto h-10"
              />
              <h1 className="text-3xl font-bold text-black font-quickSand">
                Stall Manager Login
              </h1>
            </div>
            <form onSubmit={handleSubmit(onSubmitLogin)}>
              <div className="mt-1 flex flex-col">
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
              <div className="mt-5 flex flex-col gap-2">
                <p className="text-black font-bold font-quickSand text-base">
                  *Password
                </p>
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",

                  })}
                  className={`border border-black h-12 rounded-lg text-black px-3 font-quickSand font-semibold text-sm ${errors.password ? "border-red-500" : ""
                    }`}
                />
                {errors.password && (
                  <p className="text-red font-semibold font-lato text-xs mt-2">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="mt-10">
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
                  <>
                    <button className="bg-black text-white px-6 py-3 rounded-lg font-lato font-bold text-base w-full md:w-auto">
                      Login
                    </button>
                    <Link className="ml-2 bg-black text-white px-6 py-4 rounded-lg font-lato font-bold text-base w-full md:w-auto"
                      href={"/exhibitor-login"}>
                      Back
                    </Link>
                  </>

                )}
              </div>
              <div className="mt-10">
                <Image
                  src={`${BUCKET_URL}/neofairs-lite/logo.svg`}
                  alt="lite-logo"
                  width={3000}
                  height={3000}
                  className="w-full max-w-[105px]"
                />
              </div>
            </form>
          </div>
        </div>
      </>

    </div>
  );
};

export default StallManagerLogin;
