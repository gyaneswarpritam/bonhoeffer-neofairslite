import React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Card, CardContent, Typography, Divider } from "@mui/material";
import Image from "next/image";
import StarRatingComponent from "react-star-rating-component";
import { BUCKET_URL } from "@/config/constant";
import AddTaskIcon from '@mui/icons-material/AddTask';

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

export default function CommonProductDataTableView({ columns, rowData, imageclick,
  yotubeIconClick, headerName, likeClick, handleRatingClick, briefcaseClick }) {
  const isMobile = useMediaQuery("(max-width:600px)");
  return (
    <div>
      {isMobile ? (
        <div className="flex flex-col space-y-2">
          {rowData.map((row) => (
            <Card key={row._id} sx={{ padding: 2 }} className="flex items-center">
              {headerName === "Video" ?
                <Image
                  alt="youtube video"
                  width={200}
                  height={200}
                  src={`${BUCKET_URL}/youtube.png`}
                  className="h-auto w-10 my-auto cursor-pointer mt-1"
                  onClick={() => yotubeIconClick(row.url)}
                  unoptimized
                /> :
                <Image
                  alt="pdf file"
                  width={50}
                  height={50}
                  src={`${BUCKET_URL}/PDF_file_icon.svg`}
                  className="cursor-pointer"
                  onClick={() => imageclick(row)}
                />
              }

              <div className="ml-4 flex-1">
                <Typography variant="h6" fontWeight="bold">
                  {row.title}
                </Typography>
                {headerName === "Product List" ?
                  <div className="flex items-center mt-1">
                    <>
                      {row.value ? (
                        <StarRatingComponent
                          name={row._id}
                          value={row.review || 0}
                          starCount={5}
                          starColor={"#ffb400"}
                          emptyStarColor={"#ccc"}
                        />
                      ) : (
                        <StarRatingComponent
                          name={row._id}
                          value={row.review || 0}
                          onStarClick={(nextValue) =>
                            handleRatingClick(row, nextValue)
                          }
                          starCount={5}
                          starColor={"#ffb400"}
                          emptyStarColor={"#ccc"}
                        />
                      )}
                    </>
                  </div> : ``}
              </div>
              {headerName === "Product List" ?
                <div className="flex items-center space-x-5">
                  <div>
                    {row.briefcase ? (
                      <AddTaskIcon sx={{ fontSize: 32, fontWeight: "bold", color: "green" }} />
                    ) : (
                      <Image
                        alt="briefcase"
                        src={`${BUCKET_URL}/stalls/briefcase.png`}
                        height={100}
                        width={100}
                        className=" w-5 h-auto cursor-pointer"
                        onClick={() => briefcaseClick(row)}
                        unoptimized
                      ></Image>
                    )}
                  </div>
                  <div>
                    {row.liked ? (
                      <Image
                        alt="Likes"
                        src={`${BUCKET_URL}/stalls/like.svg`}
                        height={200}
                        width={200}
                        className=" w-5 h-auto cursor-pointer "
                        unoptimized
                      ></Image>
                    ) : (
                      <Image
                        alt="Likes"
                        src={`${BUCKET_URL}/stalls/unlike.svg`}
                        height={200}
                        width={200}
                        className=" w-5 h-auto cursor-pointer "
                        onClick={() => likeClick(row)}
                        unoptimized
                      ></Image>
                    )}
                  </div>
                </div> : ``}
            </Card>
          ))}
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
