import { BUCKET_URL } from "@/config/constant";
import Image from "next/image";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "@/lib/axios";
import Uploading from "@/components/uploading";

const GalleyImages = ({
  galleryImages,
  galleryimageLimit,
  handleGalleryImageLimit,
  plusImage,
  uploadInput,
  handleCheck,
  openGallery,
  openImage,
  shadowGalleryDivClick,
  deleteGalleryHandle,
  handleNameChangeOpen,
  imageGalleryChange,
  imageGalleryChangeSingle,
  galleryImageList,
  editGallery,
  setEditGallery,
}) => {
  const queryClient = useQueryClient();
  const [loadLock, setLoadLock] = useState(false);

  const { mutate: deleteGalleyImage, isLoading: loadingGalleryImage } =
    useMutation({
      mutationFn: (id) => {
        return request({
          url: `exhibitor/gallery-image/${id}`,
          method: "delete",
        });
      },
      onError: (error) => {
        setLoadLock(false);
        console.log("Update Error:", error);
      },
      onSuccess: () => {
        setLoadLock(false);
        queryClient.invalidateQueries("products");
      },
    });

  const deleteHandle = (product) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmed == true) {
      setLoadLock(true);
      deleteGalleyImage(product._id);
    }
  };
  return (
    <>
      {galleryImageList && galleryImageList.length > 0 && editGallery ? (
        <>
          <div
            className="border-b-[1px] flex justify-end cursor-pointer"
            onClick={() => setEditGallery(false)}
          >
            Add More{" "}
            <Image
              alt="img"
              height={100}
              width={100}
              className="w-5 h-auto cursor-pointer"
              src={`${BUCKET_URL}/stalls/plus.svg`}
            ></Image>
          </div>
          {loadLock ? (
            <Uploading />
          ) : (
            <div className="py-10 flex gap-3 md:flex-row flex-col md:felx-row flex-wrap">
              {galleryImageList.map((product, index) => (
                <div className="w-full md:w-auto mb-2" key={product?._id}>
                  <div
                    className={` bg-[#F5F5F5] rounded-lg w-24 h-24  bg-cover bg-center 
             imageHover`}
                    style={{
                      backgroundImage: `url('${product.url}')`,
                    }}
                  >
                    <div
                      className="flex flex-row gap-4 items-center justify-center 
            w-full h-full img md:hidden rounded-lg"
                    >
                      <Image
                        alt="img"
                        height={100}
                        width={100}
                        className=" w-5 h-auto cursor-pointer"
                        src={`${BUCKET_URL}/stalls/view.svg`}
                        onClick={() => openImage(product.url, "Stall Image")}
                      ></Image>
                      <Image
                        alt="img"
                        height={100}
                        width={100}
                        className="w-5 h-auto cursor-pointer"
                        src={`${BUCKET_URL}/stalls/remove.svg`}
                        unoptimized
                        onClick={() => deleteHandle(product)}
                      ></Image>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="w-full">
          <div className=" border-b-[1px] flex justify-between gal">
            <div
              className="flex justify-start cursor-pointer"
              onClick={() => setEditGallery(true)}
            >
              Cancel
            </div>
            <select
              value={galleryimageLimit}
              name="product"
              id="productList"
              className=" bg-[#F2F2F2] h-10 px-1 rounded-lg cursor-pointer"
              onChange={handleGalleryImageLimit}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>
          <div className="py-10 flex gap-3 md:flex-row flex-col md:felx-row">
            <div className="w-full md:w-auto mb-2 ">
              <div
                className="border border-dashed w-full h-24 md:w-24 md:aspect-square bg-[length:20px_20px] bg-no-repeat bg-center"
                style={{
                  backgroundImage: `url('${plusImage}')`,
                }}
              >
                <label
                  htmlFor="fileInputGallery"
                  className=" cursor-pointer h-full w-full flex items-center justify-center"
                ></label>
                <input
                  ref={uploadInput}
                  type="file"
                  id="fileInputGallery"
                  className=" hidden"
                  multiple
                  accept="image/*"
                  onChange={imageGalleryChange}
                ></input>
                <input
                  ref={uploadInput}
                  type="file"
                  id="fileInputGallery2"
                  className="hidden"
                  accept="image/*"
                  onChange={imageGalleryChangeSingle}
                ></input>
              </div>
              <p className=" text-xs text-accent-font-color font-lato text-center pt-1">
                Click to Upload
              </p>
            </div>
            <div className="flex flex-wrap gap-5 justify-around md:justify-start    max-h-[20rem] innerbottomshadow  overflow-auto">
              {galleryImages.map((item, index) => {
                let url = "";
                const value = "gallery";
                if (item.File != undefined) {
                  let type = item.File.type;
                  if (type == "application/pdf") {
                    url = `${BUCKET_URL}/stalls/docs.png`;
                  } else {
                    url = URL.createObjectURL(item.File);
                  }
                }
                let divStyle = {
                  backgroundImage: `url(${url})`,
                };
                return (
                  <div key={index} className="w-24">
                    <div className="w-full flex flex-row">
                      <div className=" w-1/2 flex justify-center items-center">
                        {/* <input
                      id={index}
                      className=" hidden checkboxProduct"
                      type="checkbox"
                      checked={item.locked}
                      onChange={(e) => handleCheck(e, index)}
                    /> */}
                        <label
                          className="label-for-check flex h-7 w-full"
                          htmlFor={index}
                        ></label>
                      </div>
                      <div className=" w-1/2 flex justify-center items-center">
                        <Image
                          alt="img"
                          height={100}
                          width={100}
                          className=" w-5 h-auto cursor-pointer"
                          src={`${BUCKET_URL}/stalls/view.svg`}
                          onClick={() => openGallery(index)}
                        ></Image>
                      </div>
                    </div>
                    <div
                      className={` bg-[#F5F5F5] rounded-lg w-24 h-24  bg-cover bg-center  imageHover`}
                      style={divStyle}
                      onClick={() => shadowGalleryDivClick(index, item.File)}
                    >
                      {item.File === undefined ? (
                        <div
                          className=" items-center justify-center w-full h-full img1 md:hidden rounded-lg bg-[length:20px_20px] bg-no-repeat bg-center cursor-pointer"
                          style={{
                            backgroundImage: `url('${plusImage}')`,
                          }}
                        ></div>
                      ) : (
                        <div className="flex flex-row gap-4 items-center justify-center w-full h-full img md:hidden rounded-lg">
                          <Image
                            alt="img"
                            height={100}
                            width={100}
                            className=" w-5 h-auto cursor-pointer"
                            src={`${BUCKET_URL}/stalls/remove.svg`}
                            onClick={() => deleteGalleryHandle(index)}
                          ></Image>
                          <Image
                            alt="img"
                            height={100}
                            width={100}
                            className=" w-5 h-auto cursor-pointer"
                            src={`${BUCKET_URL}/stalls/edit.png`}
                            onClick={() => handleNameChangeOpen(index, value)}
                            unoptimized
                          ></Image>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GalleyImages;
