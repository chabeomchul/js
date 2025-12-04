import { Form, Select, Button } from "antd";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { fetchCodes } from "../api/statsApi";

export default function SearchForm({ onSearch }) {
  const { data: codes, isLoading } = useQuery({
    queryKey: ["codes"],
    queryFn: fetchCodes,
  });

  const [subList, setSubList] = useState([]); // 중분류 목록 상태
  const [form] = Form.useForm();

  const defaultYear = new Date().getFullYear();

  // 대분류 선택 시 중분류 필터링
  const handleMainChange = (mainCode) => {
    const filtered = codes.sub.filter((item) => item.parent === mainCode);
    setSubList(filtered);

    // 대분류 변경 시 중분류 초기화
    form.setFieldsValue({ subCode: null });
  };

  useEffect(() => {
    if (codes) {
      setSubList([]); // 최초 렌더 시 중분류 초기화
    }
  }, [codes]);

  if (isLoading) return "검색 조건 로딩중...";

  return (
    <Form
      form={form}
      layout="inline"
      initialValues={{
        year: defaultYear,
      }}
      onFinish={onSearch}
      style={{ marginBottom: 20 }}
    >
      <Form.Item name="year" label="년도">
        <Select style={{ width: 120 }}>
          {codes.years.map((y) => (
            <Select.Option key={y} value={y}>
              {y}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="mainCode" label="대분류">
        <Select
          style={{ width: 150 }}
          onChange={handleMainChange}
          placeholder="대분류 선택"
        >
          {codes.main.map((m) => (
            <Select.Option key={m.code} value={m.code}>
              {m.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="subCode" label="중분류">
        <Select
          style={{ width: 150 }}
          placeholder="중분류 선택"
          disabled={subList.length === 0}
        >
          {subList.map((s) => (
            <Select.Option key={s.code} value={s.code}>
              {s.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Button type="primary" htmlType="submit">
        조회
      </Button>
    </Form>
  );
}