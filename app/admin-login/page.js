"use client";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';
import Cookies from "js-cookie";
import { BASE_URL, BUCKET_URL } from "@/config/constant";

export default function LoginPage() {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>
  }
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${BASE_URL}admin/login`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "content-type": "application/json",
        },
      });
      const user = await response.json();

      if (user.success == true) {
        // toast.success(user.message, {
        //   position: toast.POSITION.TOP_RIGHT,
        // });
        Cookies.set("role", "admin");
        sessionStorage.setItem("token", user.token)
        sessionStorage.setItem("role", "admin");
        router.push("/admin");
      } else {
        toast.error(user.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      toast.error(error.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log("There was an error", error);
    }
  };

  return (
    <div className="bg-white md:px-8 px-2 py-3 md:py-0">
      <section className="mx-auto max-w-[1400px] md:min-h-screen flex md:flex-row flex-col items-stretch justify-between">
        <div className="md:w-[60%] w-full flex flex-col items-center">
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
        <div className="md:w-[37%] w-full md:px-4 px-0 flex flex-col items-center mt-5 md:mt-0">
          <div className="w-full justify-between min-h-[80%]">
            <div className="font-quickSand font-bold md:text-3xl text-2xl text-static-black text-center mt-2 md:mt-6">
              Admin Login
            </div>
            <div className="bg-brand-color md:p-6 p-4 w-full rounded-2xl mt-5 md:mt-8">
              <form
                className="flex-col flex "
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                <input
                  placeholder="Email"
                  className="py-3 px-2 w-full  rounded-lg outline-none text-base font-quickSand font-medium"
                  name="email"
                  type="text"
                  {...register("email", {
                    required: {
                      value: true,
                      message: "Email is required.",
                    },
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: `Invalid email`,
                    },
                  })}
                />
                <p style={{ color: "red" }}>{errors['email'] && errors['email'].message}</p>
                <input
                  placeholder="Password"
                  className="py-3 px-2 w-full  rounded-lg outline-none text-base font-quickSand font-medium mt-2"
                  name="password"
                  type="password"
                  {...register("password", {
                    required: {
                      value: true,
                      message: "Password is required.",
                    },
                  })}
                />
                <p style={{ color: "red" }}>{errors['password'] && errors['password'].message}</p>
                <input
                  type="submit"
                  value="LOGIN NOW"
                  name="submit"
                  className="cursor-pointer font-quicksand text-sm font-bold text-white bg-static-black rounded-lg px-10 py-3 mt-4 w-full "
                />
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
