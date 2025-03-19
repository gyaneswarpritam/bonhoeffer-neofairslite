export const VisitorsDef = [
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
];

const statusCellRenderer = (params) => {
  const status = params.value;
  let color = "black";
  if (status === "Approved") {
    color = "green";
  } else if (status === "Blocked") {
    color = "red";
  } else if (status === "Pending") {
    color = "orange";
  } else if (status === "Rejected") {
    color = "grey";
  }

  return `<span style="color: ${color}; font-weight: bold;">${status}</span>`;
};
