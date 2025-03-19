import { BUCKET_URL } from "@/config/constant";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const StallImages = ({
  dataObject,
  openImage,
  handleFileChange,
  errors,
  handleVideoLinkChange,
  updateVideoLink,
}) => {
  const [editStallImage, setEditStallImage] = useState(false);
  const [editStallLogo, setEditStallLogo] = useState(false);
  const [editCompanyLogo, setEditCompanyLogo] = useState(false);
  const [isImageSelected, setIsImageSelected] = useState(true); // Toggle for image/video

  useEffect(() => {
    if (dataObject && Object.keys(dataObject).length) {
      setEditStallImage(true);
      setEditStallLogo(true);
      setEditCompanyLogo(true);
      setIsImageSelected(dataObject.stallBackgroundImage);
    }
  }, []);

  const imageSelected = (data) => {
    setIsImageSelected(data);
    handleVideoLinkChange(data);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div>
        {/* Toggle between Stall Image and Stall Video */}
        <div className="flex gap-4 mb-4">
          <button
            className={`w-1/2 py-2 text-center ${
              isImageSelected ? "bg-blue text-white" : "bg-grey-out"
            }`}
            onClick={() => imageSelected(true)}
          >
            Stall Image
          </button>
          <button
            className={`w-1/2 py-2 text-center ${
              !isImageSelected ? "bg-blue text-white" : "bg-grey-out"
            }`}
            onClick={() => imageSelected(false)}
          >
            Stall Video Link
          </button>
        </div>

        {isImageSelected ? (
          // Stall Image
          <>
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
                  style={{
                    backgroundImage: `url('${dataObject.stallImage}')`,
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
                  Stall Image
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
          </>
        ) : (
          // Stall Video
          <>
            <label
              htmlFor="stallVideoLink"
              className="mb-2 font-quickSand text-sm font-bold"
            >
              Stall Video Link
            </label>
            <input
              id="stallVideoLink"
              className="w-full text-sm font-quickSand font-semibold h-10 rounded-lg bg-[#F2F2F2] px-3"
              type="text"
              placeholder="Enter video URL"
              value={dataObject.stallVideoLink}
              onChange={(e) => updateVideoLink(e.target.value)}
            />
            {dataObject && dataObject.stallVideoLink && (
              <p
                style={{ textAlign: "right", cursor: "pointer" }}
                onClick={() => setIsImageSelected(true)} // Switch back to image
              >
                Cancel
              </p>
            )}
            {errors.stallVideoLink && (
              <p className="text-red text-xs mt-1">{errors.stallVideoLink}</p>
            )}
          </>
        )}
      </div>

      {/* Other fields for Stall Logo and Company Logo (same as before) */}
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
