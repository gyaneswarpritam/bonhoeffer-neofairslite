import { dayjsShortFormat } from "@/lib/dayjs";

export const LoggedinExhibitorsDef = [
  {
    headerName: "Visitor Name",
    field: "name",
    filter: true,
    width: 150,
  },
  {
    headerName: "Visitor Email",
    field: "email",
    filter: true,
    width: 150,
  },
  { headerName: "Visitor Mobile", field: "phone", filter: true, width: 150 },
  {
    headerName: "Company Name",
    field: "companyName",
    filter: true,
    width: 150,
  },
  {
    headerName: "LoggedIn Time",
    field: "loggedInTime",
    filter: true,
    width: 250,
    valueFormatter: (params) => dayjsShortFormat(params),
  },
  { headerName: "LoggedIn IP", field: "loggedInIP", filter: true, width: 150 },
];
