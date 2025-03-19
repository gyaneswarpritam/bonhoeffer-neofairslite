import React, { useState } from "react";
import Image from "next/image";
import { BASE_URL, BUCKET_URL } from "@/config/constant";
import axios from "axios";
import { toast } from "react-toastify";

const Forgetpassword = () => {
  const [proceed, setProceed] = useState(false);
  const [reset, setReset] = useState(false);
  const [fromLink, setFromLink] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [email, setEmail] = useState("");

  const handleEmailChange = (e) => {
    const text = e.target.value;
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(text)) {
      setEmailError("");
    } else {
      setEmailError("Enter Valid Email");
    }
  };

  const handleProceed = async () => {
    if (!email) {
      setEmailError("Enter your Email");
      return;
    }
    if (emailError === "") {
      try {
        const forgotResponse = await axios.post(
          `${BASE_URL}exhibitor/forgot-password`,
          { email }
        );

        setProceed(true);
      } catch (error) {
        // setEmailError(
        //   error.response?.data?.message || "Error sending reset email"
        // );

        toast.error(error.response?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
  };

  return (
    <>
      {!fromLink && (
        <>
          {!proceed ? (
            <>
              <div>
                <h1 className=" text-3xl font-bold text-black font-quickSand">
                  Forgot Password
                </h1>
                <div className=" mt-1 flex flex-col">
                  <p className=" text-black font-bold font-quickSand text-base">
                    *Email
                  </p>
                  <input
                    type="text"
                    name="Email"
                    id="Email"
                    onChange={handleEmailChange}
                    className=" border border-black h-12 rounded-lg text-black px-3  font-quickSand font-semibold text-sm"
                  />
                  <p
                    className={`text-red font-semibold font-lato text-xs mt-2 ${
                      emailError ? "block" : " hidden"
                    }`}
                  >
                    {emailError}
                  </p>
                </div>
                <button
                  onClick={handleProceed}
                  className=" mt-10 bg-black text-white px-6 py-3 rounded-lg font-lato font-bold text-base w-full md:w-auto"
                >
                  Proceed
                </button>
              </div>
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
          ) : (
            <>
              <h1 className=" text-3xl font-bold text-black font-quickSand">
                Check Your Email
              </h1>
              <div className=" mt-11 flex flex-col justify-center items-center gap-7">
                <Image
                  alt="success"
                  src={`${BUCKET_URL}/neofairs-lite/approved-mail.svg`}
                  className=" max-w-[165px] h-auto"
                  height={3000}
                  width={3000}
                ></Image>
                <p className="text-base font-quickSand text-black font-medium text-center">
                  Password reset details has been sent to your mail. Kindly
                  check the mail and proceed.
                </p>
                {/* <button
                  onClick={() => setFromLink(!fromLink)}
                  className=" mt-10 bg-black text-white px-6 py-3 rounded-lg font-lato font-bold text-base"
                >
                  from link
                </button> */}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Forgetpassword;
