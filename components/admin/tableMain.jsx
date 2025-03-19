import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS

export default function TableMain({
  filename,
  rowData,
  columnDefs,
  height = 80,
}) {
  const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const gridRef2 = useRef(); // Optional - for accessing Grid's API

  const onBtnExport = useCallback(() => {
    const fileName = `${filename}-${getCurrentDate()}.csv`;
    gridRef2.current.api.exportDataAsCsv({ fileName });
  }, []);

  return (
    <div>
      <div>
        <button
          style={{ backgroundColor: "#c8fb51", marginBottom: "10px" }}
          onClick={onBtnExport}
          class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
        >
          <svg
            class="fill-current w-4 h-4 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
          </svg>
          <span>Download CSV export file</span>
        </button>
      </div>

      {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
      <div className={`ag-theme-alpine h-[${height}vh] w-full`}>
        <AgGridReact
          ref={gridRef2} // Ref for accessing Grid's API
          rowData={rowData} // Row Data for Rows
          columnDefs={columnDefs} // Column Defs for Columns
          // defaultColDef={defaultColDef} // Default Column Properties
          animateRows={true} // Optional - set to 'true' to have rows animate when sorted
          rowSelection="multiple" // Options - allows click selection of rows
          // onCellClicked={cellClickedListener} // Optional - registering for Grid Event
          paginationAutoPageSize={true}
          pagination={true}
        />
      </div>
    </div>
  );
}
