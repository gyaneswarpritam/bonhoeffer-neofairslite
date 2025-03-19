"use client";
import { BASE_URL, BUCKET_URL } from "@/config/constant";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";

export default function LoginPage() {
  const type = "organiser";
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${BASE_URL}users/login`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "content-type": "application/json",
        },
      });
      const user = await response.json();
      if (user.status == 0) {
        toast.error(user.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        reset();
        toast.success(user.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      console.log("There was an error", error);
    }
  };

  return (
    <div className="bg-white md:px-8 px-2 py-3 md:py-0">
      <section className="mx-auto max-w-[1400px] md:min-h-screen flex md:flex-row flex-col items-stretch justify-between">
        <div className="md:w-[60%] w-full flex flex-col items-center justify-center">
          <div className="w-full rounded-xl overflow-hidden md:min-h-[80%] relative">
            <Image
              alt="home"
              src={`${BUCKET_URL}/login-page/asset.png`}
              className="md:absolute md:h-full md:w-auto w-full h-auto"
              width={5000}
              height={5000}
              unoptimized
            />
          </div>
        </div>
        <div className="md:w-[37%] w-full md:px-4 px-0 flex flex-col items-center justify-center mt-5 md:mt-0">
          <div className="w-full flex flex-col items-center justify-between min-h-[80%]">
            <div className="md:bg-[transparent] bg-black-2 w-full md:w-[unset] flex flex-col items-center md:block">
              <Image
                alt=""
                className="md:h-auto md:w-64 h-10 w-auto"
                width={500}
                height={500}
                src={`${BUCKET_URL}/login-page/logo-variant.svg`}
              />
            </div>
            <div className="mt-4 md:mt-4">
              <Image
                alt=""
                src={`${BUCKET_URL}/main-icons/${type}.svg`}
                width={500}
                height={500}
                className={`w-auto h-20 ${type !== null ? "" : "hidden"}`}
              />
            </div>
            <div className="font-quickSand font-bold md:text-3xl text-2xl text-static-black text-center mt-2 md:mt-6">
              Welcome to the <br />
              Community of{" "}
              {type === "organiser"
                ? "Organisers"
                : type === "visitor"
                  ? "Visitors"
                  : "Exhibitors"}
            </div>
            <div className="font-lato text-lg text-accent-font-color text-center md:mt-0 mt-1">
              Neofairs is a highly immersive virtual event platform inspiring
              people and business to establish long-lasting global connections.
            </div>
            <div className="bg-brand-color md:p-6 p-4 w-full rounded-2xl mt-5 md:mt-8">
              <form
                className="flex-col flex "
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                <input
                  placeholder="Email"
                  className="py-3 px-2 w-full rounded-lg outline-none text-base font-quickSand font-medium"
                  name="email"
                  type="text"
                  {...register("email")}
                />
                <input
                  placeholder="Password"
                  className="py-3 px-2 w-full rounded-lg outline-none text-base font-quickSand font-medium mt-2"
                  name="password"
                  type="password"
                  {...register("password")}
                />
                <input
                  type="submit"
                  value="LOGIN NOW"
                  name="submit"
                  className="cursor-pointer font-quicksand text-sm font-bold text-white bg-static-black rounded-lg px-10 py-3 mt-4 w-full"
                />
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
