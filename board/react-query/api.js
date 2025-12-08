// /src/api/boardApi.js

const mockData = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    title: `[${i % 2 === 0 ? '공지' : '일반'}] React Query와 검색 조건 예시 게시글 ${i + 1}`,
    site: i % 2 === 0 ? 'A' : 'B',
    author: `user${i % 5}`,
    date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
}));

/**
 * 게시물 목록을 가져오는 함수 (검색 조건 및 페이징 적용)
 */
export const fetchBoardList = async (params) => {
    const { site, type, keyword, page, limit = 10 } = params;
    
    // 1. 필터링 로직
    const filtered = mockData.filter(item => {
        // 사이트 구분 필터링
        const siteMatch = site === 'all' || item.site === site;
        
        // 검색어 필터링
        let keywordMatch = true;
        if (keyword && type) {
            if (type === 'title') {
                keywordMatch = item.title.includes(keyword);
            } else if (type === 'author') {
                keywordMatch = item.author.includes(keyword);
            }
            // 검색 구분 (type)에 따라 추가적인 로직 구현 가능
        }
        
        return siteMatch && keywordMatch;
    });

    // 2. 페이징 로직
    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const data = filtered.slice(startIndex, endIndex);

    // 1초 지연 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
        data,
        totalCount,
        totalPages,
        page,
        limit,
    };
};

/**
 * 게시물 상세 정보를 가져오는 함수
 */
export const fetchBoardDetail = async (id) => {
    const item = mockData.find(d => d.id === parseInt(id));
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!item) throw new Error('게시물을 찾을 수 없습니다.');
    return { ...item, content: `이것은 ${item.title}의 상세 내용입니다.` };
};
