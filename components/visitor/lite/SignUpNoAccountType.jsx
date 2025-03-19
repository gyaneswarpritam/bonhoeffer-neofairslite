import React, { useState, useRef } from "react";
import OtpInputWithValidation from "./OtpValidation";
import Timer from "./Timer";
import Image from "next/image";
import { useSelector } from "react-redux";
import { BASE_URL, BUCKET_URL } from "@/config/constant";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { trackUtil } from "@/lib/track";

const SignUpWithNoAccountType = ({
  reset,
  typeValue,
  otpMobile,
  loginStatus = false,
  changeStatus,
}) => {
  const router = useRouter();
  const [type, setType] = useState(typeValue); // Initialize with typeValue
  const [error, setError] = useState("");
  const [showTimer, setShowTimer] = useState(true);
  const [otpToVerify, setOtpToVerify] = useState(true);
  const emailphone = useRef(null);
  const [process, setProcess] = useState(false);

  const verifyButtonDisabled = useSelector(
    (state) => state.neofairsLite.verify
  );
  const [phoneSuccess, setPhoneSuccess] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState("");

  const isEmailValid = (text) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex =
      /^(\+\d{1,2}\s?)?(\(\d{1,4}\)|\d{1,4})[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
    if (emailRegex.test(text)) {
      return "email";
    } else if (phoneRegex.test(text)) {
      return "phone";
    } else {
      if (text === "") {
        setError("Enter Email or Phone Number");
      } else {
        setError("Please Enter Valid Email or Phone Number");
      }
      return "error";
    }
  };

  const nextButton = () => {
    let value = emailphone.current.value;
    setType(isEmailValid(value));
  };

  const handleVerify = async () => {
    try {
      setProcess(true);
      const response = await axios.post(`${BASE_URL}visitor/verifyotp`, {
        phoneNumber: otpMobile,
        otp: otpToVerify,
      });
      if (response.status == 200) {
        // setPhoneSuccess(true);
        if (loginStatus) {
          setProcess(false);
          toast.success(`OTP verified successfully`, {
            position: toast.POSITION.TOP_RIGHT,
          });
          changeStatus();
        } else {
          onMobileLogin({ phone: otpMobile });
        }
      } else {
        setPhoneSuccess(false);
      }
    } catch (error) {
      setProcess(false);
      console.log(error);
      toast.error(error.response.data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  const onMobileLogin = async (data) => {
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
        localStorage.setItem("token", user.token);
        localStorage.setItem("role", "visitor");
        localStorage.setItem("name", user.name);
        localStorage.setItem("id", user.id);
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
  // Dummy functions for email success/failure (remove if not needed)
  const emailButtonSuccess = () => {
    setEmailSuccess("Success");
  };

  const emailButtonUnSuccess = () => {
    setEmailSuccess("UnSuccess");
  };

  const resendOTP = async () => {
    try {
      const response = await axios.post(`${BASE_URL}visitor/requestotp`, {
        phoneNumber: otpMobile,
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
      {type === "sms" && !phoneSuccess ? (
        <>
          <h1 className="text-3xl font-bold text-black font-quickSand">
            Verify your OTP
          </h1>
          <p className="mt-4 text-black font-bold font-quickSand text-base">
            *Enter OTP
          </p>
          <div className="mt-3 flex flex-row gap-5 items-center">
            <OtpInputWithValidation
              sendOtpToVerify={(otp) => setOtpToVerify(otp)}
            />
            {showTimer && <Timer stateChanger={setShowTimer} />}
          </div>
          <div className="flex flex-row gap-4">
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
                onClick={handleVerify}
                disabled={verifyButtonDisabled}
                className={`${verifyButtonDisabled ? "opacity-50" : ""
                  } mt-10 bg-black text-white px-6 py-3 rounded-lg font-lato font-bold text-base w-full md:w-auto`}
              >
                Verify
              </button>
            )}
            <button
              disabled={showTimer}
              onClick={resendOTP}
              className={`${showTimer ? "opacity-50" : ""
                } mt-10 bg-[#FB5151] text-white px-6 py-3 rounded-lg font-lato font-bold text-base w-full md:w-auto`}
            >
              Resend
            </button>
          </div>
        </>
      ) : type === "sms" && phoneSuccess ? (
        <>
          <h1 className="text-3xl font-bold text-black font-quickSand">
            Verification Successful
          </h1>
          <div className="mt-11 flex flex-col justify-center items-center gap-7">
            <Image
              alt="success"
              src={`${BUCKET_URL}/neofairs-lite/success.svg`}
              className="max-w-[165px] h-auto"
              height={3000}
              width={3000}
            />
            <p className="text-base font-quickSand text-black font-medium">
              Visitor verification is successful.
            </p>
          </div>
        </>
      ) : type === "email" && emailSuccess === "" ? (
        <>
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
              Email has been sent. Kindly verify your Email ID to login and use
              the platform.
            </p>
          </div>
          {/* <button className="text-black" onClick={emailButtonSuccess}>
            Success
          </button>
          <button className="text-black" onClick={emailButtonUnSuccess}>
            Unsuccess
          </button> */}
        </>
      ) : type === "email" && emailSuccess === "Success" ? (
        <>
          <h1 className="text-3xl font-bold text-black font-quickSand">
            Verification Successful
          </h1>
          <div className="mt-11 flex flex-col justify-center items-center gap-7">
            <Image
              alt="success"
              src={`${BUCKET_URL}/neofairs-lite/success.svg`}
              className="max-w-[165px] h-auto"
              height={3000}
              width={3000}
            />
            <p className="text-base font-quickSand text-black font-medium">
              Visitor verification is successful.
            </p>
          </div>
        </>
      ) : type === "email" && emailSuccess === "UnSuccess" ? (
        <>
          <h1 className="text-3xl font-bold text-black font-quickSand">
            Verification Unsuccessful
          </h1>
          <div className="mt-11 flex flex-col justify-center items-center gap-7">
            <Image
              alt="failure"
              src={`${BUCKET_URL}/neofairs-lite/block.svg`}
              className="max-w-[165px] h-auto"
              height={3000}
              width={3000}
            />
            <p className="text-base font-quickSand text-black font-medium">
              Link has expired. Kindly click below to Signup again
            </p>
          </div>
          <div className="grid place-items-center">
            <button
              onClick={reset}
              className="mt-7 bg-black text-white px-6 py-3 rounded-lg font-lato font-bold text-base w-full md:w-auto"
            >
              Sign Up
            </button>
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default SignUpWithNoAccountType;
