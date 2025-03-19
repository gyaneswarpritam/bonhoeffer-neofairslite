import React from "react";
import PdfViewer from "./pdfViewer";

const PdfModal = ({ pdfFile, closePDFFile }) => {
  return (
    <div className="w-full h-full bg-white fixed left-0 top-0 z-[500] flex flex-col justify-start mx-auto my-auto px-10 py-10 overflow-scroll gap-5">
      <PdfViewer className=" h-[70%]" file={pdfFile}></PdfViewer>
      <button
        onClick={closePDFFile}
        className="fixed z-20 top-10 right-10 cursor-pointer"
      >
        Close
      </button>
    </div>
  );
};

export default PdfModal;
