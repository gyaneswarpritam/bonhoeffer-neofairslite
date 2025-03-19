import React from "react";

function Input({ type, name }) {
  return (
    <>
      <input
        type={type}
        {...(type == "email"
          ? {
              ...register(name, {
                required: {
                  value: true,
                  message: `${name} is required`,
                },
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: `Invalid email`,
                },
              }),
            }
          : {
              ...register(name, {
                required: {
                  value: true,
                  message: `${name} is required`,
                },
              }),
            })}
      />
      <p>{errors[name].message}</p>
    </>
  );
}

export default Input;
