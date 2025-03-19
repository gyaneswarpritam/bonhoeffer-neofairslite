import Image from "next/image";
import React, { useState, useRef } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import Forgetpassword from "./Forgetpassword";
import { BASE_URL, BUCKET_URL } from "@/config/constant";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/navigation";
import { trackUtil } from "@/lib/track";
import Link from "next/link";
import { request } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

const Signup = () => {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  const [firstTime, setFirstTime] = useState(false);
  const [haveAccount, setHaveAccount] = useState(true);
  const [forget, setForget] = useState(false);
  const [phoneError, setPhoneError] = useState(null);
  const [process, setProcess] = useState(false);
  const phoneInputRef = useRef(null);

  const fetchSettings = async () => {
    return request({ url: "visitor/settings", method: "get" });
  };

  const {
    data: settingsData,
  } = useQuery({
    queryKey: ["settingsData"],
    queryFn: fetchSettings,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setProcess(true);
    try {
      const response = await axios.post(`${BASE_URL}exhibitor/register`, data);

      // Check if the response status is within the success range (200-299)
      if (response.status == 200) {
        reset();
        setProcess(false);
        toast.success("Signup successfull.");
        setFirstTime(true);
      }
    } catch (error) {
      setProcess(false);
      toast.error("Signup failed. Please try again.");
      console.error(error.response.data.message); // Handle error
    }
  };

  const onSubmitLogin = async (data) => {
    const response = await axios.get("https://api.ipify.org?format=json");
    const userIP = response.data.ip;
    const payload = {
      email: data.email,
      password: data.password,
      loggedInIP: userIP
    };
    try {
      setProcess(true);
      const response = await axios.post(`${BASE_URL}exhibitor/login`, payload);

      // Check if the response status is within the success range (200-299)
      if (response.status == 200) {
        const user = response.data;
        setProcess(false);
        localStorage.setItem("token", user.token);
        localStorage.setItem("role", "exhibitor");
        localStorage.setItem("name", user.name);
        localStorage.setItem("id", user.id);
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

  const handlePhoneChange = (e) => {
    const text = e;
    const phoneRegex =
      /^(\+\d{1,2}\s?)?(\(\d{1,4}\)|\d{1,4})[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
    if (phoneRegex.test(text)) {
      setPhoneError("");
      setValue("phone", text);
    } else {
      setPhoneError("Enter Valid Phone Number");
    }
  };

  return (
    <div className="bg-[#000000]/[.89] w-full h-[100dvh] absolute z-[1001] flex justify-center items-center">
      {!firstTime ? (
        <>
          <div className="modelDiv text-white mx-5 max-h-[90%] bg-white rounded-[20px] overflow-y-auto w-full md:w-fit max-w-[90%] flex flex-col justify-between">
            {haveAccount ? (
              settingsData && settingsData.length && settingsData[0].blockExhibitorLogin ?
                <>
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
                        Exhibitor Login
                      </h1>
                    </div>
                    <div className="mt-5">
                      <div className="flex flex-row gap-4">
                        <div className="flex flex-row justify-start items-center gap-[5px]">
                          <div dangerouslySetInnerHTML={{ __html: settingsData[0].blockMessage }}
                            style={{ color: "black" }} />
                          {/* <p className="  text-black font-quickSand">
                            The fair has not started yet, and login access is currently restricted.
                            Please check the event schedule and return when the fair is live.
                            If you have any questions, feel free to contact our support team.
                          </p> */}
                        </div>
                      </div>
                      <button
                        onClick={() => setHaveAccount(false)}
                        className=" bg-black text-white px-6 py-3 mt-4 rounded-lg font-lato font-bold text-base w-full md:w-auto"
                      >
                        Back
                      </button>
                    </div>
                  </div>
                </>
                :
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
                      Exhibitor Login
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
                          // pattern: {
                          //   value:
                          //     /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                          //   message:
                          //     "Password must be at least 8 characters long, with at least 1 uppercase letter, 1 number, and 1 special character",
                          // },
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
                        <button className="bg-black text-white px-6 py-3 rounded-lg font-lato font-bold text-base w-full md:w-auto">
                          Login
                        </button>
                      )}

                      <div className="flex flex-row gap-2">
                        <p
                          onClick={() => {
                            setHaveAccount(false);
                            setForget(true);
                          }}
                          className="text-[#2A9FE8] text-sm font-quickSand underline font-semibold mt-2 cursor-pointer"
                        >
                          Forgot Password?
                        </p>
                        <p
                          onClick={() => setHaveAccount(!haveAccount)}
                          className="text-[#2A9FE8] text-sm font-quickSand underline font-semibold mt-2 cursor-pointer"
                        >
                          New User?
                        </p>
                        <Link
                          href={"/stall-manager-login"}
                          className="text-[#2A9FE8] text-sm font-quickSand underline font-semibold ml-10 mt-2 cursor-pointer"
                        >
                          Stall Manager
                        </Link>
                      </div>
                    </div>
                    <div className="mt-10">
                      <Image
                        src={`${BUCKET_URL}/neofairs-lite/logo.svg`}
                        alt="lite-logo"
                        width={3000}
                        height={3000}
                        className="w-full max-w-[205px]"
                      />
                    </div>
                  </form>
                </div>
            ) : forget ? (
              <div className="w-full md:w-[470px] md:p-[30px] p-5">
                <Forgetpassword />
              </div>
            ) : (
              <div className="md:p-[30px] p-5">
                <h1 className="text-3xl font-bold text-black font-quickSand">
                  Signup Now
                </h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex flex-col md:flex-row gap-5">
                    <div className="w-full md:w-[470px] flex flex-col ">
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
                            Sign Up
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="w-full md:w-[470px] flex flex-col">
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
                <div className="mt-4 flex flex-row gap-2 justify-end">
                  <p
                    onClick={() => setHaveAccount(!haveAccount)}
                    className="text-[#2A9FE8] text-sm font-quickSand underline font-semibold cursor-pointer"
                  >
                    Already have an account? Login
                  </p>
                </div>
                <div className="mt-4">
                  <Image
                    src={`${BUCKET_URL}/neofairs-lite/logo.svg`}
                    alt="lite-logo"
                    width={3000}
                    height={3000}
                    className="w-full max-w-[205px]"
                  />
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="modelDiv text-white mx-5 h-auto max-h-[90%] overflow-y-auto bg-white rounded-[20px] w-full max-w-[470px] md:p-[30px] p-5">
            <h1 className="text-3xl font-bold text-black font-quickSand">
              Check Your Email
            </h1>
            <div className="mt-11 flex flex-col justify-center items-center gap-7">
              <Image
                alt="success"
                src={`${BUCKET_URL}/neofairs-lite/approved-mail.svg`}
                className="max-w-[165px] h-auto"
                height={3000}
                width={3000}
              />
              <p className="text-base font-quickSand text-black font-medium">
                Thank you for registering with us. Email has been sent. After
                approval you may login and use the platform.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Signup;
