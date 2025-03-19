import {
  dayjsFormat,
  dayjsShortDate,
  dayjsShortFormat,
  dayjsShortTime,
} from "@/lib/dayjs";

export const meetingTrackingDef = [
  {
    headerName: "Track Event Type",
    field: "trackEventType",
    filter: true,
    width: 250,
  },
  {
    headerName: "Meeting Date",
    field: "data.slotDate",
    filter: true,
    width: 250,
    valueFormatter: (params) => dayjsShortDate(params.value),
  },
  {
    headerName: "Meeting time",
    field: "data.startDate",
    filter: true,
    width: 250,
    valueFormatter: (params) => {
      const { startDate, endDate, timeZone } = params.data.data;
      const startTime = dayjsShortTime(startDate, timeZone);
      const endTime = dayjsShortTime(endDate, timeZone);
      return `${startTime} - ${endTime}`;
    },
  },
  {
    headerName: "Visitor Name",
    field: "visitor.name",
    filter: true,
    width: 150,
  },
  {
    headerName: "Visitor Mobile",
    field: "visitor.phone",
    filter: true,
    width: 150,
  },
  {
    headerName: "Visitor Email",
    field: "visitor.email",
    filter: true,
    width: 250,
  },
  {
    headerName: "Visitor Company",
    field: "visitor.companyName",
    filter: true,
    width: 150,
  },
  {
    headerName: "Exhibitor Name",
    field: "exhibitor.name",
    filter: true,
    width: 150,
  },
  {
    headerName: "Exhibitor Mobile",
    field: "exhibitor.phone",
    filter: true,
    width: 150,
  },
  {
    headerName: "Exhibitor Email",
    field: "exhibitor.email",
    filter: true,
    width: 250,
  },
  {
    headerName: "Exhibitor Company",
    field: "exhibitor.companyName",
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
    headerName: "Booked Time",
    field: "updatedAt",
    filter: true,
    width: 250,
    valueFormatter: (params) => dayjsFormat(params.value),
  },
  {
    headerName: "Status",
    field: "data.status",
    filter: true,
    width: 150,
  },
  {
    headerName: "Timezone",
    field: "data.timeZone",
    filter: true,
    width: 150,
  },
];
