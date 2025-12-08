// /src/components/BoardList.jsx
import React from 'react';
import { useQuery } from 'react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { fetchBoardList } from '../api/boardApi';
import SearchForm from './SearchForm';
import Pagination from './Pagination';

const BoardList = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // 1. URL Query Parameter에서 검색 조건을 읽어옵니다.
    const initialParams = {
        site: searchParams.get('site') || 'all',
        type: searchParams.get('type') || 'title',
        keyword: searchParams.get('keyword') || '',
        page: parseInt(searchParams.get('page') || '1'),
    };

    // 2. react-query를 이용해 데이터를 가져옵니다. (쿼리 키에 URL 상태를 포함)
    const { data, isLoading, isFetching, error } = useQuery(
        ['boards', initialParams], // 쿼리 키: 검색 조건이 변경되면 새로운 데이터를 가져옵니다.
        () => fetchBoardList(initialParams),
        {
            // 데이터 로딩 중 이전 데이터를 표시하여 UX를 개선합니다.
            keepPreviousData: true, 
        }
    );

    // 3. 검색 조건 또는 페이지가 변경될 때 URL을 업데이트하는 함수
    const handleUpdateSearchParams = (newParams) => {
        // 기존 searchParams 복사
        const updatedParams = new URLSearchParams(searchParams);
        
        // 새 값으로 업데이트 또는 삭제 (빈 문자열이면 삭제)
        Object.entries(newParams).forEach(([key, value]) => {
            if (value && value !== 'all' && value !== 1) {
                 updatedParams.set(key, String(value));
            } else {
                 updatedParams.delete(key);
            }
        });

        // URL 업데이트 (React Router가 감지하여 리렌더링 및 useQuery 재실행)
        setSearchParams(updatedParams);
    };
    
    // 페이지네이션 클릭 핸들러
    const handlePageChange = (newPage) => {
        handleUpdateSearchParams({ page: newPage });
    };

    if (error) return <div>오류가 발생했습니다: {error.message}</div>;

    return (
        <div>
            <h2>📋 게시판 목록</h2>
            
            {/* 검색 폼 컴포넌트 */}
            <SearchForm 
                initialParams={initialParams} 
                onSearch={handleUpdateSearchParams} 
            />

            {/* 로딩 및 데이터 표시 */}
            {(isLoading || isFetching) ? (
                <div>데이터를 불러오는 중입니다...</div>
            ) : (
                <>
                    <p>총 {data.totalCount}건 ({data.page}/{data.totalPages} 페이지)</p>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid black' }}>
                                <th style={{ width: '10%' }}>ID</th>
                                <th style={{ width: '60%' }}>제목</th>
                                <th style={{ width: '15%' }}>사이트</th>
                                <th style={{ width: '15%' }}>작성일</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.data.map(board => (
                                <tr key={board.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td>{board.id}</td>
                                    <td>
                                        {/* Link를 통해 상세 페이지로 이동합니다. */}
                                        <Link to={`/boards/${board.id}`}>{board.title}</Link>
                                    </td>
                                    <td>{board.site}</td>
                                    <td>{board.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* 페이징 컴포넌트 */}
                    <Pagination
                        totalPages={data.totalPages}
                        currentPage={data.page}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </div>
    );
};

export default BoardList;
