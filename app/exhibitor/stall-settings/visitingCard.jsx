import React from "react";

const VisitingCard = ({ setDataObject, dataObject, errors }) => {
  return (
    <div className="w-full flex flex-col gap-4 ">
      <div>
        <label htmlFor="Name" className="mb-2 font-quickSand text-sm font-bold">
          Name
        </label>
        <input
          id="Name"
          className={`w-full text-sm font-quickSand font-semibold h-10 rounded-lg bg-[#F2F2F2] px-3 ${
            errors.name ? "border-red-500" : ""
          }`}
          type="text"
          placeholder="Name"
          value={dataObject.visitng_card_details.name}
          onChange={(e) => {
            setDataObject({
              ...dataObject,
              visitng_card_details: {
                ...dataObject.visitng_card_details,
                name: e.target.value,
              },
            });
          }}
        />
        {errors.name && <p className="text-red text-xs mt-1">{errors.name}</p>}
      </div>
      <div>
        <label
          htmlFor="Email"
          className="mb-2 font-quickSand text-sm font-bold"
        >
          Email
        </label>
        <input
          id="Email"
          className={`w-full text-sm font-quickSand font-semibold h-10 rounded-lg bg-[#F2F2F2] px-3 ${
            errors.email ? "border-red-500" : ""
          }`}
          type="text"
          placeholder="Email"
          value={dataObject.visitng_card_details.email}
          onChange={(e) => {
            setDataObject({
              ...dataObject,
              visitng_card_details: {
                ...dataObject.visitng_card_details,
                email: e.target.value,
              },
            });
          }}
        />
        {errors.email && (
          <p className="text-red text-xs mt-1">{errors.email}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="Phone"
          className="mb-2 font-quickSand text-sm font-bold"
        >
          Phone Number
        </label>
        <input
          id="Phone"
          className={`w-full text-sm font-quickSand font-semibold h-10 rounded-lg bg-[#F2F2F2] px-3 ${
            errors.phone ? "border-red-500" : ""
          }`}
          type="text"
          placeholder="Phone"
          value={dataObject.visitng_card_details.phone}
          onChange={(e) => {
            setDataObject({
              ...dataObject,
              visitng_card_details: {
                ...dataObject.visitng_card_details,
                phone: e.target.value,
              },
            });
          }}
        />
        {errors.phone && (
          <p className="text-red text-xs mt-1">{errors.phone}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="Website"
          className="mb-2 font-quickSand text-sm font-bold"
        >
          Website
        </label>
        <input
          id="Website"
          className="w-full text-sm font-quickSand font-semibold h-10 rounded-lg bg-[#F2F2F2] px-3"
          type="text"
          placeholder="Website"
          value={dataObject.visitng_card_details.website}
          onChange={(e) => {
            setDataObject({
              ...dataObject,
              visitng_card_details: {
                ...dataObject.visitng_card_details,
                website: e.target.value,
              },
            });
          }}
        />
      </div>
      <div>
        <label
          htmlFor="Address"
          className="mb-2 font-quickSand text-sm font-bold"
        >
          Address
        </label>
        <input
          id="Address"
          className="w-full text-sm font-quickSand font-semibold h-10 rounded-lg bg-[#F2F2F2] px-3"
          type="text"
          placeholder="Address"
          value={dataObject.visitng_card_details.address}
          onChange={(e) => {
            setDataObject({
              ...dataObject,
              visitng_card_details: {
                ...dataObject.visitng_card_details,
                address: e.target.value,
              },
            });
          }}
        />
        {errors.address && (
          <p className="text-red text-xs mt-1">{errors.address}</p>
        )}
      </div>
    </div>
  );
};

export default VisitingCard;
