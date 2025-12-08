// /src/components/Pagination.jsx
import React from 'react';

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
    const pageNumbers = [];
    // 간단하게 현재 페이지 기준 앞뒤 2페이지씩만 표시
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
    }
    
    if (totalPages <= 1) return null;

    return (
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '5px' }}>
            {/* 맨 처음 페이지로 */}
            <button onClick={() => onPageChange(1)} disabled={currentPage === 1}>
                {'<<'}
            </button>
            {/* 이전 페이지 */}
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                {'<'}
            </button>
            
            {pageNumbers.map(number => (
                <button
                    key={number}
                    onClick={() => onPageChange(number)}
                    style={{ fontWeight: number === currentPage ? 'bold' : 'normal' }}
                >
                    {number}
                </button>
            ))}
            
            {/* 다음 페이지 */}
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                {'>'}
            </button>
            {/* 맨 끝 페이지로 */}
            <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}>
                {'>>'}
            </button>
        </div>
    );
};

export default Pagination;
