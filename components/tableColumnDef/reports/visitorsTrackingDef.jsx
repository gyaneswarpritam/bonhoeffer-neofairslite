import { dayjsShortFormat } from "@/lib/dayjs";

export const visitorsTrackingDef = [
  {
    headerName: "Track Event Type",
    field: "trackEventType",
    width: 250,
  },
  {
    headerName: "Name",
    field: "name",
    width: 150,
  },
  { headerName: "Mobile Number", field: "phone", width: 150 },
  { headerName: "Business Email", field: "email", width: 250 },
  {
    headerName: "Company Name",
    field: "companyName",
    width: 150,
  },
  {
    headerName: "Visited Stall",
    field: "stallName",
    width: 150,
  },
  {
    headerName: "Product Name",
    field: "productTitle",
    width: 150,
  },
  {
    headerName: "IP Address",
    field: "ip",
    width: 150,
  },
  {
    headerName: "Visited Time",
    field: "visitedTime",
    width: 250,
    valueFormatter: (params) =>
      params && params ? dayjsShortFormat(params) : "",
  },
];
