import React, { useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 30;

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const renderPageNumbers = () => {
        const pages = [1, 2, 3];
        if (totalPages > 6) pages.push('...', totalPages - 2, totalPages - 1, totalPages);
        else for (let i = 4; i <= totalPages; i++) pages.push(i);

        return pages.map((num, i) => (
            <button
                key={i}
                onClick={() => typeof num === 'number' && handlePageChange(num)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors
              ${typeof num === 'number'
                        ? num === currentPage
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-gray-700 hover:bg-gray-100'
                        : 'text-gray-500 cursor-default'}`}
                disabled={typeof num !== 'number'}
            >
                {num}
            </button>
        ));
    };
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-700 mb-4 sm:mb-0">
                Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
            </p>
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    <FaChevronLeft className="w-3 h-3" />
                </button>
                {renderPageNumbers()}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    <FaChevronRight className="w-3 h-3" />
                </button>
                <span className="text-gray-500 text-sm ml-4">Go to page</span>
                <select
                    value={currentPage}
                    onChange={(e) => handlePageChange(Number(e.target.value))}
                    className="w-16 h-8 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500 py-0 pl-2 pr-7 text-gray-700"
                >
                    {[...Array(totalPages)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                </select>
            </div>
        </div>
    )
}

export default Pagination