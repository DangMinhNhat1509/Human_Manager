import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import '../styles/PaginationNav.css'; // Import CSS file

type Button2Props = {
    content: React.ReactNode;
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
}

type PaginationNavProps = {
    gotoPage: (index: number) => void;
    canPreviousPage: boolean;
    canNextPage: boolean;
    pageCount: number;
    pageIndex: number;
}

const Button2: React.FC<Button2Props> = ({ content, onClick, active, disabled }) => (
    <button
        className={`pagination-btn ${active ? "active" : ""} ${disabled ? "disabled" : ""}`}
        onClick={onClick}
        disabled={disabled}
    >
        {content}
    </button>
);

const PaginationNav: React.FC<PaginationNavProps> = ({ gotoPage, canPreviousPage, canNextPage, pageCount, pageIndex }) => {
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
                        disabled={false}
                    />
                </li>
            );
        }
        return pageIndices;
    };

    return (
        <ul className="pagination-nav">
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
