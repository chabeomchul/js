import { Form, Select, Button } from "antd";
import { useQuery } from "@tanstack/react-query";
import { fetchCodes } from "../api/statsApi";

export default function SearchForm({ onSearch }) {
  const { data: codes, isLoading } = useQuery({
    queryKey: ["codes"],
    queryFn: fetchCodes,
  });

  const [form] = Form.useForm();

  // 최초 검색년도는 현재 년도
  const defaultYear = new Date().getFullYear();

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
          {codes?.years.map((y) => (
            <Select.Option key={y} value={y}>
              {y}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="mainCode" label="대분류">
        <Select style={{ width: 150 }}>
          {codes?.main.map((m) => (
            <Select.Option key={m.code} value={m.code}>
              {m.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="subCode" label="중분류">
        <Select style={{ width: 150 }}>
          {codes?.sub.map((s) => (
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