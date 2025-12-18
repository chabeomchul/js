import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const MinutesForm = () => {
  // 1. React Hook Form 초기화
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      content: '',
      files: []
    }
  });

  // 2. React Query를 이용한 저장 로직 (Mutation)
  const mutation = useMutation({
    mutationFn: async (data) => {
      // API 호출 시뮬레이션
      console.log("서버로 전송될 데이터:", data);
      // return axios.post('/api/minutes', data);
    },
    onSuccess: () => {
      message.success('회의록이 성공적으로 저장되었습니다.');
    },
    onError: () => {
      message.error('저장 중 오류가 발생했습니다.');
    }
  });

  // 3. 폼 제출 핸들러
  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}>
      <h2>회의록 작성</h2>
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        
        {/* 제목 입력 */}
        <Form.Item 
          label="제목" 
          validateStatus={errors.title ? 'error' : ''} 
          help={errors.title?.message}
          required
        >
          <Controller
            name="title"
            control={control}
            rules={{ required: '제목을 입력해주세요.' }}
            render={({ field }) => <Input {...field} placeholder="회의 제목을 입력하세요" />}
          />
        </Form.Item>

        {/* 내용 입력 */}
        <Form.Item 
          label="내용" 
          validateStatus={errors.content ? 'error' : ''} 
          help={errors.content?.message}
          required
        >
          <Controller
            name="content"
            control={control}
            rules={{ required: '내용을 입력해주세요.' }}
            render={({ field }) => <Input.TextArea {...field} rows={4} placeholder="회의 내용을 입력하세요" />}
          />
        </Form.Item>

        {/* 첨부 파일 (선택사항) */}
        <Form.Item label="첨부파일">
          <Controller
            name="files"
            control={control}
            render={({ field }) => (
              <Upload 
                beforeUpload={() => false} // 서버 전송 전 자동 업로드 방지
                fileList={field.value}
                onChange={({ fileList }) => field.onChange(fileList)}
              >
                <Button icon={<UploadOutlined />}>파일 선택</Button>
              </Upload>
            )}
          />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={mutation.isPending} 
            block
          >
            저장하기
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default MinutesForm;
