import { dayjsShortFormat } from "@/lib/dayjs";

export const requestedCatalogVisitorsDef = [
  {
    headerName: "Catalogue Name",
    field: "productName",
    minWidth: 200,
  },
  {
    headerName: "Visitor Name",
    field: "visitor",
    minWidth: 200,
  },
  {
    headerName: "Company Name",
    field: "companyName",
    minWidth: 200,
  },
  {
    headerName: "Visitor Email",
    field: "visitorEmail",
    minWidth: 200,
  },
  {
    headerName: "Visitor Phone",
    field: "visitorPhone",
    minWidth: 200,
  },
  {
    headerName: "Request Time",
    field: "updatedAt",
    minWidth: 250,
    valueFormatter: (params) =>
      params ? dayjsShortFormat(params) : "",
  },
];
