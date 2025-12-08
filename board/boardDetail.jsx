import React from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';

function BoardDetail() {
    const { id } = useParams(); // 게시글 ID
    const [searchParams] = useSearchParams(); // 목록에서 넘어온 쿼리 파라미터
    const navigate = useNavigate();

    // 상세 내용 로드 로직 (생략)
    
    // --- 목록으로 돌아가기 핸들러 ---
    const handleGoBack = () => {
        // 1. 목록 경로 정의
        const listPath = '/board'; 
        
        // 2. 현재 쿼리 파라미터를 그대로 붙여서 이동
        // 예: /board?page=3&searchType=title&keyword=리액트
        navigate(`${listPath}?${searchParams.toString()}`);
    };

    return (
        <div>
            <h2>게시글 상세 정보 (ID: {id})</h2>
            {/* 게시글 내용 표시 */}
            
            <button onClick={handleGoBack}>목록으로 돌아가기</button>
        </div>
    );
}

export default BoardDetail;
