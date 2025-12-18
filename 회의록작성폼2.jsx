import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Form, Input, Button, Upload, Card, Space, message } from 'antd';
import { UploadOutlined, SaveOutlined } from '@ant-design/icons';

const MinutesFormPage = () => {
  // 1. React Hook Form 설정
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { title: '', content: '', files: [] }
  });

  // 2. React Query 저장 로직
  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      console.log("전송 데이터:", data);
      // return axios.post('/api/minutes', data); 
      return new Promise((res) => setTimeout(res, 1000)); // 시뮬레이션
    },
    onSuccess: () => message.success('회의록이 저장되었습니다.'),
    onError: () => message.error('저장에 실패했습니다.')
  });

  const onSubmit = (data) => mutate(data);

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* 상단 헤더 영역: 저장 버튼이 폼 외부에 위치 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        background: '#fff',
        padding: '16px 24px',
        borderRadius: '8px'
      }}>
        <h2 style={{ margin: 0 }}>회의록 작성</h2>
        <Space>
          <Button>취소</Button>
          {/* form 속성에 아래 <form>의 id를 지정하여 외부에서도 제출 가능하게 함 */}
          <Button 
            type="primary" 
            icon={<SaveOutlined />} 
            htmlType="submit" 
            form="minutes-form" 
            loading={isPending}
          >
            저장하기
          </Button>
        </Space>
      </div>

      {/* 메인 폼 영역 */}
      <Card>
        <Form 
          id="minutes-form" // 버튼의 form 속성과 연결되는 ID
          layout="vertical" 
          onFinish={handleSubmit(onSubmit)}
        >
          {/* 제목 필드 */}
          <Form.Item 
            label="회의 제목" 
            required 
            validateStatus={errors.title ? 'error' : ''} 
            help={errors.title?.message}
          >
            <Controller
              name="title"
              control={control}
              rules={{ required: '제목을 입력해주세요.' }}
              render={({ field }) => <Input {...field} placeholder="제목을 입력하세요" size="large" />}
            />
          </Form.Item>

          {/* 내용 필드 */}
          <Form.Item 
            label="회의 내용" 
            required 
            validateStatus={errors.content ? 'error' : ''} 
            help={errors.content?.message}
          >
            <Controller
              name="content"
              control={control}
              rules={{ required: '내용을 입력해주세요.' }}
              render={({ field }) => (
                <Input.TextArea {...field} rows={10} placeholder="상세 내용을 입력하세요" />
              )}
            />
          </Form.Item>

          {/* 첨부파일 필드 */}
          <Form.Item label="첨부파일">
            <Controller
              name="files"
              control={control}
              render={({ field }) => (
                <Upload 
                  fileList={field.value}
                  beforeUpload={() => false}
                  onChange={({ fileList }) => field.onChange(fileList)}
                  multiple
                >
                  <Button icon={<UploadOutlined />}>파일 선택</Button>
                </Upload>
              )}
            />
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default MinutesFormPage;
