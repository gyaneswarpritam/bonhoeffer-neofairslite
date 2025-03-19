import { dayjsShortFormat } from "@/lib/dayjs";

export const CatalougeDef = [
  {
    headerName: "Stall Name",
    field: "stallName",
    width: 150,
  },
  {
    headerName: "Catalogue Name",
    field: "productName",
    width: 150,
  },
  {
    headerName: "Visitor Name",
    field: "visitor",
    width: 150,
  },
  {
    headerName: "Visitor Company",
    field: "visitorCompanyName",
    width: 150,
  },
  {
    headerName: "Visitor Email",
    field: "visitorEmail",
    width: 150,
  },
  {
    headerName: "Visitor Phone",
    field: "visitorPhone",
    width: 150,
  },
  {
    headerName: "Exhibitor Name",
    field: "exhibitor",
    width: 250,
  },
  {
    headerName: "Exhibitor Company",
    field: "exhibitorCompanyName",
    width: 250,
  },
  {
    headerName: "Exhibitor Email",
    field: "exhibitorEmail",
    width: 250,
  },
  {
    headerName: "Exhibitor Mobile",
    field: "exhibitorPhone",
    width: 150,
  },
  {
    headerName: "Requested Time",
    field: "updatedAt",
    width: 250,
    valueFormatter: (params) => params ? dayjsShortFormat(params) : "",
  },
];
