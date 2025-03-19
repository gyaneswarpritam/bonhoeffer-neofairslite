import { BUCKET_URL } from "@/config/constant";
import Image from "next/image";
import React from "react";

const SubMenuImage = ({ icon }) => {
  return (
    <Image
      alt={`${icon}-icon`}
      src={`${BUCKET_URL}/admin/${icon}.svg`}
      width={100}
      height={100}
    />
  );
};

export default SubMenuImage;
