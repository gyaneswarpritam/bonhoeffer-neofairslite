import React from "react";
import DataTable from "react-data-table-component";

export default function TableEvents({ columns, data }) {
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
