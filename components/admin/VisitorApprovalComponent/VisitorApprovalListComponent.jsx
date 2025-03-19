"use client";
import { request } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import React, { useState } from "react";
import TableMain from "../tableMain";
import { useForm } from "react-hook-form";
import { BUCKET_URL } from "@/config/constant";

const VisitorApprovalListComponent = ({ status }) => {
  const [modelOpen, setModelOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [profileModelOpen, setProfileModelOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  let columns;
  if (status.active) {
    columns = [
      {
        headerName: "Name",
        field: "name",
        filter: true,
        width: 150,
      },
      { headerName: "Company", field: "companyName", filter: true, width: 150 },
      { headerName: "Email", field: "email", filter: true, width: 250 },
      { headerName: "Phone", field: "phone", filter: true, width: 150 },
      // {
      //   headerName: "View",
      //   field: "isView",
      //   filter: true,
      //   width: 130,
      //   cellRenderer: (params) => {
      //     return (
      //       <div className="flex flex-col items-start justify-center h-full">
      //         <Image
      //           onClick={() => viewVisitor(params.data)}
      //           alt="view_icon"
      //           width={100}
      //           height={100}
      //           className={`cursor-pointer w-auto ${
      //             params.value ? `h-3` : `h-4`
      //           }`}
      //           src={`${BUCKET_URL}/admin/isView.svg`}
      //         />
      //       </div>
      //     );
      //   },
      // },
      {
        field: "Block",
        filter: true,
        width: 130,
        cellRenderer: (params) => {
          return (
            <div className="flex flex-col items-start justify-center h-full">
              <Image
                onClick={() => blockVisitor(params.data._id)}
                alt="block_icon"
                width={100}
                height={100}
                className={`cursor-pointer w-auto h-4`}
                src={`${BUCKET_URL}/admin/isBlocked.svg`}
              />
            </div>
          );
        },
      },
    ];
  } else if (status.blocked) {
    columns = [
      {
        headerName: "Name",
        field: "name",
        filter: true,
        width: 150,
      },
      { headerName: "Company", field: "companyName", filter: true, width: 150 },
      { headerName: "Email", field: "email", filter: true, width: 250 },
      { headerName: "Phone", field: "phone", filter: true, width: 150 },
      // {
      //   headerName: "View",
      //   field: "isView",
      //   filter: true,
      //   width: 130,
      //   cellRenderer: (params) => {
      //     return (
      //       <div className="flex flex-col items-start justify-center h-full">
      //         <Image
      //           onClick={() => viewVisitor(params.data)}
      //           alt="view_icon"
      //           width={100}
      //           height={100}
      //           className={`cursor-pointer w-auto ${
      //             params.value ? `h-3` : `h-4`
      //           }`}
      //           src={`${BUCKET_URL}/admin/isView.svg`}
      //         />
      //       </div>
      //     );
      //   },
      // },
      {
        field: "Restore",
        filter: true,
        width: 130,
        cellRenderer: (params) => {
          return (
            <div className="flex flex-col items-start justify-center h-full">
              <Image
                onClick={() => restoreVisitor(params.data._id)}
                alt="approval_icon"
                width={100}
                height={100}
                className={`cursor-pointer w-auto h-4`}
                src={`${BUCKET_URL}/admin/isRestore.svg`}
              />
            </div>
          );
        },
      },
    ];
  } else if (status.reject) {
    columns = [
      {
        headerName: "Name",
        field: "name",
        filter: true,
        width: 150,
      },
      { headerName: "Company", field: "companyName", filter: true, width: 150 },
      { headerName: "Email", field: "email", filter: true, width: 250 },
      { headerName: "Phone", field: "phone", filter: true, width: 150 },
      // {
      //   headerName: "View",
      //   field: "isView",
      //   filter: true,
      //   width: 130,
      //   cellRenderer: (params) => {
      //     return (
      //       <div className="flex flex-col items-start justify-center h-full">
      //         <Image
      //           onClick={() => viewVisitor(params.data)}
      //           alt="view_icon"
      //           width={100}
      //           height={100}
      //           className={`cursor-pointer w-auto ${
      //             params.value ? `h-3` : `h-4`
      //           }`}
      //           src={`${BUCKET_URL}/admin/isView.svg`}
      //         />
      //       </div>
      //     );
      //   },
      // },
      {
        field: "Restore To Request",
        filter: true,
        width: 130,
        cellRenderer: (params) => {
          return (
            <div className="flex flex-col items-start justify-center h-full">
              <Image
                onClick={() => restoreToRequest(params.data._id)}
                alt="approval_icon"
                width={100}
                height={100}
                className={`cursor-pointer w-auto h-4`}
                src={`${BUCKET_URL}/admin/isRestore.svg`}
              />
            </div>
          );
        },
      },
    ];
  } else {
    columns = [
      {
        headerName: "Name",
        field: "name",
        filter: true,
        width: 150,
      },
      { headerName: "Company", field: "companyName", filter: true, width: 150 },
      { headerName: "Email", field: "email", filter: true, width: 250 },
      { headerName: "Phone", field: "phone", filter: true, width: 150 },
      // {
      //   headerName: "View",
      //   field: "isView",
      //   filter: true,
      //   width: 130,
      //   cellRenderer: (params) => {
      //     return (
      //       <div className="flex flex-col items-start justify-center h-full">
      //         <Image
      //           onClick={() => viewVisitor(params.data)}
      //           alt="view_icon"
      //           width={100}
      //           height={100}
      //           className={`cursor-pointer w-auto ${
      //             params.value ? `h-3` : `h-4`
      //           }`}
      //           src={`${BUCKET_URL}/admin/isView.svg`}
      //         />
      //       </div>
      //     );
      //   },
      // },
      {
        field: "Approve",
        filter: true,
        width: 130,
        cellRenderer: (params) => {
          return (
            <div className="flex flex-col items-start justify-center h-full">
              <Image
                onClick={() =>
                  approveVisitor(params.data._id, params.data.email)
                }
                alt="approval_icon"
                width={100}
                height={100}
                className={`cursor-pointer w-auto h-4`}
                src={`${BUCKET_URL}/admin/isApproved.svg`}
              />
            </div>
          );
        },
      },
      {
        field: "Reject",
        filter: true,
        width: 130,
        cellRenderer: (params) => {
          return (
            <div className="flex flex-col items-start justify-center h-full">
              <Image
                alt="approval_icon"
                width={100}
                height={100}
                className={`cursor-pointer w-auto h-4`}
                src={`${BUCKET_URL}/admin/notApproved.svg`}
                onClick={() => rejectVisitor(params.data._id)}
              />
            </div>
          );
        },
      },
    ];
  }

  const approveVisitor = (id, email) => {
    setModelOpen(true);
    setValue("email", email);
    setSelectedId(id);
    // updateExhibitorData({ id: id, data: { active: true } });
  };
  const rejectVisitor = (id) => {
    updateVisitorData({ id: id, data: { active: false, reject: true } });
  };
  const blockVisitor = (id) => {
    updateVisitorData({ id: id, data: { active: true, blocked: true } });
  };
  const restoreVisitor = (id) => {
    updateVisitorData({ id: id, data: { active: true, blocked: false } });
  };
  const restoreToRequest = (id) => {
    updateVisitorData({
      id: id,
      data: { active: false, blocked: false, reject: false },
    });
  };
  const queryClient = useQueryClient();
  const updateVisitorsData = ({ id, data }) => {
    request({
      url: `admin/approve-visitor/${id}`,
      method: "put",
      data: data || [],
    });
  };
  const updateVisitorApprovalMutation = useMutation({
    mutationFn: updateVisitorsData,
    onSuccess: () => {
      queryClient.invalidateQueries("visitors-approval");
    },
  });

  const fetchVisitors = async () => {
    const queryString = new URLSearchParams(status).toString();
    return request({
      url: `admin/fetch-all-visitor?${queryString}`,
      method: "post",
      status,
    });
  };

  const {
    isLoading,
    data: visitorsData = [],
    isError,
    error,
  } = useQuery({
    queryKey: ["visitors-approval", status],
    queryFn: fetchVisitors,
    //refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return <h2>Loading ...</h2>;
  }

  if (isError) {
    return <h2>{error.message}</h2>;
  }

  const updateVisitorData = (id, data) => {
    updateVisitorApprovalMutation.mutate(id, data);
  };

  const onSubmit = async (data) => {
    try {
      updateVisitorData({
        id: selectedId,
        data: { password: data.password, active: true },
      });
      handleModelClose();
    } catch (error) {
      toast.error(error.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log("There was an error", error);
    }
  };

  const handleModelClose = (e) => {
    document.getElementsByTagName("body")[0].style.overflow = "unset";
    setModelOpen(false);
  };

  const handleProfileModelClose = (e) => {
    document.getElementsByTagName("body")[0].style.overflow = "unset";
    setProfileModelOpen(false);
  };

  const viewVisitor = (data) => {
    setProfileData(data);
    setProfileModelOpen(true);
  };

  return (
    <>
      {modelOpen ? (
        <div className="w-full h-[100%] bg-[#000000af] fixed left-0 right-0 top-0 bottom-0 z-[1000] py-5 px-2 md:p-5">
          <div className=" rounded-[32px] absolute top-24 left-1/4 overflow-hidden h-auto w-2/4 bg-white pb-5 po">
            <div className=" headerDiv w-full h-20 flex flex-row gap-3 justify-between px-5 items-center bg-[#222222] text-white text-lg font-lato">
              <p className=" header text-xl font-lato font-bold">
                APPROVE VISITOR
              </p>
              <div
                onClick={() => handleModelClose()}
                className=" w-auto h-5 aspect-square rounded-full bg-brand-color cursor-pointer flex justify-center items-center"
              >
                <Image
                  alt="close"
                  height={100}
                  width={100}
                  src={`${BUCKET_URL}/visitor/close.svg`}
                  className="w-[60%] h-auto"
                ></Image>
              </div>
            </div>
            <div className=" w-full h-full px-2 md:px-8 bg-white rounded-b-[32px] pb-5">
              <div className="w-full min-h-fit h-full max-h-[90%] bg-white mt-5">
                <form
                  className="flex-col flex "
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                >
                  <input
                    placeholder="Email"
                    className="py-3 px-2 w-full  rounded-lg text-base font-quickSand font-medium"
                    name="email"
                    type="text"
                    readOnly
                    style={{ border: "1px solid" }}
                    {...register("email", {
                      required: {
                        value: true,
                        message: "Email is required.",
                      },
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: `Invalid email`,
                      },
                    })}
                  />
                  <p style={{ color: "red" }}>
                    {errors && errors["email"] && errors["email"].message}
                  </p>
                  <input
                    placeholder="Password"
                    className="py-3 px-2 w-full  rounded-lg text-base font-quickSand font-medium mt-2"
                    name="password"
                    type="password"
                    style={{ border: "1px solid" }}
                    {...register("password", {
                      required: {
                        value: true,
                        message: "Password is required.",
                      },
                    })}
                  />
                  <p style={{ color: "red" }}>
                    {errors && errors["password"] && errors["password"].message}
                  </p>
                  <input
                    type="submit"
                    value="UPDATE PASSWORD"
                    name="submit"
                    className="cursor-pointer font-quicksand text-sm font-bold text-white bg-static-black rounded-lg px-10 py-3 mt-4 w-full "
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {profileModelOpen ? (
        <div className="w-full h-[100%] bg-[#000000af] fixed left-0 right-0 top-0 bottom-0 z-[1000] ">
          <div className=" rounded-[32px]  overflow-hidden w-full bg-white pb-5 po h-full">
            <div className=" headerDiv w-full h-20 flex flex-row gap-3 justify-between px-5 items-center bg-[#222222] text-white text-lg font-lato">
              <p className=" header text-xl font-lato font-bold">
                PROFILE DETAILS
              </p>
              <div
                onClick={() => handleProfileModelClose()}
                className=" w-auto h-5 aspect-square rounded-full bg-brand-color cursor-pointer flex justify-center items-center"
              >
                <Image
                  alt="close"
                  height={100}
                  width={100}
                  src={`${BUCKET_URL}/visitor/close.svg`}
                  className="w-[60%] h-auto"
                ></Image>
              </div>
            </div>
            <div className=" w-full h-full px-2 md:px-8 bg-white rounded-b-[32px] pb-5">
              <div className="w-full min-h-fit h-full max-h-[90%] bg-white mt-5 overflow-auto pb-5">
                <h2 className="text-2xl lg:text-2xl text-center mb-4">
                  Basic Information
                </h2>
                <div className="container mx-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-1">
                    <div className="px-4 bg-gray-200 rounded flex">
                      <div className="font-bold">Name:</div>
                      <div className="pl-4">{`${profileData.name} `}</div>
                    </div>
                    <div className="px-4 bg-gray-200 rounded flex">
                      <div className="font-bold">Mobile:</div>
                      <div className="pl-4">+{profileData.phone}</div>
                    </div>
                    <div className="px-4 bg-gray-200 rounded flex">
                      <div className="font-bold">Email:</div>
                      <div className="pl-4">{profileData.email}</div>
                    </div>
                    <div className="px-4 bg-gray-200 rounded flex">
                      <div className="font-bold">Designation</div>
                      <div className="pl-4">{profileData.designation}</div>
                    </div>
                    <div className="px-4 bg-gray-200 rounded flex">
                      <div className="font-bold">Company Name</div>
                      <div className="pl-4">{profileData.companyName}</div>
                    </div>
                    <div className="px-4 bg-gray-200 rounded flex">
                      <div className="font-bold">Company Address</div>
                      <div className="pl-4">{profileData.address}</div>
                    </div>
                    <div className="px-4 bg-gray-200 rounded flex">
                      <div className="font-bold">Country</div>
                      <div className="pl-4">{profileData.country}</div>
                    </div>
                  </div>
                </div>
                <h2 className="text-2xl lg:text-2xl text-center mb-4">
                  Product Information
                </h2>
                <div className="container mx-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-1">
                    <div className="px-4 bg-gray-200 rounded flex">
                      <div className="font-bold">Bath linen:</div>
                      <div className="pl-4">
                        {profileData.productInfo["Bath linen"]}
                      </div>
                    </div>
                    <div className="px-4 bg-gray-200 rounded flex">
                      <div className="font-bold">Bed linen:</div>
                      <div className="pl-4">
                        {profileData.productInfo["Bed linen"]}
                      </div>
                    </div>
                    <div className="px-4 bg-gray-200 rounded flex">
                      <div className="font-bold">Curtains:</div>
                      <div className="pl-4">
                        {profileData.productInfo["Curtains"]}
                      </div>
                    </div>
                    <div className="px-4 bg-gray-200 rounded flex">
                      <div className="font-bold">Fabrics:</div>
                      <div className="pl-4">
                        {profileData.productInfo["Fabrics"]}
                      </div>
                    </div>
                    <div className="px-4 bg-gray-200 rounded flex">
                      <div className="font-bold">Fashion Accessories:</div>
                      <div className="pl-4">
                        {profileData.productInfo["Fashion Accessories"]}
                      </div>
                    </div>
                    <div className="px-4 bg-gray-200 rounded flex">
                      <div className="font-bold">Floor Covering:</div>
                      <div className="pl-4">
                        {profileData.productInfo["Floor Covering"]}
                      </div>
                    </div>
                    <div className="px-4 bg-gray-200 rounded flex">
                      <div className="font-bold">Furnishing Articles:</div>
                      <div className="pl-4">
                        {profileData.productInfo["Furnishing Articles"]}
                      </div>
                    </div>
                    <div className="px-4 bg-gray-200 rounded flex">
                      <div className="font-bold">Kitchen linen:</div>
                      <div className="pl-4">
                        {profileData.productInfo["Kitchen linen"]}
                      </div>
                    </div>
                    <div className="px-4 bg-gray-200 rounded flex">
                      <div className="font-bold">Table linen:</div>
                      <div className="pl-4">
                        {profileData.productInfo["Table linen"]}
                      </div>
                    </div>
                    <div className="px-4 bg-gray-200 rounded flex">
                      <div className="font-bold">
                        Trimmings and Embellishments:
                      </div>
                      <div className="pl-4">
                        {
                          profileData.productInfo[
                            "Trimmings and Embellishments"
                          ]
                        }
                      </div>
                    </div>
                  </div>
                </div>
                <h2 className="text-2xl lg:text-2xl text-center mb-4">
                  Other Information
                </h2>
                <div className="container mx-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
                    <div className="px-4 bg-gray-200 rounded flex">
                      <div className="font-bold">Telephone Number:</div>
                      <div className="pl-4">
                        {profileData.optionalInfo.name}
                      </div>
                    </div>
                    <div className="px-4 bg-gray-200 rounded flex">
                      <div className="font-bold">Company Website:</div>
                      <div className="pl-4">
                        +{profileData.optionalInfo.companyWebsite}
                      </div>
                    </div>
                    <div className="px-4 bg-gray-200 rounded flex">
                      <div className="font-bold">Year of Establishment:</div>
                      <div className="pl-4">
                        {profileData.optionalInfo.yearOfEstablishment}
                      </div>
                    </div>
                    <div className="px-4 bg-gray-200 rounded flex">
                      <div className="font-bold">Major Countries of Export</div>
                      <div className="pl-4">
                        {profileData.optionalInfo.exportingCountries}
                      </div>
                    </div>
                    <div className="px-4 bg-gray-200 rounded flex">
                      <div className="font-bold">Major Products of Export</div>
                      <div className="pl-4">
                        {profileData.optionalInfo.exportsProduct}
                      </div>
                    </div>
                    <div className="px-4 bg-gray-200 rounded flex">
                      <div className="font-bold">Specify if any other</div>
                      <div className="pl-4">
                        {profileData.optionalInfo.specifyifother}
                      </div>
                    </div>
                    <div className="px-4 bg-gray-200 rounded flex">
                      <div className="font-bold">
                        Turnover of your company in USD Million
                      </div>
                      <div className="pl-4">
                        {profileData.optionalInfo.turnover_2017_2018},
                        {profileData.optionalInfo.turnover_2018_2019},
                        {profileData.optionalInfo.turnover_2019_2020}
                      </div>
                    </div>
                    <div className="px-4 bg-gray-200 rounded flex">
                      <div className="font-bold">
                        Details Of The Exports Of Textile Products For The Past
                        3 Years (In USD Million)
                      </div>
                      <div className="pl-4">
                        {profileData.optionalInfo.export_year_one},
                        {profileData.optionalInfo.export_year_two},
                        {profileData.optionalInfo.export_year_three},
                      </div>
                    </div>
                    <div className="px-4 bg-gray-200 rounded flex">
                      <div className="font-bold">
                        Whether the company is already exporting? Yes / No
                      </div>
                      <div className="pl-4">
                        {profileData.optionalInfo.exporting}
                      </div>
                    </div>
                    <div className="px-4 bg-gray-200 rounded flex">
                      <div className="font-bold">
                        Value Of Handwoven Textiles Exports In USD:
                      </div>
                      <div className="pl-4">
                        {profileData.optionalInfo.country}
                      </div>
                    </div>
                    <div className="px-4 bg-gray-200 rounded flex">
                      <div className="font-bold">
                        Have you participated in any event organized by HEPC in
                        India ?
                      </div>
                      <div className="pl-4">
                        {profileData.optionalInfo.participated_event}
                      </div>
                    </div>
                    <div className="px-4 bg-gray-200 rounded flex">
                      <div className="font-bold">
                        How did you know about the event?
                      </div>
                      <div className="pl-4">
                        {profileData.optionalInfo.know_about_event}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      <TableMain
        columnDefs={columns}
        rowData={visitorsData}
        filename={"Visitor-approval"}
      />
    </>
  );
};

export default VisitorApprovalListComponent;
