"use client";
import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { BASE_URL, BUCKET_URL } from "@/config/constant";
import LiteStall from "@/components/lite-stall";

const VerifyComponent = () => {
  const [emailSuccess, setEmailSuccess] = useState(null);
  const [alreadyVerified, setAlreadyVerified] = useState(null);
  const [signUpModel, setSignUpModel] = useState(true);
  const [loading, setLoadinhg] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  useEffect(() => {
    setLoadinhg(true);
    if (token) {
      // Call your API to verify the token
      fetch(`${BASE_URL}visitor/verify-email?token=${token}`, {
        method: "post",
      })
        .then((res) => res.json())
        .then((data) => {
          setLoadinhg(false);
          if (data.status == 200) {
            setEmailSuccess(true);
            if (data.data.verified) {
              setAlreadyVerified(true);
            } else {
              setAlreadyVerified(false);
            }
          } else {
            setEmailSuccess(false);
          }
        })
        .catch((err) => {
          console.error("Error verifying email:", err);
          setEmailSuccess(false);
          setLoadinhg(false);
        });
    }
  }, [token]);

  const reset = () => {
    router.push("/signup"); // Redirect to signup page
  };

  return (
    <>
      {signUpModel && (
        <div className=" bg-[#000000]/[.89] w-full h-[100dvh] absolute z-[1001] flex justify-center items-center top-0">
          <div className="modelDiv text-white mx-5 h-auto max-h-[90%] overflow-y-auto bg-white rounded-[20px] w-full max-w-[470px] md:p-[30px] p-5">
            {loading && <div>Loading...</div>}
            {!loading && emailSuccess === true && !alreadyVerified && (
              <>
                <h1 className="text-3xl font-bold text-black font-quickSand">
                  Verification Successful
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
                    Visitor verification is successful.
                  </p>
                  <button
                    onClick={() => router.push("/")}
                    className="mt-7 bg-black text-white px-6 py-3 rounded-lg font-lato font-bold text-base w-full md:w-auto"
                  >
                    Login
                  </button>
                </div>
              </>
            )}
            {!loading && emailSuccess === true && alreadyVerified && (
              <>
                <h1 className="text-3xl font-bold text-black font-quickSand">
                  Already Verified
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
                    Verification already completed. Please try to login.
                  </p>
                  <button
                    onClick={() => router.push("/")}
                    className="mt-7 bg-black text-white px-6 py-3 rounded-lg font-lato font-bold text-base w-full md:w-auto"
                  >
                    Login
                  </button>
                </div>
              </>
            )}
            {!loading && emailSuccess === false && (
              <>
                <h1 className="text-3xl font-bold text-black font-quickSand">
                  Verification Unsuccessful
                </h1>
                <div className="mt-11 flex flex-col justify-center items-center gap-7">
                  <Image
                    alt="success"
                    src={`${BUCKET_URL}/neofairs-lite/block.svg`}
                    className="max-w-[165px] h-auto"
                    height={3000}
                    width={3000}
                  />
                  <p className="text-base font-quickSand text-black font-medium">
                    Link has expired. Kindly click below to Signup again
                  </p>
                  <button
                    onClick={() => router.push("/")}
                    className="mt-7 bg-black text-white px-6 py-3 rounded-lg font-lato font-bold text-base w-full md:w-auto"
                  >
                    Sign Up
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <LiteStall />
    </>
  );
};

const Verify = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyComponent />
    </Suspense>
  );
};

export default Verify;
