import React, { useCallback } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import FileSaver from "file-saver";
import { styled } from "@mui/material/styles";

// Styled DataGrid component for header and alternate row colors
const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  "& .MuiDataGrid-columnHeaders": {
    // backgroundColor: theme.palette.common.black,
    // color: theme.palette.common.white,
    fontWeight: "bold",
    fontFamily: "lato",
  },
  // "& .MuiDataGrid-row:nth-of-type(odd)": {
  //   backgroundColor: theme.palette.action.hover,
  // },
  // "& .MuiDataGrid-row:nth-of-type(even)": {
  //   backgroundColor: theme.palette.common.white,
  // },
  "& .MuiDataGrid-cell": {
    fontFamily: "lato",
  },
}));

const paginationModel = { page: 0, pageSize: 100 };

export default function CommonDataTable({ columns, rowData, filename }) {
  const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const onBtnExport = useCallback(() => {
    const fileName = `${filename}-${getCurrentDate()}.csv`;
    const headers = columns.map((col) => col.headerName).join(",") + "\n";
    const rows = rowData
      .map((row) =>
        columns.map((col) => (row[col.field] || "").toString()).join(",")
      )
      .join("\n");
    const csvContent = headers + rows;

    // Save CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    FileSaver.saveAs(blob, fileName);
  }, [columns, rowData, filename]);

  return (
    <div>
      <div>
        <button
          style={{ backgroundColor: "#c8fb51", marginBottom: "10px" }}
          onClick={onBtnExport}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
        >
          <svg
            className="fill-current w-4 h-4 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
          </svg>
          <span>Download CSV export file</span>
        </button>
      </div>
      <Paper sx={{ height: "auto", width: "100%" }}>
        <StyledDataGrid
          rows={rowData}
          columns={columns}
          getRowId={(row) => row._id}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[10, 20, 50, 100]}
          components={{ Toolbar: GridToolbar }}
        />
      </Paper>
    </div>
  );
}
