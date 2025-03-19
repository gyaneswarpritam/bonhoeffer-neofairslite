"use client";
import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { BASE_URL, BUCKET_URL } from "@/config/constant";

const VerifyComponent = () => {
  const [emailSuccess, setEmailSuccess] = useState(null);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      // Call your API to verify the token
      fetch(`${BASE_URL}visitor/verify-email?token=${token}`, {
        method: "post",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status == 200) {
            setEmailSuccess(true);
          } else {
            setEmailSuccess(false);
          }
        })
        .catch((err) => {
          console.error("Error verifying email:", err);
          setEmailSuccess(false);
        });
    }
  }, [token]);

  const reset = () => {
    router.push("/signup"); // Redirect to signup page
  };

  return (
    <>
      {emailSuccess === true ? (
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
      ) : emailSuccess === false ? (
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
        <p>Loading...</p>
      )}
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
