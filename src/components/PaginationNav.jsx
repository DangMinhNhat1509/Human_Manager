import React from 'react';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";


const Button2 = ({ content, onClick, active, disabled }) => (
    <button
        className={`flex flex-col cursor-pointer items-center justify-center w-9 h-9 shadow-[0_4px_10px_rgba(20,5,0,0.03)] text-sm font-normal transition-colors rounded-lg
        ${active ? "bg-red-500 text-blue-700 text-lg" : "text-red-500"}
        ${!disabled ? "bg-yellow-50 hover:bg-red-500 hover:text-white" : "text-red-300 bg-white cursor-not-allowed"}`}
        onClick={onClick}
        disabled={disabled}
    >
        {content}
    </button>
);
const PaginationNav = ({ gotoPage, canPreviousPage, canNextPage, pageCount, pageIndex }) => {
    const renderPageLinks = () => {
        const pageIndices = [];
        const maxPagesToShow = 6;
        const half = Math.floor(maxPagesToShow / 2);

        let startPage = Math.max(0, pageIndex - half);
        let endPage = Math.min(pageCount - 1, pageIndex + half);

        if (endPage - startPage + 1 < maxPagesToShow) {
            if (startPage === 0) {
                endPage = Math.min(pageCount - 1, startPage + maxPagesToShow - 1);
            } else if (endPage === pageCount - 1) {
                startPage = Math.max(0, endPage - maxPagesToShow + 1);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pageIndices.push(
                <li key={i}>
                    <Button2
                        content={i + 1}
                        onClick={() => gotoPage(i)}
                        active={pageIndex === i}
                    />
                </li>
            );
        }
        return pageIndices;
    };

    return (
        <ul className="flex gap-6 justify-center mt-4">
            <li>
                <Button2
                    content={<FaChevronLeft />}
                    onClick={() => gotoPage(0)}
                    disabled={!canPreviousPage}
                />
            </li>
            {renderPageLinks()}
            <li>
                <Button2
                    content={<FaChevronRight />}
                    onClick={() => gotoPage(pageCount - 1)}
                    disabled={!canNextPage}
                />
            </li>
        </ul>
    );
};

export default PaginationNav;