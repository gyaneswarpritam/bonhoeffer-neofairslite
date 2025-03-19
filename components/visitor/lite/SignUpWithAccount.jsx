import React from "react";
import { useState, useRef } from "react";
import OtpInputWithValidation from "./OtpValidation";
import Timer from "./Timer";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import Forgetpassword from "@/components/visitor/lite/Forgetpassword";
import { BASE_URL, BUCKET_URL } from "@/config/constant";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";
import { trackUtil } from "@/lib/track";
import { toast } from "react-toastify";
import { haveAccount } from "@/GlobalRedux/features/neofairslite/neofairsLiteSlice";
import PhoneInput from "react-phone-input-2";

const SignUpWithAccount = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  const [type, setType] = useState("");
  const [emailPhoneData, setEmailPhoneData] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showTimer, setShowTimer] = useState(true);
  const emailphone = useRef(null);
  const passwordRef = useRef(null);
  const [verificationType, setVerificationType] = useState("sms");
  const verifyButtonDisabled = useSelector(
    (state) => state.neofairsLite.verify
  );
  const haveAccountValue = useSelector(
    (state) => state.neofairsLite.haveAccount
  );
  const [phoneSuccess, setPhoneSuccess] = useState(false);
  const [forgetPassword, setForgetPassword] = useState(false);
  const [phoneNum, setPhoneNum] = useState("");
  const [phoneNumError, setPhoneNumError] = useState("");
  const [otpToVerify, setOtpToVerify] = useState(true);
  const [process, setProcess] = useState(false);

  const isEmailValid = (text) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (emailRegex.test(text)) {
      setError("");
      return "email";
    } else {
      if (text == "") {
        setError("Please Enter Email");
      } else {
        setError("Please Enter Valid Email");
      }
      return "error";
    }
  };

  const isPasswordValid = (text) => {
    if (text == "") {
      setPasswordError("Enter Password");
    }
    return "";
  };

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      check: "sms", // Set the default value for the radio buttons here
    },
  });

  const onSubmit = async (data) => {
    setProcess(true);
    const response = await axios.get("https://api.ipify.org?format=json");
    const userIP = response.data.ip;

    const payload = {
      email: data.email,
      password: data.password,
      loggedInIP: userIP,
    };
    try {
      let response;
      response = await fetch(`${BASE_URL}visitor/login`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "content-type": "application/json",
        },
      });
      setProcess(false);
      const user = await response.json();
      if (user.success == true) {
        // toast.success(user.message, {
        //   position: toast.POSITION.TOP_RIGHT,
        // });
        sessionStorage.setItem("token", user.token);
        sessionStorage.setItem("role", "visitor");
        sessionStorage.setItem("name", user.name);
        sessionStorage.setItem("id", user.id);
        trackUtil({
          trackEventType: "Login",
        });
        router.push("/visitor");
      } else {
        user &&
          user.message &&
          toast.error(user.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
      }
    } catch (error) {
      setProcess(false);
      console.log("There was an error", error);
    }
  };

  const nextButton = async () => {
    if (verificationType === "email") {
      let value = emailphone.current.value;
      setType(isEmailValid(value));
      setEmailPhoneData(value);
    } else {
      if (!phoneNum) {
        setPhoneNumError("Please enter phone number");
        return; // Exit if phone number is invalid
      }
      setProcess(true);
      setPhoneNumError("");
      const responseVisitor = await axios.post(
        `${BASE_URL}visitor/getVisitorData`,
        {
          phone: phoneNum,
        }
      );
      setProcess(false);
      if (responseVisitor.data.status === 0) {
        toast.error("You are not registered with given Phone Number", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        const response = await axios.post(`${BASE_URL}visitor/requestotp`, {
          phoneNumber: phoneNum,
        });
        setType("phone");
      }
    }
  };
  const loginButton = () => {
    if (verificationType === "email") {
      let value = passwordRef.current.value;
      setPassword(value);
      if (!isPasswordValid(value)) {
        const data = {
          email: emailPhoneData,
          password: value,
        };
        onSubmit(data);
      }
    } else {
    }
  };
  const handleVerify = async () => {
    try {
      setProcess(true);
      const response = await axios.post(`${BASE_URL}visitor/verifyotp`, {
        phoneNumber: phoneNum,
        otp: otpToVerify,
      });
      setProcess(false);
      if (response.status == 200) {
        // setPhoneSuccess(true);
        onMobileLogin({ phone: phoneNum });
      } else {
        setPhoneSuccess(false);
      }
    } catch (error) {
      toast.error(error.response.data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setProcess(false);
    }
  };
  const onMobileLogin = async (data) => {
    setProcess(true);
    const response = await axios.get("https://api.ipify.org?format=json");
    const userIP = response.data.ip;

    const payload = {
      phone: data.phone,
      loggedInIP: userIP,
    };
    try {
      let response;
      response = await fetch(`${BASE_URL}visitor/login-by-phone`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "content-type": "application/json",
        },
      });
      setProcess(false);
      const user = await response.json();
      if (user.success == true) {
        // toast.success(user.message, {
        //   position: toast.POSITION.TOP_RIGHT,
        // });
        sessionStorage.setItem("token", user.token);
        sessionStorage.setItem("role", "visitor");
        sessionStorage.setItem("name", user.name);
        sessionStorage.setItem("id", user.id);
        trackUtil({
          trackEventType: "Login",
        });
        router.push("/visitor");
      } else {
        user &&
          user.message &&
          toast.error(user.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
      }
    } catch (error) {
      setProcess(false);
      console.log("There was an error", error);
    }
  };

  const resendOTP = async () => {
    try {
      const response = await axios.post(`${BASE_URL}visitor/requestotp`, {
        phoneNumber: phoneNum,
      });
      toast.success(`OTP  sent to ${phoneNum}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.log("There was an error", error);
    }
  };

  return (
    <>
      {type == "error" || type == "" ? (
        <>
          <div className=" flex flex-row gap-2 items-center">
            <Image
              alt="dummy"
              src={`${BUCKET_URL}/neofairs-lite/Visitor.svg`}
              width={3000}
              height={3000}
              className="w-auto h-10"
            ></Image>
            <h1 className=" text-3xl font-bold text-black font-quickSand">
              Visitor Login
            </h1>
          </div>
          <div className="mt-5">
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
          {verificationType === "sms" && (
            <div className="mt-5 flex flex-col gap-2">
              <p className="text-black font-bold font-quickSand text-base">
                *Whatsapp Number
              </p>
              <PhoneInput
                name="phone"
                required
                inputClass="!rounded-lg !text-black !font-quickSand !font-semibold !text-sm"
                inputStyle={{
                  width: "100%",
                  maxWidth: "100%",
                  height: "48px",
                  border: "solid 1px #23272D",
                }}
                country={"in"}
                onChange={(value) => {
                  setPhoneNumError("");
                  setPhoneNum(value);
                }}
              />
              {errors.phone && (
                <p className="text-red font-semibold font-lato text-xs mt-2">
                  {errors.phone.message}
                </p>
              )}
              {phoneNumError && (
                <p className="text-red font-semibold font-lato text-xs mt-2">
                  {phoneNumError}
                </p>
              )}
            </div>
          )}
          {verificationType === "email" && (
            <div className=" mt-4 flex flex-col gap-2">
              <p className=" text-black font-bold font-quickSand text-base">
                *Email
              </p>
              <input
                ref={emailphone}
                type="text"
                name="Email-phone"
                id="Email-Phone"
                onChange={(e) => isEmailValid(e.target.value)}
                className=" border border-black h-12 rounded-lg text-black px-3  font-quickSand font-semibold text-sm"
              />
              {type == "error" && (
                <p className="mt-3 text-red text-xs font-lato font-medium">
                  {error}
                </p>
              )}
            </div>
          )}
          <div style={{ display: "flex" }}>
            <p
              onClick={() => dispatch(haveAccount(!haveAccountValue))}
              className=" text-[#2A9FE8] text-sm font-quickSand underline font-semibold cursor-pointer mt-5"
            >
              Don't have an account?
            </p>
            <p
              onClick={() => setType("forgetPassWord")}
              className=" text-[#2A9FE8] text-sm font-quickSand underline font-semibold mt-5 ml-3 cursor-pointer"
            >
              Forgot Password?
            </p>
          </div>

          <button
            onClick={() => nextButton()}
            className=" mt-10 bg-black text-white px-6 py-3 rounded-lg font-lato font-bold text-base w-full md:w-auto"
          >
            Next
          </button>
          <div className=" mt-10">
            <Image
              src={`${BUCKET_URL}/neofairs-lite/logo.svg`}
              alt="lite-logo"
              width={3000}
              height={3000}
              className=" w-full max-w-[205px]"
            ></Image>
          </div>
        </>
      ) : type == "phone" && !phoneSuccess ? (
        <>
          <h1 className=" text-3xl font-bold text-black font-quickSand">
            Verify your OTP
          </h1>
          <p className=" mt-4 text-black font-bold font-quickSand text-base">
            *Enter OTP
          </p>
          <div className=" mt-3 flex flex-row gap-5 items-center">
            <OtpInputWithValidation
              sendOtpToVerify={(otp) => setOtpToVerify(otp)}
            />
            {showTimer && <Timer stateChanger={setShowTimer}></Timer>}
          </div>
          <div className=" flex flex-row gap-4">
            {process ? (
              <button
                type="button"
                className="mt-10 bg-black text-white px-6 py-3 rounded-lg font-lato font-bold text-base w-full md:w-auto inline-flex items-center"
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
                onClick={handleVerify}
                disabled={verifyButtonDisabled}
                className={` ${
                  verifyButtonDisabled ? "opacity-50" : ""
                } mt-10 bg-black text-white px-6 py-3 rounded-lg font-lato font-bold text-base w-full md:w-auto`}
              >
                Verify
              </button>
            )}
            <button
              disabled={showTimer}
              onClick={resendOTP}
              className={` ${
                showTimer ? "opacity-50" : ""
              } mt-10 bg-[#FB5151] text-white px-6 py-3 rounded-lg font-lato font-bold text-base w-full md:w-auto`}
            >
              Resend
            </button>
          </div>
        </>
      ) : type == "phone" && phoneSuccess ? (
        <>
          <h1 className=" text-3xl font-bold text-black font-quickSand">
            Verification Successful
          </h1>
          <div className=" mt-11 flex flex-col justify-center items-center gap-7">
            <Image
              alt="success"
              src={`${BUCKET_URL}/neofairs-lite/success.svg`}
              className=" max-w-[165px] h-auto"
              height={3000}
              width={3000}
            ></Image>
            <p className="text-base font-quickSand text-black font-medium">
              Visitor verification is successful.
            </p>
          </div>
        </>
      ) : type == "forgetPassWord" ? (
        <Forgetpassword></Forgetpassword>
      ) : (
        type == "email" && (
          <div>
            <div className=" flex flex-row gap-2 items-center">
              <Image
                alt="dummy"
                src={`${BUCKET_URL}/neofairs-lite/Visitor.svg`}
                width={3000}
                height={3000}
                className="w-auto h-10"
              ></Image>
              <h1 className=" text-3xl font-bold text-black font-quickSand">
                Visitor Login
              </h1>
            </div>
            <div className=" mt-5 flex flex-col gap-2">
              <p className=" text-black font-bold font-quickSand text-base">
                *Password
              </p>
              <input
                ref={passwordRef}
                type="password"
                name="Password"
                id="Password"
                className=" border border-black h-12 rounded-lg text-black px-3  font-quickSand font-semibold text-sm"
              />
              {passwordError && (
                <p className="mt-3 text-red text-xs font-lato font-medium">
                  {passwordError}
                </p>
              )}
            </div>
            <p
              onClick={() => setType("forgetPassWord")}
              className=" text-[#2A9FE8] text-sm font-quickSand underline font-semibold mt-2 cursor-pointer"
            >
              Forgot Password?
            </p>
            <div className=" mt-5 flex flex-row gap-3">
              <button
                onClick={() => setType("")}
                className=" bg-black text-white px-6 py-3 rounded-lg font-lato font-bold text-base w-full md:w-auto"
              >
                Back
              </button>
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
                  className=" bg-black text-white px-6 py-3 rounded-lg font-lato font-bold text-base w-full md:w-auto"
                  onClick={loginButton}
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )
      )}
    </>
  );
};

export default SignUpWithAccount;
