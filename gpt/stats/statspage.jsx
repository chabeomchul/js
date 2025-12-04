import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchForm from "../components/SearchForm";
import StatsGrid from "../components/StatsGrid";
import StatsChart from "../components/StatsChart";
import { fetchStats } from "../api/statsApi";
import { Card } from "antd";

export default function StatsPage() {
  const [params, setParams] = useState(null);

  const { data, refetch, isFetching } = useQuery({
    queryKey: ["stats", params],
    queryFn: () => fetchStats(params),
    enabled: false, // 버튼 누를 때만 조회
  });

  const handleSearch = (values) => {
    setParams(values);
    refetch();
  };

  return (
    <div style={{ padding: 20 }}>
      <Card title="운영 통계 조회" style={{ marginBottom: 20 }}>
        <SearchForm onSearch={handleSearch} />
      </Card>

      <Card title="통계 그리드">
        {isFetching ? "조회중..." : <StatsGrid rowData={data || []} />}
      </Card>

      <Card title="통계 차트" style={{ marginTop: 20 }}>
        {data && <StatsChart data={data} />}
      </Card>
    </div>
  );
}