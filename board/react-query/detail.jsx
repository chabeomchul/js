// /src/components/BoardDetail.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { fetchBoardDetail } from '../api/boardApi';

const BoardDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // react-query로 상세 데이터 로드
    const { data: board, isLoading, error } = useQuery(
        ['board', id], 
        () => fetchBoardDetail(id)
    );

    // 상세 -> 목록 이동 시 핵심:
    // navigate(-1)을 사용해 이전 페이지(검색 조건이 담긴 목록 URL)로 돌아갑니다.
    const handleGoToList = () => {
        navigate(-1);
    };

    if (isLoading) return <div>게시물 상세 정보를 불러오는 중입니다...</div>;
    if (error) return <div>오류: {error.message}</div>;

    return (
        <div style={{ border: '1px solid #ccc', padding: '20px', marginTop: '30px' }}>
            <h2>📝 게시물 상세</h2>
            <div style={{ marginBottom: '15px' }}>
                <p><strong>제목:</strong> {board.title}</p>
                <p><strong>작성자:</strong> {board.author} | <strong>날짜:</strong> {board.date}</p>
            </div>
            <div style={{ border: '1px solid #eee', padding: '15px', minHeight: '150px', whiteSpace: 'pre-wrap' }}>
                {board.content}
            </div>
            
            <button 
                onClick={handleGoToList} 
                style={{ marginTop: '20px', padding: '10px 20px' }}
            >
                목록으로 (이전 검색/페이지 유지)
            </button>
        </div>
    );
};

export default BoardDetail;
