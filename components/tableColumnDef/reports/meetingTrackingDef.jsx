import { dayjsFormat, dayjsShortDate, dayjsShortTime } from "@/lib/dayjs";

export const meetingTrackingDef = [
  {
    headerName: "Track Event Type",
    field: "trackEventType",
    filterable: true,
    width: 250,
  },
  {
    headerName: "Meeting Date",
    field: "meetingDate",
    filterable: true,
    width: 250,
  },
  {
    headerName: "Meeting Time",
    field: "meetingTime",
    filterable: true,
    width: 250,
  },
  {
    headerName: "Visitor Name",
    field: "visitorName",
    filterable: true,
    width: 150,
  },
  {
    headerName: "Visitor Mobile",
    field: "visitorPhone",
    filterable: true,
    width: 150,
  },
  {
    headerName: "Visitor Email",
    field: "visitorEmail",
    filterable: true,
    width: 250,
  },
  {
    headerName: "Visitor Company",
    field: "visitorCompanyName",
    filterable: true,
    width: 150,
  },
  {
    headerName: "Exhibitor Name",
    field: "exhibitorName",
    filterable: true,
    width: 150,
  },
  {
    headerName: "Exhibitor Mobile",
    field: "exhibitorPhone",
    filterable: true,
    width: 150,
  },
  {
    headerName: "Exhibitor Email",
    field: "exhibitorEmail",
    filterable: true,
    width: 250,
  },
  {
    headerName: "Exhibitor Company",
    field: "exhibitorCompanyName",
    filterable: true,
    width: 150,
  },
  {
    headerName: "IP Address",
    field: "ip",
    filterable: true,
    width: 150,
  },
  {
    headerName: "Booked Time",
    field: "createdAt",
    filterable: true,
    width: 250,
  },
  {
    headerName: "Status",
    field: "status",
    filterable: true,
    width: 150,
  },
  {
    headerName: "Timezone",
    field: "timeZone",
    filterable: true,
    width: 150,
  },
];
