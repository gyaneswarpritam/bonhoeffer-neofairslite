import { request } from "@/lib/axios";
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import { toast } from "react-toastify";
import "react-phone-input-2/lib/bootstrap.css";
import { useState } from "react";
import SignUpWithNoAccountType from "./SignUpNoAccountType";
import axios from "axios";
import { BASE_URL } from "@/config/constant";

const VerifyProfileForm = ({
  visitorData,
  serverError,
  visitorId,
  closeVerify,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const [verifyOtp, setVerifyOtp] = useState(false);
  const [otpMobile, setOtpMobile] = useState("");

  const onSubmit = async (data) => {
    // Prepare the payload conditionally based on verification status
    const requestData = {};

    if (visitorData?.isPhoneVerified) {
      // Phone is verified, so send email and password
      requestData.email = data.email;
      requestData.password = data.password;
    } else if (visitorData?.isEmailVerified) {
      // Email is verified, so send phone
      requestData.phone = data.phone;
      setOtpMobile(data.phone);
    }

    request({
      url: `visitor/verifyVisitorProfile/${visitorId}`,
      method: "post",
      data: requestData,
    })
      .then(async (res) => {
        if (res.status == 400) {
          toast.error(res.message);
        } else {
          if (requestData.email) {
            toast.success(
              "Email has been sent. Kindly verify your Email ID to login.",
              {
                position: toast.POSITION.TOP_RIGHT,
              }
            );
            closeVerify();
          } else if (requestData.phone) {
            await axios.post(`${BASE_URL}visitor/requestotp`, {
              phoneNumber: requestData.phone,
            });
            setVerifyOtp(true);
          }
        }
      })
      .catch((err) => {
        console.log(err, "An error occurred. Please try again");
      });
  };

  const verifyOtpByLink = async (phone) => {
    await axios.post(`${BASE_URL}visitor/requestotp`, {
      phoneNumber: phone,
    });
    setVerifyOtp(true);
  };

  const verifyEmailByLink = async (id) => {
    return request({
      url: `visitor/sendVerifyProfileEmailByLink/${id}`,
      method: "get",
    }).then((res) => {
      toast.success(
        `Email has been sent. Kindly verify your Email ID to login.`,
        {
          position: toast.POSITION.TOP_RIGHT,
        }
      );
    });
  };

  const updateVerifyOtp = () => {
    setVerifyOtp(false);
    closeVerify();
  };
  return (
    <div className="bg-[#000000]/[.89] w-full h-[100dvh] absolute z-[1001] flex justify-center items-center top-0">
      <div className="modelDiv text-white mx-5 h-auto max-h-[90%] overflow-y-auto bg-white rounded-[20px] w-full max-w-[470px] md:p-[30px] p-5">
        {!verifyOtp ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-3xl font-bold text-black font-quickSand">
              Verify Profile
            </h1>

            <div className="mt-1 flex flex-col">
              {visitorData && visitorData?.hasPhone ? (
                <>
                  <label className="text-black font-bold font-quickSand text-base">
                    Whatsapp Number: {visitorData?.visitor?.phone}{" "}
                    {visitorData?.visitor?.phoneVerified ? (
                      <span className="text-green">✅ Verified</span>
                    ) : (
                      <span
                        className="text-blue pl-6 cursor-pointer"
                        onClick={() =>
                          verifyOtpByLink(visitorData?.visitor?.phone)
                        }
                      >
                        Verify
                      </span>
                    )}
                  </label>

                  {!visitorData?.hasEmailAndPassword && (
                    <>
                      <label className="text-black font-bold font-quickSand text-base mt-4">
                        *Email
                      </label>
                      <input
                        type="email"
                        {...register("email", {
                          required: "Email is required",
                        })}
                        placeholder="Enter email"
                        className="border border-black h-12 rounded-lg text-black px-3 font-quickSand font-semibold text-sm"
                      />
                      {errors.email && (
                        <p className="text-red text-sm mt-1">
                          {errors.email.message}
                        </p>
                      )}

                      <label className="text-black font-bold font-quickSand text-base mt-4">
                        *Password
                      </label>
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
                        placeholder="Enter password"
                        className="border border-black h-12 rounded-lg text-black px-3 font-quickSand font-semibold text-sm"
                      />
                      {errors.password && (
                        <p className="text-red text-sm mt-1">
                          {errors.password.message}
                        </p>
                      )}
                    </>
                  )}
                  {visitorData?.visitor?.email && (
                    <label className="text-black font-bold font-quickSand text-base">
                      Email: {visitorData?.visitor?.email}{" "}
                      {visitorData?.visitor?.emailVerified ? (
                        <span className=" pl-6">✅ Verified</span>
                      ) : (
                        <span
                          className="text-blue pl-6 cursor-pointer"
                          onClick={() =>
                            verifyEmailByLink(visitorData?.visitor?._id)
                          }
                        >
                          Verify
                        </span>
                      )}
                    </label>
                  )}
                </>
              ) : (
                <>
                  <label className="text-black font-bold font-quickSand text-base">
                    Email: {visitorData?.visitor?.email}{" "}
                    {visitorData?.isEmailVerified && (
                      <span className="text-green-500">✅ Verified</span>
                    )}
                  </label>
                  <div className="mt-5 flex flex-col gap-2">
                    <p className="text-black font-bold font-quickSand text-base">
                      *Whatsapp Number
                    </p>
                    <Controller
                      name="phone"
                      {...register("phone", {
                        required: {
                          value: true,
                          message: "Whatsapp Number is required.",
                        },
                      })}
                      render={({ field: { name, onChange, value } }) => (
                        <PhoneInput
                          name={name}
                          value={value}
                          onChange={onChange}
                          inputClass="!rounded-lg !text-black !font-quickSand !font-semibold !text-sm"
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
                </>
              )}
            </div>

            {serverError && (
              <p className="text-red text-sm mt-2">{serverError}</p>
            )}
            {(!visitorData?.hasEmailAndPassword || !visitorData?.hasPhone) && (
              <button
                type="submit"
                className="mt-10 bg-black text-white px-6 py-3 rounded-lg font-lato font-bold text-base w-full md:w-auto"
              >
                Verify
              </button>
            )}
            <button
              onClick={closeVerify}
              type="button"
              className="ml-4 mt-10 bg-black text-white px-6 py-3 rounded-lg font-lato font-bold text-base w-full md:w-auto"
            >
              Close
            </button>
          </form>
        ) : (
          <SignUpWithNoAccountType
            otpMobile={otpMobile}
            typeValue={"sms"}
            changeStatus={updateVerifyOtp}
            loginStatus={true}
          />
        )}
      </div>
    </div>
  );
};

export default VerifyProfileForm;
