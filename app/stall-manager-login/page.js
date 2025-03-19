"use client";
import React, { useRef, useState, useEffect } from "react";
import "../../components/visitor/lite/stallView.css";
import LiteStall from "@/components/lite-stall";
import StallManagerLogin from "@/components/exibitor/StallManagerLogin";


const Page = () => {
  const [signUpModel, setSignUpModel] = useState(true);

  const image = useRef(null);
  useEffect(() => {
    if (signUpModel) {
      document.body.style.overflow = "hidden";
    }
  }, [signUpModel]);

  return (
    <>
      {signUpModel && <StallManagerLogin />}
      <LiteStall />
    </>
  );
};

export default Page;
