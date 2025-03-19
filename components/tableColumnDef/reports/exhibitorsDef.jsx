export const ExhibitorsDef = [
  {
    headerName: "Name",
    field: "name",
    filter: true,
    width: 150,
  },
  {
    headerName: "Status",
    field: "status",
    filter: true,
    width: 150,
    cellStyle: (params) => {
      let color = "black";
      if (params.value === "Approved") {
        color = "green";
      } else if (params.value === "Blocked") {
        color = "red";
      } else if (params.value === "Pending") {
        color = "orange";
      } else if (params.value === "Rejected") {
        color = "grey";
      }
      return { color, fontWeight: "bold" };
    },
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
    headerName: "Company Address",
    field: "companyAddress",
    filter: true,
    width: 150,
  },
];
