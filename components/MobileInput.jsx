import React from "react";
import PhoneInput from "react-phone-input-2";

function MobileInput({ name, value, onChange }) {
  return (
    <PhoneInput
      name={name}
      required={true}
      inputStyle={{
        paddingLeft: "3rem",
        width: "100%",
        maxWidth: "100%",
        paddingRight: "0.5rem",
        paddingTop: "0.5rem",
        paddingBottom: "0.5rem",
        border: "solid 1px #a1a1a1",
      }}
      country={"in"}
      enableSearch={true}
      value={value}
      onChange={onChange}
    />
  );
}

export default MobileInput;
