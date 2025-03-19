export const ExhibitorsDef = [
  {
    headerName: "Name",
    field: "name",
    width: 150,
  },
  {
    headerName: "Status",
    field: "status",
    width: 150,
    renderCell: (params) => {
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
      return <span style={{ color, fontWeight: "bold" }}>{params.value}</span>;
    },
  },
  {
    headerName: "Mobile Number",
    field: "phone",
    width: 150,
  },
  {
    headerName: "Business Email",
    field: "email",
    width: 250,
  },
  {
    headerName: "Company Name",
    field: "companyName",
    width: 150,
  },
  {
    headerName: "Company Address",
    field: "companyAddress",
    width: 150,
  },
];
