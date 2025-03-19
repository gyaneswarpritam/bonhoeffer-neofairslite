import { dayjsShortFormat } from "@/lib/dayjs";

export const VisitorsStallDef = [
  {
    headerName: "Visitor Name",
    field: "visitor",
    filter: true,
    width: 150,
  },
  {
    headerName: "Visitor Mobile",
    field: "visitorPhone",
    filter: true,
    width: 150,
  },
  {
    headerName: "Visitor Email",
    field: "visitorEmail",
    filter: true,
    width: 150,
  },
  {
    headerName: "Visitor Company",
    field: "visitorCompanyName",
    filter: true,
    width: 150,
  },
  { headerName: "Stall Name", field: "stallName", filter: true, width: 150 },
  {
    headerName: "Exhibitor Name",
    field: "exhibitor",
    filter: true,
    width: 250,
  },
  {
    headerName: "Exhibitor Email",
    field: "exhibitorEmail",
    filter: true,
    width: 250,
  },
  {
    headerName: "Exhibitor Mobile",
    field: "exhibitorPhone",
    filter: true,
    width: 150,
  },
  {
    headerName: "Time",
    field: "updatedAt",
    filter: true,
    width: 150,
    valueFormatter: (params) => dayjsShortFormat(params.value),
  },
];
