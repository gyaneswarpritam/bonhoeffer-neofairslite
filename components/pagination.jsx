import React from "react";
import { usePagination } from "./usePagination";
import Link from "next/link";
const Pagination = (props) => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    className,
  } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  // If there are less than 2 times in pagination range we shall not render the component
  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];
  return (
    <ul className=" flex flex-row items-center justify-end relative top-5">
      {paginationRange.map((pageNumber, i) => {
        // If the pageItem is a DOT, render the DOTS unicode character
        // if (pageNumber === DOTS) {
        //   return <li className="pagination-item dots bg-yellow">&#8230;</li>;
        // }

        // Render our Page Pills
        return (
          <Link href="" key={i}>
            <li
              className={
                currentPage === pageNumber
                  ? `bg-black pagination-cur text-black cursor-pointer relative mr-4 m-0 p-0 text-lg font-bold`
                  : `cursor-pointer relative mr-4 m-0 p-0 text-lg font-semibold pagination-cur text-[#C6C6C6]`
              }
              onClick={() => onPageChange(pageNumber)}
            >
              <span className="absolute top-1/2 -translate-y-1/2 underline">
                {pageNumber}
              </span>
            </li>
          </Link>
        );
      })}
    </ul>
  );
};

export default Pagination;
