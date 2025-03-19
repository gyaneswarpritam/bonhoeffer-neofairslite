import { BUCKET_URL } from "@/config/constant";
import Image from "next/image";
import React, { useState } from "react";
import { Tooltip } from "react-tooltip";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "@/lib/axios";
import Uploading from "@/components/uploading";

const CompanyProfile = ({
  companyProfiles,
  companyProfileLimit,
  handleCompanyProfileLimit,
  plusImage,
  companyProfileChange,
  companyProfileChangeSingle,
  uploadInput,
  openCompany,
  shadowCompanyProfileDivClick,
  deleteCompanyProfileHandle,
  handleNameChangeOpen,
  editProfile,
  setEditProfile,
  companyProfileList,
  showProduct,
}) => {
  const queryClient = useQueryClient();
  const [loadLock, setLoadLock] = useState(false);

  const {
    mutate: updateCompanyProfile,
    isLoading: loadingUpdate,
    isError,
    error,
  } = useMutation({
    mutationFn: (data) => {
      return request({
        url: `exhibitor/companyProfileList/${data.id}`, // Use the id from the data
        method: "put",
        data: { locked: data.locked }, // Send the updated locked status
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

  const { mutate: deleteProduct, isLoading: loadingDelete } = useMutation({
    mutationFn: (id) => {
      return request({
        url: `exhibitor/companyProfileList/${id}`,
        method: "delete",
      });
    },
    onError: (error) => {
      setLoadLock(false);
      console.log("Delete Error:", error);
    },
    onSuccess: () => {
      setLoadLock(false);
      queryClient.invalidateQueries("products");
    },
  });

  const handleCheck = (e, index) => {
    const company = companyProfileList[index]; // Get the company profile from the list
    const updatedCompany = { id: company._id, locked: e.target.checked }; // Include the id
    setLoadLock(true);
    updateCompanyProfile(updatedCompany);
  };

  const deleteHandle = (company) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmed) {
      setLoadLock(true);
      deleteProduct(company._id);
    }
  };

  return (
    <>
      {companyProfileList && companyProfileList.length > 0 && editProfile ? (
        <>
          <div
            className="border-b-[1px] flex justify-end cursor-pointer"
            onClick={() => setEditProfile(false)}
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
            <div className="py-10 flex gap-3 md:flex-row flex-col flex-wrap">
              {companyProfileList &&
                companyProfileList.map((company, index) => (
                  <div
                    className="w-full md:w-auto mb-2"
                    key={company?._id}
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content={company.title}
                  >
                    <div className="w-full flex flex-row">
                      <div className="w-full flex justify-center items-center">
                        <input
                          id={`company-checkbox-${index}`} // Ensure unique ID
                          className="hidden checkboxProduct"
                          type="checkbox"
                          checked={company.locked}
                          onChange={(e) => handleCheck(e, index)}
                        />
                        <label
                          className="label-for-check flex h-7 w-full cursor-pointer"
                          htmlFor={`company-checkbox-${index}`} // Ensure matching ID
                        ></label>
                      </div>
                    </div>
                    <div
                      className={`bg-[#F5F5F5] rounded-lg w-24 h-24 bg-cover bg-center imageHover`}
                      style={{
                        backgroundImage: `url(${BUCKET_URL}/stalls/pdf.svg)`,
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
                          className="w-5 h-auto cursor-pointer"
                          src={`${BUCKET_URL}/stalls/view.svg`}
                          onClick={() => showProduct(company.url, "pdf")}
                        ></Image>
                        <Image
                          alt="img"
                          height={100}
                          width={100}
                          className="w-5 h-auto cursor-pointer"
                          src={`${BUCKET_URL}/stalls/remove.svg`}
                          onClick={() => deleteHandle(company)}
                        ></Image>
                      </div>
                    </div>
                  </div>
                ))}
              <Tooltip id="my-tooltip" />
            </div>
          )}
        </>
      ) : (
        <div className="w-full">
          <div className="border-b-[1px] flex justify-between">
            <div
              className="flex justify-start cursor-pointer"
              onClick={() => setEditProfile(true)}
            >
              Cancel{" "}
            </div>
            <select
              value={companyProfileLimit}
              name="companyprofile"
              id="companyprofileList"
              className="bg-[#F2F2F2] h-10 px-1 rounded-lg cursor-pointer"
              onChange={handleCompanyProfileLimit}
            >
              {[...Array(10).keys()].map((value) => (
                <option key={value + 1} value={value + 1}>
                  {value + 1}
                </option>
              ))}
            </select>
          </div>
          <div className="py-10 flex gap-3 md:flex-row flex-col md:flex-row">
            <div className="w-full md:w-auto mb-2">
              <div
                className="border border-dashed w-full h-24 md:w-24 md:aspect-square bg-[length:20px_20px] bg-no-repeat bg-center"
                style={{
                  backgroundImage: `url('${plusImage}')`,
                }}
              >
                <label
                  htmlFor="fileInputCompanyProfile"
                  className="cursor-pointer h-full w-full flex items-center justify-center"
                ></label>
                <input
                  ref={uploadInput}
                  type="file"
                  id="fileInputCompanyProfile"
                  className="hidden"
                  multiple
                  accept="application/pdf"
                  onChange={companyProfileChange}
                ></input>
                <input
                  ref={uploadInput}
                  type="file"
                  id="fileInputCompanyProfile2"
                  className="hidden"
                  accept="application/pdf"
                  onChange={companyProfileChangeSingle}
                ></input>
              </div>
              <p className="text-xs text-accent-font-color font-lato text-center pt-1">
                Click to Upload
              </p>
            </div>
            <div className="flex flex-wrap gap-5 justify-around md:justify-start max-h-[20rem] innerbottomshadow overflow-auto">
              {companyProfiles.map((item, index) => {
                let url = "";
                if (item.File !== undefined) {
                  let type = item.File.type;
                  if (type === "application/pdf") {
                    url = `${BUCKET_URL}/stalls/pdf.svg`;
                  } else {
                    url = URL.createObjectURL(item.File);
                  }
                }
                let divStyle = {
                  backgroundImage: `url(${url})`,
                };
                const value = "company profile";
                return (
                  <div key={index} className="w-24">
                    <div className="w-full flex flex-row">
                      <div className="w-1/2 flex justify-center items-center">
                        <input
                          id={`item-checkbox-${index}`} // Ensure unique ID
                          className="hidden checkboxProduct"
                          type="checkbox"
                          checked={item.locked}
                          onChange={(e) => handleCheck(e, index)}
                        />
                        <label
                          className="label-for-check flex h-7 w-full cursor-pointer"
                          htmlFor={`item-checkbox-${index}`} // Ensure matching ID
                        ></label>
                      </div>
                      <div className="w-1/2 flex justify-center items-center">
                        <Image
                          alt="img"
                          height={100}
                          width={100}
                          className="w-5 h-auto cursor-pointer"
                          src={`${BUCKET_URL}/stalls/view.svg`}
                          onClick={() => openCompany(index)}
                        ></Image>
                      </div>
                    </div>
                    <div
                      className={`bg-[#F5F5F5] rounded-lg w-24 h-24 bg-cover bg-center bg-no-repeat imageHover`}
                      style={divStyle}
                      onClick={() =>
                        shadowCompanyProfileDivClick(index, item.File)
                      }
                    >
                      {item.File === undefined ? (
                        <div
                          className="items-center justify-center w-full h-full img1 md:hidden rounded-lg bg-[length:20px_20px] bg-no-repeat bg-center cursor-pointer"
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
                            className="w-5 h-auto cursor-pointer"
                            src={`${BUCKET_URL}/stalls/remove.svg`}
                            onClick={() => deleteCompanyProfileHandle(index)}
                          ></Image>
                          <Image
                            alt="img"
                            height={100}
                            width={100}
                            className="w-5 h-auto cursor-pointer"
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

export default CompanyProfile;
