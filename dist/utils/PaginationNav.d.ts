import React from "react";
type PaginationNavProps = {
    gotoPage: (index: number) => void;
    canPreviousPage: boolean;
    canNextPage: boolean;
    pageCount: number;
    pageIndex: number;
};
declare const PaginationNav: React.FC<PaginationNavProps>;
export default PaginationNav;
