"use client";
import React, { useRef, useState, useEffect } from "react";
import "../../components/visitor/lite/stallView.css";
import Signup from "@/components/exibitor/Signup";
import LiteStall from "@/components/lite-stall";


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
      {signUpModel && <Signup></Signup>}
      <LiteStall />
    </>
  );
};

export default Page;
