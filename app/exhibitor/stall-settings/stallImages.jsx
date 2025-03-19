import { BUCKET_URL } from "@/config/constant";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const StallImages = ({ dataObject, openImage, handleFileChange, errors }) => {
  const [editStallImage, setEditStallImage] = useState(false);
  const [editStallLogo, setEditStallLogo] = useState(false);
  const [editCompanyLogo, setEditCompanyLogo] = useState(false);

  useEffect(() => {
    if (dataObject && Object.keys(dataObject).length) {
      setEditStallImage(true);
      setEditStallLogo(true);
      setEditCompanyLogo(true);
    }
  }, []);

  return (
    <div className="w-full flex flex-col gap-4">
      <div>
        {dataObject && dataObject.stallImage && editStallImage ? (
          <>
            <label
              htmlFor="StallImage"
              className="mb-2 font-quickSand text-sm font-bold"
            >
              Stall Image
            </label>
            <div
              className={`bg-[#F5F5F5] rounded-lg w-24 h-24 bg-cover bg-center imageHover`}
              style={
                /\.(mp4|webm|ogg)$/i.test(dataObject.stallImage)
                  ? {
                      backgroundImage: `url('${`${BUCKET_URL}/video.png`}')`,
                    }
                  : {
                      backgroundImage: `url('${dataObject.stallImage}')`,
                    }
              }
              unoptimized
            >
              <div className="flex flex-row gap-4 items-center justify-center w-full h-full img md:hidden rounded-lg">
                <Image
                  alt="img"
                  height={100}
                  width={100}
                  className="w-5 h-auto cursor-pointer"
                  src={`${BUCKET_URL}/stalls/view.svg`}
                  onClick={() =>
                    openImage(dataObject.stallImage, "Stall Image")
                  }
                />
                <Image
                  alt="img"
                  height={100}
                  width={100}
                  className="w-5 h-auto cursor-pointer"
                  src={`${BUCKET_URL}/stalls/edit.png`}
                  onClick={() => setEditStallImage(false)}
                  unoptimized
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <label
              htmlFor="StallImage"
              className="mb-2 font-quickSand text-sm font-bold"
            >
              Stall Image OR Video
            </label>
            <input
              id="StallImage"
              className="w-full text-sm font-quickSand font-semibold h-10 rounded-lg bg-[#F2F2F2] px-3"
              type="file"
              placeholder="Stall Image"
              onChange={(e) =>
                handleFileChange(e.target.files[0], "stallImage")
              }
            />
            {dataObject && dataObject.stallImage && (
              <p
                style={{ textAlign: "right", cursor: "pointer" }}
                onClick={() => setEditStallImage(true)}
              >
                Cancel
              </p>
            )}
            {errors.stallImage && (
              <p className="text-red text-xs mt-1">{errors.stallImage}</p>
            )}
          </>
        )}
      </div>

      <div>
        {dataObject && dataObject.stallLogo && editStallLogo ? (
          <>
            <label
              htmlFor="stallLogo"
              className="mb-2 font-quickSand text-sm font-bold"
            >
              Stall Logo (For Floor Plan)
            </label>
            <div
              className={`bg-[#F5F5F5] rounded-lg w-24 h-24 bg-cover bg-center imageHover`}
              style={{
                backgroundImage: `url('${dataObject.stallLogo}')`,
              }}
            >
              <div className="flex flex-row gap-4 items-center justify-center w-full h-full img md:hidden rounded-lg">
                <Image
                  alt="img"
                  height={100}
                  width={100}
                  className="w-5 h-auto cursor-pointer"
                  src={`${BUCKET_URL}/stalls/view.svg`}
                  onClick={() => openImage(dataObject.stallLogo, "Stall Logo")}
                />
                <Image
                  alt="img"
                  height={100}
                  width={100}
                  className="w-5 h-auto cursor-pointer"
                  src={`${BUCKET_URL}/stalls/edit.png`}
                  onClick={() => setEditStallLogo(false)}
                  unoptimized
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <label
              htmlFor="StallLogo"
              className="mb-2 font-quickSand text-sm font-bold"
            >
              Stall Logo (For Floor Plan)
            </label>
            <input
              id="StallLogo"
              className="w-full text-sm font-quickSand font-semibold h-10 rounded-lg bg-[#F2F2F2] px-3"
              type="file"
              placeholder="Stall Logo"
              onChange={(e) => handleFileChange(e.target.files[0], "stallLogo")}
            />
            {dataObject && dataObject.stallLogo && (
              <p
                style={{ textAlign: "right", cursor: "pointer" }}
                onClick={() => setEditStallLogo(true)}
              >
                Cancel
              </p>
            )}
            {errors.stallLogo && (
              <p className="text-red text-xs mt-1">{errors.stallLogo}</p>
            )}
          </>
        )}
      </div>

      <div>
        {dataObject && dataObject.companyLogo && editCompanyLogo ? (
          <>
            <label
              htmlFor="companyLogo"
              className="mb-2 font-quickSand text-sm font-bold"
            >
              Company Logo
            </label>
            <div
              className={`bg-[#F5F5F5] rounded-lg w-24 h-24 bg-cover bg-center imageHover`}
              style={{
                backgroundImage: `url('${dataObject.companyLogo}')`,
              }}
            >
              <div className="flex flex-row gap-4 items-center justify-center w-full h-full img md:hidden rounded-lg">
                <Image
                  alt="img"
                  height={100}
                  width={100}
                  className="w-5 h-auto cursor-pointer"
                  src={`${BUCKET_URL}/stalls/view.svg`}
                  onClick={() =>
                    openImage(dataObject.companyLogo, "Company Logo")
                  }
                />
                <Image
                  alt="img"
                  height={100}
                  width={100}
                  className="w-5 h-auto cursor-pointer"
                  src={`${BUCKET_URL}/stalls/edit.png`}
                  onClick={() => setEditCompanyLogo(false)}
                  unoptimized
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <label
              htmlFor="CompanyLogo"
              className="mb-2 font-quickSand text-sm font-bold"
            >
              Company Logo
            </label>
            <input
              id="CompanyLogo"
              className="w-full text-sm font-quickSand font-semibold h-10 rounded-lg bg-[#F2F2F2] px-3"
              type="file"
              placeholder="Company Logo"
              onChange={(e) =>
                handleFileChange(e.target.files[0], "companyLogo")
              }
            />
            {dataObject && dataObject.companyLogo && (
              <p
                style={{ textAlign: "right", cursor: "pointer" }}
                onClick={() => setEditCompanyLogo(true)}
              >
                Cancel
              </p>
            )}
            {errors.companyLogo && (
              <p className="text-red text-xs mt-1">{errors.companyLogo}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StallImages;
