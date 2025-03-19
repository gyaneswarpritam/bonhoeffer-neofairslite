"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import TableMain from "./tableMain";
import { exhibitorLoginData } from "@/models/adminData";
import { BUCKET_URL } from "@/config/constant";

export default function ExhibitorUpload() {
  const [option, setOption] = useState(0);

  useEffect(() => {
    const els = document.getElementsByClassName("side-panel");

    for (var i = 0; i < els.length; i++) {
      els[i].addEventListener("click", (e) => handleClick(e));
    }

    return () => {
      for (var i = 0; i < els.length; i++) {
        els[i].removeEventListener("click", (e) => handleClick(e));
      }
    };
  }, []);

  const handleClick = (e) => {
    const n = Number(e.target.getAttribute("data-tag"));
    console.log(n);
    setOption(n);
    const els = document.getElementsByClassName("side-panel");
    for (var r = 0; r < els.length; r++) {
      if (r === n && !els[r].classList.contains("active")) {
        els[r].classList.add("active");
      } else {
        els[r].classList.remove("active");
      }
    }
  };

  const [columnDefs, setColumnDefs] = useState([]);
  const [rowData, setRowData] = useState([]); // Set rowData to Array of Objects, one Object per Row

  useEffect(() => {
    const data = exhibitorLoginData;
    setRowData(data);
    setColumnDefs([
      { headerName: "Name", field: "name", filter: true, width: 300 },
      {
        headerName: "Exhibitor's Email",
        field: "email",
        filter: true,
        width: 300,
      },
      { headerName: "Password", field: "password", filter: true, width: 150 },
      {
        headerName: "Delete",
        field: "action",
        filter: true,
        width: 100,
        cellRenderer: (params) => {
          return (
            <div className="h-full w-full flex flex-col items-center justify-center absolute top-1/2 -translate-y-1/2">
              <div className="rounded-full aspect-square flex flex-col items-center justify-center bg-brand-color h-7 cursor-pointer">
                <Image
                  width={100}
                  height={100}
                  src={`${BUCKET_URL}/admin/delete.svg`}
                  className="h-4 w-auto"
                />
              </div>
            </div>
          );
        },
      },
    ]);
  }, []);

  return (
    <section className="flex lg:flex-row flex-col items-stretch justify-between">
      <div className="font-lato font-medium lg:w-[30%] w-full flex flex-col items-stretch">
        <div className="flex flex-col items-center text-sm font-semibold cursor-pointer">
          <Image
            width={100}
            height={100}
            src={`${BUCKET_URL}/admin/back.svg`}
            alt="bacj_icon"
            className="w-7 h-auto mb-1"
          />
          <p>Go Back</p>
        </div>
        <div className="divider"></div>
        <div className="px-10">
          <div>
            <div className="text-static-black font-semibold text-xl">
              Exhibitor's Upload Login Information
            </div>
            <div className="text-accent-font-color font-medium text-sm">
              Add or remove Exhibitor's Upload Login
            </div>
          </div>
        </div>
        <div className="divider h-[1px]"></div>

        <div className="px-5 pt-2 pb-5 min-h-[60vh] flex flex-col items-start justify-start bg-[#F5F5F5] rounded-lg">
          <div className="input-type-1">
            <div className="label">Exhibitor's Name</div>
            <input placeholder="Enter the Exhibitor's Name" />
          </div>

          <div className="input-type-1">
            <div className="label">Exhibitor's Email</div>
            <input placeholder="Enter the Exhibitor's Email" type="email" />
          </div>

          <div className="input-type-1">
            <div className="label">Password</div>
            <input
              placeholder="Enter the Exhibitor's Password"
              type="password"
            />
          </div>

          <input
            type="submit"
            value="Add Exhibitor"
            name="submit"
            className="cursor-pointer font-lato text-base font-bold text-white bg-static-black rounded-lg px-10 py-3 mt-10 md:w-min w-full"
          />
        </div>
      </div>

      <div className="lg:w-[70%] w-full p-4">
        <div className="flex flex-col items-start text-sm font-semibold px-5">
          <p className="text-base">Added Exhibitor's Upload Login</p>
          <p className="font-normal text-accent-font-color">
            Exhibitor's Upload Logins you add are listed down here
          </p>
        </div>
        <div className="divider w-[100%] mt-2 mb-0"></div>

        <div className="pt-0 rounded-lg h-[90vh]">
          <TableMain rowData={rowData} columnDefs={columnDefs} />
        </div>
      </div>
    </section>
  );
}
