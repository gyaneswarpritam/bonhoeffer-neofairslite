"use client";
import React from "react";
import TableMain from "../tableMain";

const CommonReportListComponent = ({ columns, rowData, filename }) => {
  return (
    <>
      <TableMain columnDefs={columns} rowData={rowData} filename={filename} />
    </>
  );
};

export default CommonReportListComponent;
