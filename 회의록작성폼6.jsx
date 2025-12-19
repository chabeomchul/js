import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Button, Input, Upload, message, Form, Typography } from 'antd';
import { UploadOutlined, SaveOutlined } from '@ant-design/icons';

const { Title } = Typography;

const MeetingMinuteForm = () => {
  // 1. React Hook Form 설정
  const { handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      content: '',
      files: []
    }
  });

  // 2. React Query: 저장 API 전송
  const saveMutation = useMutation({
    mutationFn: async (formData) => {
      // 실제 API 호출 로직 (예시)
      // return await axios.post('/api/meetings', formData);
      return new Promise((resolve) => setTimeout(() => resolve(formData), 1000));
    },
    onSuccess: () => message.success('회의록이 성공적으로 저장되었습니다.')
  });

  // 3. Custom Upload Request (자체 API 호출)
  const handleCustomRequest = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      // 자체 파일 업로드 API 호출 부분
      // const res = await uploadApi(formData);
      // onSuccess(res.data);
      setTimeout(() => onSuccess("ok"), 1000); // 데모용 성공 처리
    } catch (err) {
      onError(err);
      message.error(`${file.name} 업로드에 실패했습니다.`);
    }
  };

  const onSubmit = (data) => {
    saveMutation.mutate(data);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', border: '1px solid #f0f0f0' }}>
      <Title level={3}>회의록 작성</Title>
      
      {/* Form id를 지정하여 외부 버튼과 연결 */}
      <Form layout="vertical" id="meeting-form" onFinish={handleSubmit(onSubmit)}>
        
        {/* 제목 섹션 */}
        <Form.Item 
          label="제목" 
          required 
          validateStatus={errors.title ? 'error' : ''} 
          help={errors.title?.message}
        >
          <Controller
            name="title"
            control={control}
            rules={{ 
              required: '제목을 입력해주세요.', 
              maxLength: { value: 100, message: '제목은 최대 100자까지 가능합니다.' } 
            }}
            render={({ field }) => <Input {...field} placeholder="회의 제목 (100자 이내)" />}
          />
        </Form.Item>

        {/* 내용 섹션 */}
        <Form.Item 
          label="내용" 
          required 
          validateStatus={errors.content ? 'error' : ''} 
          help={errors.content?.message}
        >
          <Controller
            name="content"
            control={control}
            rules={{ required: '내용을 입력해주세요.' }}
            render={({ field }) => <Input.TextArea {...field} rows={6} placeholder="회의 내용을 입력하세요" />}
          />
        </Form.Item>

        {/* 첨부파일 섹션 (jpg, png, doc) */}
        <Form.Item 
          label="첨부파일" 
          required 
          validateStatus={errors.files ? 'error' : ''} 
          help={errors.files?.message}
        >
          <Controller
            name="files"
            control={control}
            rules={{ 
              required: '최소 하나 이상의 파일을 업로드해야 합니다.',
              validate: (value) => value && value.length > 0 || '파일을 첨부해주세요.'
            }}
            render={({ field }) => (
              <Upload
                {...field}
                accept=".jpg,.png,.doc"
                customRequest={handleCustomRequest}
                fileList={field.value}
                onChange={({ fileList }) => field.onChange(fileList)}
                beforeUpload={(file) => {
                  const allowedTypes = ['image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                  const isAllowed = allowedTypes.includes(file.type) || file.name.endsWith('.doc');
                  
                  if (!isAllowed) {
                    message.error('jpg, png, doc 형식만 업로드 가능합니다.');
                  }
                  return isAllowed || Upload.LIST_IGNORE;
                }}
              >
                <Button icon={<UploadOutlined />}>파일 선택</Button>
              </Upload>
            )}
          />
        </Form.Item>
      </Form>

      {/* 폼 외부 저장 버튼 섹션 */}
      <div style={{ marginTop: '30px', borderTop: '1px solid #f0f0f0', paddingTop: '20px', textAlign: 'right' }}>
        <Button 
          type="primary" 
          icon={<SaveOutlined />} 
          form="meeting-form" // Form ID와 매칭
          htmlType="submit"   // 제출 타입 필수
          loading={saveMutation.isPending}
        >
          회의록 저장
        </Button>
      </div>
    </div>
  );
};

export default MeetingMinuteForm;
