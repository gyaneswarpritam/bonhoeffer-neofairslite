import { BUCKET_URL } from "@/config/constant";
import Image from "next/image";
import Auditorium from "./auditorium/Auditorium";

const AuditoriumModal = ({ handleClose }) => {
  return (
    <div className="w-full h-[100%] bg-white fixed left-0 right-0 top-0 bottom-0 z-[400] mx-auto my-auto justify-center items-start">
      <div className=" headerDiv w-full h-20 flex justify-between items-center bg-[#222222] text-white text-lg font-lato  px-8">
        <p className=" header text-2xl font-lato font-bold">Auditorium</p>
        <div
          onClick={handleClose}
          className=" w-6 h-6 p-2 rounded-full bg-brand-color cursor-pointer"
        >
          <Image
            alt="close"
            height={100}
            width={100}
            src={`${BUCKET_URL}/Close.png`}
            unoptimized
            className=" w-full h-auto"
          ></Image>
        </div>
      </div>
      <Auditorium />
    </div>
  );
};

export default AuditoriumModal;
