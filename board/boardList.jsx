import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function BoardList() {
    // 1. URL 쿼리 파라미터 관리 훅
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // 2. 검색 조건 및 페이지 상태 초기화 (URL에서 읽어옴)
    const currentPage = parseInt(searchParams.get('page')) || 1;
    const searchType = searchParams.get('searchType') || 'title';
    const keyword = searchParams.get('keyword') || '';

    const [listData, setListData] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    
    // --- 3. 데이터 패칭 (useEffect) ---
    useEffect(() => {
        // 백엔드 API 호출을 위한 쿼리 객체 생성
        const query = {
            page: currentPage,
            searchType: searchType,
            keyword: keyword,
        };

        // TODO: 실제 백엔드 API를 호출하여 데이터를 가져옵니다.
        // fetchBoardList(query).then(response => {
        //     setListData(response.data);
        //     setTotalPages(response.totalPages);
        // });

        // (예시 데이터 설정)
        setListData([
            { id: 10, title: '리액트 게시판 구현', writer: '홍길동' },
            { id: 9, title: '페이지네이션 테스트', writer: '김철수' },
        ]);
        setTotalPages(5); // 총 5페이지라고 가정
        
    }, [currentPage, searchType, keyword]); // URL 상태가 변경될 때마다 재실행

    // --- 4. 검색 버튼 이벤트 핸들러 ---
    const handleSearch = (e) => {
        e.preventDefault();
        
        // 검색 필드의 현재 값 가져오기
        const newSearchType = e.target.searchType.value;
        const newKeyword = e.target.keyword.value;

        // 새로운 쿼리 파라미터 객체 생성 (페이지는 1로 초기화)
        const newParams = {
            page: 1, 
            searchType: newSearchType,
            keyword: newKeyword,
        };

        // URL 업데이트 (useEffect가 자동으로 데이터를 다시 로드함)
        setSearchParams(newParams);
    };

    // --- 5. 페이지 변경 이벤트 핸들러 ---
    const handlePageChange = (page) => {
        // 기존 검색 조건은 유지하고 페이지 번호만 업데이트
        setSearchParams({
            page: page,
            searchType: searchType,
            keyword: keyword,
        });
    };

    // --- 6. 상세 페이지 이동 핸들러 ---
    const handleDetailClick = (id) => {
        // 상세 페이지로 이동하며 현재 목록 상태(쿼리 파라미터)를 URL에 유지
        navigate(`/board/${id}?${searchParams.toString()}`);
    };

    return (
        <div>
            <h2>게시판 목록 ({currentPage} 페이지)</h2>
            
            {/* 검색 조건 UI */}
            <form onSubmit={handleSearch}>
                <select name="searchType" defaultValue={searchType}>
                    <option value="title">제목</option>
                    <option value="content">본문</option>
                </select>
                <input type="text" name="keyword" defaultValue={keyword} />
                <button type="submit">검색</button>
            </form>

            {/* 게시글 목록 테이블 */}
            <table>
                <thead> {/* ... 생략 ... */} </thead>
                <tbody>
                    {listData.map(post => (
                        <tr key={post.id}>
                            <td>{post.id}</td>
                            <td onClick={() => handleDetailClick(post.id)}>
                                <span style={{ cursor: 'pointer', color: 'blue' }}>{post.title}</span>
                            </td>
                            <td>{post.writer}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 페이지네이션 컴포넌트 (Pagination) */}
            <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={handlePageChange} 
            />
        </div>
    );
}

// 간단한 Pagination 컴포넌트 예시
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    
    return (
        <div>
            {pages.map(page => (
                <button 
                    key={page} 
                    onClick={() => onPageChange(page)}
                    disabled={page === currentPage}
                >
                    {page}
                </button>
            ))}
        </div>
    );
};

export default BoardList;
