import React from "react";
import ExhibitorChatview from "./exhibitor-chatview/page";

const ExhibitorChatModal = ({ handleClose }) => {
  return (
    <div
      className="w-full h-full fixed left-0 top-0 flex flex-col 
    justify-center items-center mx-auto my-auto px-1 py-1 overflow-auto gap-5 z-[99999] bg-bg-grey"
    >
      <ExhibitorChatview handleClose={handleClose} />
    </div>
  );
};

export default ExhibitorChatModal;
