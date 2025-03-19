"use client";
import React, { useRef, useState, useEffect } from "react";
import "../../components/visitor/lite/stallView.css";
import Signup from "@/components/exibitor/Signup";
import LiteStall from "@/components/lite-stall";
import { useRouter } from "next/navigation";


const Page = () => {
  const [signUpModel, setSignUpModel] = useState(true);
  const exhibitorId =
    typeof window !== "undefined" ? localStorage.getItem("id") : null;
  const router = useRouter();

  const image = useRef(null);
  useEffect(() => {
    if (signUpModel) {
      document.body.style.overflow = "hidden";
    }
  }, [signUpModel]);

  useEffect(() => {
    if (exhibitorId) {
      router.push("/exhibitor")
    }
  }, [exhibitorId]);

  return (
    <>
      {signUpModel && <Signup></Signup>}
      <LiteStall />
    </>
  );
};

export default Page;
