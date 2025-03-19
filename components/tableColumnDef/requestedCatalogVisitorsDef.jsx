import { dayjsShortFormat } from "@/lib/dayjs";

export const requestedCatalogVisitorsDef = [
  {
    headerName: "Catalogue Name",
    field: "productName",
    filter: true,
    flex: 3,
    minWidth: 350,
  },
  {
    headerName: "Visitor Name",
    field: "visitor",
    filter: true,
    flex: 3,
    minWidth: 350,
  },
  {
    headerName: "Company Name",
    field: "companyName",
    filter: true,
    flex: 3,
    minWidth: 350,
  },
  {
    headerName: "Visitor Email",
    field: "visitorEmail",
    filter: true,
    flex: 3,
    minWidth: 350,
  },
  {
    headerName: "Visitor Phone",
    field: "visitorPhone",
    filter: true,
    flex: 3,
    minWidth: 350,
  },
  {
    headerName: "Request Time",
    field: "updatedAt",
    filter: true,
    flex: 2,
    minWidth: 250,
    valueFormatter: (params) => dayjsShortFormat(params.value),
  },
];
