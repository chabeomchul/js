import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Select, Button, Form, Spin, Row, Col, Typography, DatePicker } from 'antd';
import moment from 'moment';
import { AgGridReact } from 'ag-grid-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import { fetchCodes, fetchStatistics } from './api';

const { Option } = Select;
const { Title: AntdTitle } = Typography;

// Chart.js 필수 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// 현재 년도를 기본값으로 설정
const CURRENT_YEAR = moment().year().toString();

const StatisticsDashboard = () => {
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useState({
    year: CURRENT_YEAR,
    largeCategory: 'L01', // 초기값 설정 (기술 분야)
    mediumCategory: '',
  });

  // 1. 코드 조회 (대분류)
  const { data: largeCodes = [], isLoading: isLoadingLarge } = useQuery({
    queryKey: ['codes', 'L'],
    queryFn: () => fetchCodes('L'),
  });

  // 2. 코드 조회 (중분류 - 대분류 선택 시 호출)
  const { data: mediumCodes = [], isLoading: isLoadingMedium } = useQuery({
    queryKey: ['codes', 'M', searchParams.largeCategory],
    queryFn: () => fetchCodes('M', searchParams.largeCategory),
    enabled: !!searchParams.largeCategory, // 대분류가 선택되어야만 실행
  });

  // 3. 통계 데이터 조회
  const { data: statisticsData = [], isFetching: isFetchingStats } = useQuery({
    queryKey: ['statistics', searchParams],
    queryFn: () => fetchStatistics(searchParams),
    refetchOnWindowFocus: false,
  });

  // === 이벤트 핸들러 ===
  const onFinish = (values) => {
    // 년도 포맷팅
    const formattedYear = values.year.format('YYYY');
    setSearchParams({
      year: formattedYear,
      largeCategory: values.largeCategory,
      mediumCategory: values.mediumCategory || '',
    });
  };

  // 대분류 변경 시 중분류 초기화
  const handleLargeChange = (value) => {
    form.setFieldsValue({ mediumCategory: undefined });
    // 검색 파라미터 업데이트는 최종 검색 버튼 클릭 시
  };

  // === 그리드 설정 ===
  const columnDefs = useMemo(() => [
    { field: 'month', headerName: '기준월', width: 100 },
    { field: 'count', headerName: '총 접속 수', width: 150 },
    { field: 'users', headerName: '순 방문자 수', width: 150 },
  ], []);

  // === 차트 데이터 설정 ===
  const chartData = useMemo(() => {
    return {
      labels: statisticsData.map(d => d.month),
      datasets: [
        {
          label: '총 접속 수',
          data: statisticsData.map(d => d.count),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        },
        {
          label: '순 방문자 수',
          data: statisticsData.map(d => d.users),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    };
  }, [statisticsData]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: '월별 접속/방문자 통계' },
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  // === 초기값 설정 useEffect ===
  useEffect(() => {
    // Form 초기값 설정
    form.setFieldsValue({
      year: moment(CURRENT_YEAR, 'YYYY'),
      largeCategory: 'L01',
    });
    // 최초 검색 실행 (initialSearchParams와 동일)
    form.submit();
  }, [form]);


  return (
    <div style={{ padding: 20 }}>
      <AntdTitle level={2}>📊 운영 통계 현황</AntdTitle>

      {/* 1. 검색 조건 영역 */}
      <Form
        form={form}
        layout="inline"
        onFinish={onFinish}
        initialValues={{ year: moment(CURRENT_YEAR, 'YYYY') }}
        style={{ marginBottom: 20, border: '1px solid #eee', padding: 15, borderRadius: 8 }}
      >
        <Form.Item name="year" label="년도" rules={[{ required: true, message: '년도를 선택하세요' }]}>
          <DatePicker picker="year" allowClear={false} />
        </Form.Item>

        <Form.Item name="largeCategory" label="대분류" rules={[{ required: true, message: '선택' }]}>
          <Select placeholder="대분류 선택" style={{ width: 150 }} loading={isLoadingLarge} onChange={handleLargeChange}>
            {largeCodes.map(c => <Option key={c.code} value={c.code}>{c.name}</Option>)}
          </Select>
        </Form.Item>

        <Form.Item name="mediumCategory" label="중분류">
          <Select placeholder="중분류 선택 (선택)" style={{ width: 150 }} loading={isLoadingMedium} disabled={!searchParams.largeCategory}>
            <Option value="">전체</Option>
            {mediumCodes.map(c => <Option key={c.code} value={c.code}>{c.name}</Option>)}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isFetchingStats}>
            조회
          </Button>
        </Form.Item>
      </Form>

      <Spin spinning={isFetchingStats}>
        <Row gutter={[16, 16]}>
          {/* 2. 그리드 영역 */}
          <Col span={10}>
            <AntdTitle level={4}>표 통계 데이터</AntdTitle>
            <div className="ag-theme-quartz" style={{ height: 300, width: '100%' }}>
              <AgGridReact
                rowData={statisticsData}
                columnDefs={columnDefs}
                defaultColDef={{ resizable: true, sortable: true }}
                suppressCellFocus={true}
              />
            </div>
          </Col>

          {/* 3. 차트 영역 */}
          <Col span={14}>
            <AntdTitle level={4}>차트 시각화</AntdTitle>
            <div style={{ height: 300 }}>
                <Bar options={chartOptions} data={chartData} />
            </div>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default StatisticsDashboard;
