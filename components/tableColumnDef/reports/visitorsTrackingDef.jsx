import { dayjsShortFormat } from "@/lib/dayjs";

export const visitorsTrackingDef = [
  {
    headerName: "Track Event Type",
    field: "trackEventType",
    filter: true,
    width: 250,
  },
  {
    headerName: "Name",
    field: "name",
    filter: true,
    width: 150,
  },
  { headerName: "Mobile Number", field: "phone", filter: true, width: 150 },
  { headerName: "Business Email", field: "email", filter: true, width: 250 },
  {
    headerName: "Company Name",
    field: "companyName",
    filter: true,
    width: 150,
  },
  {
    headerName: "Visited Stall",
    field: "stallName",
    filter: true,
    width: 150,
  },
  {
    headerName: "Product Name",
    field: "name",
    filter: true,
    width: 150,
  },
  {
    headerName: "IP Address",
    field: "ip",
    filter: true,
    width: 150,
  },
  {
    headerName: "Visited Time",
    field: "visitedTime",
    filter: true,
    width: 150,
    valueFormatter: (params) => dayjsShortFormat(params.value),
  },
];
