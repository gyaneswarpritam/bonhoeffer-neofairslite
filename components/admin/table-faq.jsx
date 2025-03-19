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
import { faqData } from "@/models/adminData";
import Image from "next/image";

export default function TableFAQ(props) {
  const gridRef2 = useRef(); // Optional - for accessing Grid's API

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(() => ({
    sortable: true,
    resizable: true,
  }));

  // Example of consuming Grid Event
  const cellClickedListener = useCallback((event) => {
    console.log("cellClicked", event);
  }, []);

  // Example load data from server

  // Example using Grid's API
  const buttonListener = useCallback((e) => {
    gridRef2.current.api.deselectAll();
  }, []);

  return (
    <div>
      {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
      <div className="ag-theme-alpine h-[80vh] w-full">
        <AgGridReact
          ref={gridRef2} // Ref for accessing Grid's API
          rowData={this.props.rowData} // Row Data for Rows
          columnDefs={this.props.columnDefs} // Column Defs for Columns
          defaultColDef={defaultColDef} // Default Column Properties
          animateRows={true} // Optional - set to 'true' to have rows animate when sorted
          rowSelection="multiple" // Options - allows click selection of rows
          onCellClicked={cellClickedListener} // Optional - registering for Grid Event
        />
      </div>
    </div>
  );
}
