import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyButton } from "@/GlobalRedux/features/neofairslite/neofairsLiteSlice";

function OtpInputWithValidation({ sendOtpToVerify }) {
  const correctOTP = "1234"; // validate from your server
  const numberOfDigits = 4;
  const [otp, setOtp] = useState(new Array(numberOfDigits).fill(""));
  const [otpError, setOtpError] = useState(null);
  const otpBoxReference = useRef([]);

  const isInitialRender = useRef(true);

  const dispatch = useDispatch();

  let allow = false;

  useEffect(() => {
    const otpToVerify = otp.join("");
    if (otpToVerify.length < 4) {
      // setOtpError("OTP entered is wrong. Kindly check and re-enter it.");
      dispatch(verifyButton(true));
    } else {
      setOtpError(null);
      if (!isInitialRender.current) {
        dispatch(verifyButton(false));
        sendOtpToVerify(otpToVerify);
      }
    }
  }, [otp]);

  function handleChange(value, index) {
    let newArr = [...otp];
    const re = /^[0-9\b]+$/;
    if (value === "" || re.test(value)) {
      newArr[index] = value;
      setOtp(newArr);

      if (value && index < numberOfDigits - 1) {
        otpBoxReference.current[index + 1].focus();
      }
      if (value != "") {
        isInitialRender.current = false;
      } else {
        isInitialRender.current = true;
      }
    } else {
      otpBoxReference.current[index].focus();
    }
  }

  function onKeyDown(e, index) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      otpBoxReference.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      otpBoxReference.current[index + 1]?.focus();
    }
    if (e.key === "Backspace" && e.target.value == "" && index > 0) {
      allow = true;
    }
  }

  function handleBackspaceAndEnter(e, index) {
    if (allow) {
      otpBoxReference.current[index - 1].focus();
    }
    if (
      otpBoxReference.current[index].value != "" &&
      e.key != "ArrowLeft" &&
      e.key != "ArrowRight"
    ) {
      otpBoxReference.current[index + 1]?.focus();
    }
    if (e.key === "Enter" && e.target.value && index < numberOfDigits - 1) {
      otpBoxReference.current[index + 1].focus();
    }
  }
  const handlePaste = (event) => {
    const pastedText = event.clipboardData.getData("text").slice(0, 4);
    const textArray = pastedText.split("");
    textArray.map((item, index) => {
      if (otpBoxReference.current[index]) {
        otpBoxReference.current[index].value = item;
      }
    });
    setOtp(textArray);
  };

  return (
    <article className="">
      <div className="flex items-center gap-4">
        {otp.map((digit, index) => (
          <div
            key={index}
            className={` ${
              otpError ? "border-red" : "border-black"
            } w-[50px] h-[50px] p-2 border-2 block rounded-md aspect-square`}
          >
            <input
              key={index}
              value={digit}
              maxLength={1}
              onChange={(e) => handleChange(e.target.value, index)}
              onPaste={handlePaste}
              onKeyDown={(e) => onKeyDown(e, index)}
              onKeyUp={(e) => handleBackspaceAndEnter(e, index)}
              ref={(reference) => (otpBoxReference.current[index] = reference)}
              className={` w-full h-full text-black font-lato font-semibold text-lg bg-white border-b-2 border-[#C6C6C6] focus:outline-none appearance-none text-center`}
            />
          </div>
        ))}
      </div>

      <p
        className={`text-red font-semibold font-lato text-xs mt-4 ${
          otpError ? "error-show block" : " hidden"
        }`}
      >
        {otpError}
      </p>
    </article>
  );
}

export default OtpInputWithValidation;
