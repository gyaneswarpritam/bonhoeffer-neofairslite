import React from "react";

function Stepper({ numberClick }) {
  return (
    <div className="numbersDiv relative w-full md:px-8 px-4 pb-2 flex flex-row justify-between">
      <div
        onClick={(e) => numberClick(0)}
        data-option="0"
        className={`numbers active flex flex-col justify-start items-center gap-3 `}
      >
        <p className="p-2 md:h-8 h-12 aspect-square rounded-full border-[2px] border-[#C6C6C6] flex justify-center items-center font-quickSand font-bold text-[#C6C6C6]">
          1
        </p>
        <div className="w-2 h-2 rounded-full bg-[#C6C6C6]"></div>
        <p className="text-sm font-quickSand text-center">
          Getting <br /> Started
        </p>
      </div>
      <div
        onClick={(e) => numberClick(1)}
        data-option="1"
        className={`numbers flex flex-col justify-start items-center gap-3 `}
      >
        <p className="p-2 md:h-8 h-12 aspect-square rounded-full border-[2px] border-[#C6C6C6] flex justify-center items-center font-quickSand font-bold text-[#C6C6C6]">
          2
        </p>
        <div className="w-2 h-2 rounded-full bg-[#C6C6C6]"></div>
        <p className="text-sm font-quickSand text-center">
          Stall <br /> Details
        </p>
      </div>
      <div
        onClick={(e) => numberClick(2)}
        data-option="2"
        className={`numbers flex flex-col justify-start items-center gap-3 `}
      >
        <p className="p-2 md:h-8 h-12 aspect-square rounded-full border-[2px] border-[#C6C6C6] flex justify-center items-center font-quickSand font-bold text-[#C6C6C6]">
          3
        </p>
        <div className="w-2 h-2 rounded-full bg-[#C6C6C6]"></div>
        <p className="text-sm font-quickSand">
          More <br /> Details
        </p>
      </div>
      <div
        onClick={(e) => numberClick(3)}
        data-option="=3"
        className={`numbers flex flex-col justify-start items-center gap-3 `}
      >
        <p className="p-2 md:h-8 h-12 aspect-square rounded-full border-[2px] border-[#C6C6C6] flex justify-center items-center font-quickSand font-bold text-[#C6C6C6]">
          4
        </p>
        <div className="w-2 h-2 rounded-full bg-[#C6C6C6]"></div>
        <p className="text-sm font-quickSand">Preview</p>
      </div>
    </div>
  );
}

export default Stepper;
