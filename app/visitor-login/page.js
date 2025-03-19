"use client";
import React, { useEffect, useState } from "react";
import "../../components/visitor/lite/stallView.css";
import Signup from "../../components/visitor/lite/Signup";
import LiteStall from "@/components/lite-stall";
import { useRouter } from "next/navigation";

const Page = () => {
  const visitorId =
    typeof window !== "undefined" ? sessionStorage.getItem("id") : null;
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  const [signUpModel, setSignUpModel] = useState(true);
  useEffect(() => {
    if (signUpModel) {
      document.body.style.overflow = "hidden";
    }
  }, [signUpModel]);
  useEffect(() => {
    if (visitorId) {
      router.push("/visitor")
    }
  }, [visitorId]);

  return (
    <>
      {signUpModel && <Signup></Signup>}
      <LiteStall />
    </>
  );
};

export default Page;
