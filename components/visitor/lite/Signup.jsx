import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import OtpInputWithValidation from "./OtpValidation";
import { useDispatch, useSelector } from "react-redux";
import Timer from "./Timer";
import SignUpNoAccount from "./SignUpNoAccount";
import SignUpWithAccount from "./SignUpWithAccount";

const Signup = () => {
  const haveAccount = useSelector((state) => state.neofairsLite.haveAccount);

  return (
    <div className=" bg-[#000000]/[.89] w-full h-[100dvh] absolute z-[1001] flex justify-center items-center top-0">
      <div
        // style={{ overflow: "hidden", transition: "height 0.3s ease-in-out" }}
        className="modelDiv text-white mx-5 h-auto max-h-[90%] overflow-y-auto bg-white rounded-[20px] w-full max-w-[470px] md:p-[30px] p-5"
      >
        {haveAccount ? (
          <SignUpWithAccount></SignUpWithAccount>
        ) : (
          <SignUpNoAccount></SignUpNoAccount>
        )}
      </div>
    </div>
  );
};

export default Signup;
