import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { BUCKET_URL, BASE_URL } from "@/config/constant";
import { toast } from "react-toastify";
import SignUpWithNoAccountType from "./SignUpNoAccountType";
import axios from "axios";
import { haveAccount } from "@/GlobalRedux/features/neofairslite/neofairsLiteSlice";

const SignUpNoAccount = () => {
  const dispatch = useDispatch();
  const [code, setCode] = React.useState(false);
  const [tab, setTab] = React.useState(1);
  const [verificationType, setVerificationType] = React.useState(""); // State to track verification type
  const [otpMobile, setOtpMobile] = useState("");
  const [process, setProcess] = useState(false);

  const haveAccountValue = useSelector(
    (state) => state.neofairsLite.haveAccount
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setProcess(true);
      const user = await axios.post(`${BASE_URL}visitor/register`, {
        name: data.name,
        companyName: data.companyName,
        email: data.email,
        phone: data.phone,
        verification: data.check,
        password: data.password,
      });

      if (user.status === 200) {
        setProcess(false);
        reset();
        if (data.check === "sms") {
          setCode(true);
          const response = await axios.post(`${BASE_URL}visitor/requestotp`, {
            phoneNumber: data.phone,
          });
          setOtpMobile(data.phone);
        }

        setCode(true);
        setVerificationType(data.check);
      }
    } catch (error) {
      setProcess(false);
      console.log("There was an error", error);
      toast.error(error.response.data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  return (
    <>
      {!code ? (
        <>
          {tab === 1 && (
            <>
              <div className="flex flex-row gap-2 items-center">
                <Image
                  alt="Visitor"
                  src={`${BUCKET_URL}/neofairs-lite/Visitor.svg`}
                  width={3000}
                  height={3000}
                  className="w-auto h-10"
                />
                <h1 className="text-3xl font-bold text-black font-quickSand">
                  Visitor Sign Up
                </h1>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(() => setTab(2))();
                }}
              >
                <div className="mt-1 flex flex-col">
                  <p className="text-black font-bold font-quickSand text-base">
                    *Name
                  </p>
                  <input
                    type="text"
                    {...register("name", { required: "Name is required" })}
                    className="border border-black h-12 rounded-lg text-black px-3 font-quickSand font-semibold text-sm"
                  />
                  {errors.name && (
                    <p className="text-red font-semibold font-lato text-xs mt-2">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="mt-1 flex flex-col">
                  <p className="text-black font-bold font-quickSand text-base">
                    *Company Name
                  </p>
                  <input
                    type="text"
                    {...register("companyName", {
                      required: "Company Name is required",
                    })}
                    className="border border-black h-12 rounded-lg text-black px-3 font-quickSand font-semibold text-sm"
                  />
                  {errors.companyName && (
                    <p className="text-red font-semibold font-lato text-xs mt-2">
                      {errors.companyName.message}
                    </p>
                  )}
                </div>
                <p
                  onClick={() => dispatch(haveAccount(!haveAccountValue))}
                  className="text-[#2A9FE8] text-sm font-quickSand underline font-semibold cursor-pointer mt-5"
                >
                  You already have an account?
                </p>
                <button
                  type="submit"
                  className="bg-black text-white px-6 py-3 rounded-lg font-lato font-bold text-base mt-4 w-full md:w-auto"
                >
                  Next
                </button>
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
            </>
          )}

          {tab === 2 && (
            <>
              <h1 className="text-3xl font-bold text-black font-quickSand">
                Sign Up Verification
              </h1>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mt-5">
                  <p className="text-black font-bold font-quickSand text-base mb-2">
                    What do you want to use for verification?
                  </p>
                  <div className="flex flex-row gap-4">
                    <div className="flex flex-row justify-start items-center gap-[5px]">
                      <input
                        type="radio"
                        id="smsCheck"
                        value="sms"
                        {...register("check", {
                          required: "Select at least one method",
                        })}
                        className="h-[18px] w-[18px] form-radio cursor-pointer"
                        onChange={() => setVerificationType("sms")}
                      />
                      <label
                        htmlFor="smsCheck"
                        className="text-black text-base font-quickSand font-bold cursor-pointer"
                      >
                        Whatsapp
                      </label>
                    </div>
                    <div className="flex flex-row justify-start items-center gap-[5px]">
                      <input
                        type="radio"
                        id="emailCheck"
                        value="email"
                        {...register("check")}
                        className="h-[18px] w-[18px] form-radio cursor-pointer"
                        onChange={() => setVerificationType("email")}
                      />
                      <label
                        htmlFor="emailCheck"
                        className="text-black text-base font-quickSand font-bold cursor-pointer"
                      >
                        Email
                      </label>
                    </div>
                  </div>
                  {errors.check && (
                    <p className="text-red font-semibold font-lato text-xs mt-2">
                      {errors.check.message}
                    </p>
                  )}
                </div>

                {verificationType === "email" && (
                  <>
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
                        className="border border-black h-12 rounded-lg text-black px-3 font-quickSand font-semibold text-sm"
                      />
                      {errors.email && (
                        <p className="text-red font-semibold font-lato text-xs mt-2">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="mt-1 flex flex-col">
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
                  </>
                )}

                {verificationType === "sms" && (
                  <div className="mt-5 flex flex-col gap-2">
                    <p className="text-black font-bold font-quickSand text-base">
                      *Phone Number
                    </p>
                    <Controller
                      name="phone"
                      {...register("phone", {
                        required: {
                          value: true,
                          message: "Phone Number is required.",
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
                )}
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
                  <button
                    type="submit"
                    className="bg-black text-white px-6 py-3 rounded-lg font-lato font-bold text-base mt-4 w-full md:w-auto"
                  >
                    Verify
                  </button>
                )}
              </form>
            </>
          )}
        </>
      ) : (
        <SignUpWithNoAccountType
          otpMobile={otpMobile}
          typeValue={verificationType}
        />
      )}
    </>
  );
};

export default SignUpNoAccount;
