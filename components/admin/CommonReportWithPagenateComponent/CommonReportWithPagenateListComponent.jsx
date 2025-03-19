import React, { useState, useEffect } from "react";
import TableMainWithCount from "../visitorTrackingReportComponent";

const CommonReportWithPagenateListComponent = ({
  columns,
  rowData,
  totalCount,
  totalPages,
}) => {
  return (
    <TableMainWithCount
      columnDefs={columns}
      rowData={rowData}
      totalCount={totalCount}
      totalPages={totalPages}
    />
  );
};

export default CommonReportWithPagenateListComponent;
