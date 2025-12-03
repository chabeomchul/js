import axios from 'axios';

// 1. 코드 조회 API Mock
const mockCategories = {
  L: [
    { code: 'L01', name: '기술 분야' },
    { code: 'L02', name: '영업 분야' },
    { code: 'L03', name: '마케팅 분야' },
  ],
  M_L01: [
    { code: 'M101', name: '프론트엔드' },
    { code: 'M102', name: '백엔드' },
    { code: 'M103', name: '데이터베이스' },
  ],
  M_L02: [
    { code: 'M201', name: '국내 영업' },
    { code: 'M202', name: '해외 영업' },
  ],
};

export const fetchCodes = async (type, parentCode = '') => {
  console.log(`[API Call] Fetching codes: Type=${type}, Parent=${parentCode}`);
  return new Promise(resolve => {
    setTimeout(() => {
      if (type === 'L') resolve(mockCategories.L);
      if (type === 'M' && parentCode === 'L01') resolve(mockCategories.M_L01);
      if (type === 'M' && parentCode === 'L02') resolve(mockCategories.M_L02);
      resolve([]);
    }, 500);
  });
};

// 2. 통계 데이터 조회 API Mock
export const fetchStatistics = async ({ year, largeCategory, mediumCategory }) => {
  console.log(`[API Call] Fetching statistics for: Year=${year}, Large=${largeCategory}, Medium=${mediumCategory}`);

  // 예시 데이터 생성 (검색 조건에 따른 가변 데이터)
  const data = [
    { month: '01월', count: 120 + Math.floor(Math.random() * 50), users: 80 + Math.floor(Math.random() * 30) },
    { month: '02월', count: 150 + Math.floor(Math.random() * 50), users: 95 + Math.floor(Math.random() * 30) },
    { month: '03월', count: 110 + Math.floor(Math.random() * 50), users: 70 + Math.floor(Math.random() * 30) },
    { month: '04월', count: 180 + Math.floor(Math.random() * 50), users: 110 + Math.floor(Math.random() * 30) },
    { month: '05월', count: 200 + Math.floor(Math.random() * 50), users: 130 + Math.floor(Math.random() * 30) },
    { month: '06월', count: 140 + Math.floor(Math.random() * 50), users: 85 + Math.floor(Math.random() * 30) },
  ];

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(data);
    }, 700);
  });
};
