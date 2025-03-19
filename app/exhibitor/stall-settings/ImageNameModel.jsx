"use Client";
import React, { useState } from "react";

const ImageNameModel = ({ handleDiscard, handleNameChange, Name }) => {
  const [inputValue, setInputValue] = useState(Name);
  const handleConfirm = (e) => {
    e.preventDefault();
    handleNameChange(inputValue);
  };
  return (
    <div className="fixed w-full h-full z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center bg-[#000000BF]">
      <form className=" w-[95%] flex justify-center items-center flex-col gap-5  max-w-lg px-5 py-10 md:p-10  rounded-lg bg-white">
        <input
          required
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full bg-[#ffffff] h-10 rounded-lg pl-4 font-lato font-medium text-lg border border-black outline-none"
          placeholder="Change the Name of the image *"
        />
        <div className=" flex flex-row gap-3 justify-around">
          <button
            type="submit"
            className=" bg-[#1C1B20] text-white h-10 px-5 rounded-lg"
          >
            Save
          </button>
          <button
            onClick={handleDiscard}
            className=" bg-[#FB5151] text-white  h-10 px-5 rounded-lg"
          >
            Discard
          </button>
        </div>
      </form>
    </div>
  );
};

export default ImageNameModel;
