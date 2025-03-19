import { BUCKET_URL } from "@/config/constant";
import { AgGridReact } from "ag-grid-react";
import Image from "next/image";
import React from "react";

const Mybookings = ({ handleModelClose, bookedSlots, tableColumnDef }) => {
  return (
    <div className="w-full h-[100%] bg-[#000000af] fixed left-0 right-0 top-0 bottom-0 z-[1000] py-5 px-2 md:p-5">
      <div className=" rounded-[32px] relative overflow-hidden h-full bg-white pb-5">
        <div className=" headerDiv w-full h-20 flex flex-row gap-3 justify-between px-5 items-center bg-[#222222] text-white text-lg font-lato">
          <p className=" header text-xl font-lato font-bold">My Bookings</p>
          <div
            onClick={() => handleModelClose()}
            className=" w-auto h-5 aspect-square rounded-full bg-brand-color cursor-pointer flex justify-center items-center"
          >
            <Image
              alt="close"
              height={100}
              width={100}
              src={`${BUCKET_URL}/visitor/close.svg`}
              className="w-[60%] h-auto"
            ></Image>
          </div>
        </div>
        <div className=" w-full  h-[80vh] px-2 md:px-8 bg-white rounded-b-[32px] pb-5">
          <div className="w-full min-h-fit h-full max-h-[90%] bg-white mt-5">
            <div className="ag-theme-alpine pb-1 w-full h-full ">
              {bookedSlots && bookedSlots.length ? (
                <AgGridReact
                  style={{ width: "100%", height: "100%" }}
                  rowData={bookedSlots}
                  columnDefs={tableColumnDef}
                  autoSizeColumns={true}
                ></AgGridReact>
              ) : (
                <AgGridReact
                  style={{ width: "100%", height: "100%" }}
                  rowData={[]}
                  columnDefs={tableColumnDef}
                  autoSizeColumns={true}
                ></AgGridReact>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mybookings;
