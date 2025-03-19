"use Client";
import React, { useState } from "react";

const StallVideoModel = ({ handleStallDiscard, handleStallChange }) => {
  // Initialize with empty strings to avoid the uncontrolled-to-controlled warning
  const [inputValue, setInputValue] = useState("");
  const [url, setUrl] = useState("");

  const handleConfirm = (e) => {
    e.preventDefault();
    handleStallChange(inputValue, url);
  };

  return (
    <div className="fixed w-full h-full z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center bg-[#000000BF]">
      <form
        onSubmit={handleConfirm}
        className="w-[95%] max-w-lg flex justify-center items-center flex-col p-10 gap-5 bg-white rounded-lg"
      >
        <input
          value={inputValue}
          required
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full bg-[#ffffff] h-10 rounded-lg pl-4 font-lato font-medium text-lg border border-black outline-none"
          placeholder="Enter the Title *"
        />
        <input
          value={url}
          required
          onChange={(e) => setUrl(e.target.value)}
          className="w-full bg-[#ffffff] h-10 rounded-lg pl-4 font-lato font-medium text-lg border border-black outline-none"
          placeholder="Enter the Video Url *"
        />
        <div className="flex flex-row gap-3 justify-around">
          <button
            type="submit"
            className="bg-[#1C1B20] text-white h-10 px-5 rounded-lg"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleStallDiscard}
            className="bg-[#FB5151] text-white h-10 px-5 rounded-lg"
          >
            Discard
          </button>
        </div>
      </form>
    </div>
  );
};

export default StallVideoModel;
