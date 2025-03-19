import { useState } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

function PdfViewer(pdfFile) {
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);

  function handleZoomIn() {
    setScale(scale * 1.1);
  }

  function handleZoomOut() {
    setScale(scale / 1.1);
  }

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  return (
    <>
      <div className=" w-full h-20 flex justify-center items-center gap-10">
        <button
          className=" border-0 h-full aspect-square bg-accent-font-color text-white rounded-full p-3 text-base font-bold cursor-pointer"
          onClick={handleZoomIn}
        >
          +
        </button>
        <button
          className=" border-0 h-full aspect-square bg-accent-font-color text-white rounded-full p-3 text-base font-bold cursor-pointer"
          onClick={handleZoomOut}
        >
          -
        </button>
      </div>
      <div className="flex justify-center items-center">
        <Document
          file={pdfFile.file ? pdfFile.file : "/sample.pdf"}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          {Array.apply(null, Array(numPages))
            .map((x, i) => i + 1)
            .map((page, index) => (
              <Page
                key={index}
                scale={scale}
                pageNumber={page}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            ))}
        </Document>
      </div>
    </>
  );
}

export default PdfViewer;
