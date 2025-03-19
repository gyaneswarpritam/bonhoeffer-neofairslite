import React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Card, CardContent, Typography, Divider } from "@mui/material";
import Image from "next/image";
import StarRatingComponent from "react-star-rating-component";
import { BUCKET_URL } from "@/config/constant";

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  "& .MuiDataGrid-columnHeaders": {
    fontWeight: "bold",
    fontFamily: "lato",
  },
  "& .MuiDataGrid-cell": {
    fontFamily: "lato",
  },
}));

const paginationModel = { page: 0, pageSize: 5 };

export default function CommonDataTableView({ columns, rowData, imageclick, requestFileButton, handleDownload }) {
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <div>
      {isMobile ? (
        <div className="flex flex-col space-y-2 p-2">
          {rowData && rowData.length ? rowData.map((row) => (
            <Card key={row._id} sx={{ padding: 2 }} className="flex flex-col space-y-2">
              {columns.map((col) => (
                <div key={col.field} className="flex items-center space-x-4">
                  {/* Display Header Name */}
                  <Typography variant="subtitle2" fontWeight="bold" className="w-1/3">
                    {col.headerName}:
                  </Typography>

                  {/* Display Value */}
                  {col.field === "productUrl" ? (
                    row.productUrl.includes(".pdf") ? (
                      <Image
                        alt="pdf file"
                        width={30}
                        height={30}
                        src={`${BUCKET_URL}/PDF_file_icon.svg`}
                        className="cursor-pointer"
                        onClick={() => imageclick(row)}
                      />
                    ) : (
                      <Image
                        alt="youtube video"
                        width={200}
                        height={200}
                        src={`${BUCKET_URL}/youtube.png`}
                        className="h-auto w-10 cursor-pointer"
                        onClick={() => yotubeIconClick(row.productUrl)}
                        unoptimized
                      />
                    )
                  ) :
                    (col.field == "catalog" ? (
                      <div>
                        {row.productLocked == true ? (
                          value == true ? (
                            <p>Catalogue Requested</p>
                          ) : (
                            <button
                              style={{ color: "blue" }}
                              className=" cursor-pointer border-0 bg-none"
                              onClick={(e) => requestFileButton(e, row)}
                            >
                              Request for Catalogue
                            </button>
                          )
                        ) : (
                          <button
                            onClick={() => handleDownload(row)}
                            className="w-5 h-auto cursor-pointer"
                          >
                            <Image
                              alt="download"
                              src={`${BUCKET_URL}/download.svg`}
                              height={100}
                              width={100}
                              className=" w-5 h-auto cursor-pointer"
                            ></Image>
                          </button>
                        )}
                      </div>
                    ) : (
                      <Typography variant="body2" className="flex-1">
                        {row[col.field] ? row[col.field] : "N/A"}
                      </Typography>
                    ))
                  }
                </div>
              ))}

            </Card>
          )) :
            <></>}
        </div>

      ) : (
        <Paper sx={{ height: "90vh", width: "100%" }}>
          <StyledDataGrid
            rows={rowData}
            columns={columns}
            getRowId={(row) => row._id}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            components={{ Toolbar: GridToolbar }}
          />
        </Paper>
      )}
    </div>
  );
}
