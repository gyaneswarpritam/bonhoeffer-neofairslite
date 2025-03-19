import React from "react";

const ReviewSettings = ({ dataObject, plus, minus, stallData }) => {
  return (
    <div>
      <div className="w-full flex flex-col gap-4 mb-4 ">
        <div className=" flex flex-col gap-4">
          <p className=" text-xl font-quickSand font-medium">
            Stall Information
          </p>
          <div className="w-full h-[1px] bg-black opacity-10"></div>
          <p className=" text-base font-quickSand font-bold">
            Hall Name :&nbsp;
            <span className=" text-base font-quickSand font-medium">
              {dataObject.hallName}{" "}
            </span>
          </p>
          <p className=" text-base font-quickSand font-bold">
            Stall Name :&nbsp;
            <span className=" text-base font-quickSand font-medium">
              {dataObject.stallName}
            </span>
          </p>
        </div>
        <div className=" flex flex-col gap-4 mt-5">
          <p className=" text-xl font-quickSand font-medium">Card Details</p>
          <div className="w-full h-[1px] bg-black opacity-10"></div>
          <p className=" text-base font-quickSand font-bold">
            Name :&nbsp;
            <span className=" text-base font-quickSand font-medium">
              {dataObject.visitng_card_details.name}
            </span>
          </p>
          <p className=" text-base font-quickSand font-bold">
            Email :&nbsp;
            <span className=" text-base font-quickSand font-medium">
              {dataObject.visitng_card_details.email}
            </span>
          </p>
          <p className=" text-base font-quickSand font-bold">
            Phone :&nbsp;
            <span className=" text-base font-quickSand font-medium">
              {dataObject.visitng_card_details.phone}
            </span>
          </p>
          <p className=" text-base font-quickSand font-bold">
            Website :&nbsp;
            <span className=" text-base font-quickSand font-medium">
              {dataObject.visitng_card_details.website}
            </span>
          </p>
          <p className=" text-base font-quickSand font-bold">
            Address :&nbsp;
            <span className=" text-base font-quickSand font-medium">
              {dataObject.visitng_card_details.address}
            </span>
          </p>
        </div>
        <div className=" flex flex-col gap-4 mt-5">
          <p className=" text-xl font-quickSand font-medium">
            Social Media :&nbsp;
          </p>
          <div className="w-full h-[1px] bg-black opacity-10"></div>
          <p className=" text-base font-quickSand font-bold">
            Youtube :&nbsp;
            <span className=" text-base font-quickSand font-medium">
              {dataObject.social_media.youtube}
            </span>
          </p>
          <p className=" text-base font-quickSand font-bold">
            Twitter :&nbsp;
            <span className=" text-base font-quickSand font-medium">
              {dataObject.social_media.twitter}
            </span>
          </p>
          <p className=" text-base font-quickSand font-bold">
            Zoom :&nbsp;
            <span className=" text-base font-quickSand font-medium">
              {dataObject.social_media.zoom}
            </span>
          </p>
          <p className=" text-base font-quickSand font-bold">
            LinkedIn :&nbsp;
            <span className=" text-base font-quickSand font-medium">
              {dataObject.social_media.linkedin}
            </span>
          </p>
          <p className=" text-base font-quickSand font-bold">
            Meeting :&nbsp;
            <span className=" text-base font-quickSand font-medium">
              {dataObject.social_media.meeting}
            </span>
          </p>
          <p className=" text-base font-quickSand font-bold">
            Facebook :&nbsp;
            <span className=" text-base font-quickSand font-medium">
              {dataObject.social_media.facebook}
            </span>
          </p>
          <p className=" text-base font-quickSand font-bold">
            Twitter :&nbsp;
            <span className=" text-base font-quickSand font-medium">
              {dataObject.social_media.twitter}
            </span>
          </p>
        </div>
      </div>
      <div className=" border-t-[1px] text-base font-quickSand font-bold flex justify-start gap-5 pt-5 pb-10">
        <button
          onClick={minus}
          className="bg-[#DDDDDC] text-[#5E6672] h-10 px-5 rounded-lg"
        >
          Back
        </button>
        {stallData && stallData.stall ? (
          <button
            onClick={(e) => plus(3)}
            className=" bg-brand-color h-10 px-5 rounded-lg"
          >
            Update
          </button>
        ) : (
          <button
            onClick={(e) => plus(3)}
            className=" bg-brand-color h-10 px-5 rounded-lg"
          >
            Create
          </button>
        )}
      </div>
    </div>
  );
};

export default ReviewSettings;
