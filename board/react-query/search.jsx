// /src/components/SearchForm.jsx
import React, { useState } from 'react';

const SearchForm = ({ initialParams, onSearch }) => {
    const [site, setSite] = useState(initialParams.site || 'all');
    const [type, setType] = useState(initialParams.type || 'title');
    const [keyword, setKeyword] = useState(initialParams.keyword || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        // 검색 실행 시 페이지는 1로 초기화하여 전달
        onSearch({ site, type, keyword, page: 1 }); 
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px', border: '1px solid #ddd', padding: '15px' }}>
            {/* 1. 사이트 구분 */}
            <select value={site} onChange={(e) => setSite(e.target.value)}>
                <option value="all">사이트 전체</option>
                <option value="A">사이트 A</option>
                <option value="B">사이트 B</option>
            </select>
            
            {/* 2. 검색 구분 */}
            <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="title">제목</option>
                <option value="author">작성자</option>
            </select>
            
            {/* 3. 검색어 */}
            <input 
                type="text" 
                placeholder="검색어 입력"
                value={keyword} 
                onChange={(e) => setKeyword(e.target.value)} 
            />
            
            <button type="submit">검색</button>
        </form>
    );
};

export default SearchForm;
