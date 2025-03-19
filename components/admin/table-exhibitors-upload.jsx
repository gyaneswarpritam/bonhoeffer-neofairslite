import { BUCKET_URL } from "@/config/constant";
import {
  eventsData,
  exhibitorLoginData,
  faqData,
  visitorsData,
} from "@/models/adminData";
import Image from "next/image";
import React from "react";
import DataTable from "react-data-table-component";

export default function TableExihibitorsUpload() {
  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      maxWidth: "200px",
      cell: (row) => (
        <div className="py-2 w-full flex-nowrap font-quickSand font-medium text-static-black text-sm">
          {row.name}
        </div>
      ),
    },
    {
      name: "Exhibitor's Email",
      selector: (row) => row.email,
      sortable: true,
      maxWidth: "400px",
      cell: (row) => (
        <div className="py-2 w-full flex-nowrap font-quickSand font-regular text-static-black text-sm">
          {row.email}
        </div>
      ),
    },
    {
      name: "Password",
      selector: (row) => row.password,
      sortable: true,
      maxWidth: "400px",
      cell: (row) => (
        <div className="py-2 w-full flex-nowrap font-quickSand font-regular text-static-black text-sm">
          {row.password}
        </div>
      ),
    },

    {
      name: "Delete",
      selector: (row) => row.action,
      sortable: true,
      center: true,
      maxWidth: "120px",
      cell: (row) => (
        <div className="rounded-full aspect-square flex flex-col items-center justify-center bg-brand-color h-7 cursor-pointer">
          <Image
            width={100}
            height={100}
            src={`${BUCKET_URL}/admin/delete.svg`}
            className="h-4 w-auto"
          />
        </div>
      ),
    },
  ];

  const handleBreifcase = () => {};

  const data = exhibitorLoginData;

  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  const filteredItems = data.filter(
    (item) =>
      item.name &&
      item.name.toLowerCase().includes(filterText.toString().toLowerCase())
  );

  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };

    return (
      <header className="border-[1px] border-black rounded-lg overflow-hidden">
        <input
          className="p-2 h-10"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder={"Search name"}
        />
        <button
          type="button"
          onClick={handleClear}
          className="bg-brand-color text-static-black h-10 w-10 text-lg font-quickSand font-semibold"
        >
          X
        </button>
      </header>
    );
  }, [filterText, resetPaginationToggle]);

  return (
    <DataTable
      columns={columns}
      data={filteredItems}
      pagination
      fixedHeader
      subHeader
      striped
      subHeaderComponent={subHeaderComponentMemo}
    />
  );
}
