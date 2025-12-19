import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Button, Input, Upload, message, Form } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const MeetingForm = () => {
  // 1. React Hook Form 초기화
  const { handleSubmit, control, formState: { errors }, setValue } = useForm({
    defaultValues: {
      title: '',
      content: '',
      files: []
    }
  });

  // 2. React Query를 이용한 저장 API 호출
  const { mutate: saveMeeting } = useMutation({
    mutationFn: (data) => fetch('/api/meetings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => message.success('회의록이 저장되었습니다.'),
  });

  // 3. 파일 업로드 API 호출 (Custom Request)
  const uploadFileApi = async (options) => {
    const { onSuccess, onError, file } = options;
    const formData = new FormData();
    formData.append('file', file);

    try {
      // 실제 프로젝트의 upload API 경로로 변경하세요
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      const result = await response.json();
      onSuccess(result);
    } catch (err) {
      onError(err);
      message.error('파일 업로드에 실패했습니다.');
    }
  };

  const onSubmit = (data) => {
    console.log('폼 데이터:', data);
    saveMeeting(data);
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* 제목/내용 폼 섹션 */}
      <Form layout="vertical" id="meeting-form" onFinish={handleSubmit(onSubmit)}>
        {/* 제목 입력 */}
        <Form.Item 
          label="제목" 
          validateStatus={errors.title ? 'error' : ''} 
          help={errors.title?.message}
        >
          <Controller
            name="title"
            control={control}
            rules={{ 
              required: '제목은 필수 입력입니다.', 
              maxLength: { value: 100, message: '제목은 100자 이내로 입력해주세요.' } 
            }}
            render={({ field }) => <Input {...field} placeholder="회의 제목을 입력하세요" />}
          />
        </Form.Item>

        {/* 내용 입력 */}
        <Form.Item 
          label="내용" 
          validateStatus={errors.content ? 'error' : ''} 
          help={errors.content?.message}
        >
          <Controller
            name="content"
            control={control}
            rules={{ required: '내용은 필수 입력입니다.' }}
            render={({ field }) => <Input.TextArea {...field} rows={4} placeholder="내용을 입력하세요" />}
          />
        </Form.Item>

        {/* 첨부파일 업로드 */}
        <Form.Item 
          label="첨부파일 (jpg, png만 허용)" 
          validateStatus={errors.files ? 'error' : ''} 
          help={errors.files?.message}
        >
          <Controller
            name="files"
            control={control}
            rules={{ required: '첨부파일은 필수입니다.' }}
            render={({ field }) => (
              <Upload
                accept=".jpg,.png"
                customRequest={uploadFileApi}
                listType="picture"
                fileList={field.value}
                onChange={({ fileList }) => field.onChange(fileList)}
                beforeUpload={(file) => {
                  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                  if (!isJpgOrPng) {
                    message.error('JPG/PNG 파일만 업로드할 수 있습니다.');
                  }
                  return isJpgOrPng || Upload.LIST_IGNORE;
                }}
              >
                <Button icon={<UploadOutlined />}>파일 선택</Button>
              </Upload>
            )}
          />
        </Form.Item>
      </Form>

      <hr style={{ margin: '20px 0' }} />

      {/* 폼 외부에 위치한 저장 버튼 */}
      <div style={{ textAlign: 'right' }}>
        <Button 
          type="primary" 
          size="large" 
          form="meeting-form" // form id와 연결하여 handleSubmit 실행
          htmlType="submit"
        >
          회의록 저장하기
        </Button>
      </div>
    </div>
  );
};

export default MeetingForm;
