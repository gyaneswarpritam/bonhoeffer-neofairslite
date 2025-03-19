import React, { useState } from "react";

function StallInfo({
  dataObject,
  setDataObject,
  // constantCertification,
  // handleCheckboxChange,
  // selectedCertifications,
  plus,
  minus,
  tab,
}) {
  const [errors, setErrors] = useState({});

  // Function to handle validation
  const validate = () => {
    let newErrors = {};

    // Validate Stall Name
    if (!dataObject.stallName || dataObject.stallName.trim() === "") {
      newErrors.stallName = "Stall Name is required.";
    }

    // Validate Stall Description
    if (
      !dataObject.stallDescription ||
      dataObject.stallDescription.trim() === ""
    ) {
      newErrors.stallDescription = "Exhibitor Information is required.";
    }

    // Return error object
    return newErrors;
  };

  // Function to handle the Next button click
  const handleNext = (e) => {
    const validationErrors = validate();

    if (Object.keys(validationErrors).length === 0) {
      // If no validation errors, proceed with plus(0)
      plus(0);
    } else {
      // Set errors if validation fails
      setErrors(validationErrors);
    }
  };

  return (
    <div className="tabs w-full h-full flex flex-col justify-between ">
      <div className=" flex flex-col p-5 md:p-10 gap-2.5 ">
        <label className="font-quickSand text-sm font-bold">Stall Name</label>
        <input
          type="text"
          placeholder="Stall Name"
          value={dataObject.stallName}
          className={`bg-[#F2F2F2] rounded-lg h-10 md:w-1/2 w-full max-w-[345px] px-2 py-5 ${
            errors.stallName ? "border-red-500" : ""
          }`}
          onChange={(e) => {
            setDataObject({
              ...dataObject,
              stallName: e.target.value,
            });
            setErrors({ ...errors, stallName: "" }); // Clear the error when user types
          }}
        />
        {errors.stallName && (
          <p className="text-red text-sm">{errors.stallName}</p>
        )}
        <label className="font-quickSand text-sm font-bold">
          Stall Description
        </label>
        <textarea
          type="text"
          placeholder="Exhibitor Information"
          className={`bg-[#F2F2F2] rounded-lg h-24 w-full p-5 ${
            errors.stallDescription ? "border-red-500" : ""
          }`}
          value={dataObject.stallDescription}
          onChange={(e) => {
            setDataObject({
              ...dataObject,
              stallDescription: e.target.value,
            });
            setErrors({ ...errors, stallDescription: "" }); // Clear the error when user types
          }}
        />
        {errors.stallDescription && (
          <p className="text-red text-sm">{errors.stallDescription}</p>
        )}

        {/* <h3 style={{ fontWeight: "bold" }}>Certification</h3>

        <section className="grid w-full gap-5">
          <div>
            {constantCertification &&
              constantCertification.certification.map((checkbox, index) => (
                <div key={index}>
                  <input
                    type="checkbox"
                    id={checkbox.value}
                    value={checkbox.value}
                    onChange={handleCheckboxChange}
                    checked={selectedCertifications.includes(checkbox.value)}
                  />
                  <label
                    htmlFor={checkbox.value}
                    style={{ marginLeft: "10px" }}
                  >
                    {checkbox.name}
                  </label>
                </div>
              ))}
          </div>
        </section> */}
      </div>
      <div className=" border-t-[1px] text-base font-quickSand font-bold flex justify-start gap-5 pt-5 pb-10">
        <button
          onClick={minus}
          className={`bg-[#DDDDDC] ${
            tab > 1 ? "" : "hidden"
          } text-[#5E6672] h-10 px-5 rounded-lg`}
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className=" bg-brand-color h-10 px-5 rounded-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default StallInfo;
