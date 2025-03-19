import { dayjsShortFormat } from "@/lib/dayjs";

export const requestedCatalogDef = [
  {
    headerName: "Stall Name",
    field: "stallName",
    filter: true,
    width: 300,
    flex: 3,
    minWidth: 350,
  },
  {
    headerName: "Catalogue Name",
    field: "productName",
    filter: true,
    flex: 3,
    minWidth: 350,
  },
  {
    headerName: "Exhibitor Name",
    field: "exhibitor",
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
    headerName: "Exhibitor Email",
    field: "exhibitorEmail",
    filter: true,
    flex: 3,
    minWidth: 350,
  },
  {
    headerName: "Exhibitor Phone",
    field: "exhibitorPhone",
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
