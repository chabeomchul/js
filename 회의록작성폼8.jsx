import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Button, Input, Upload, message, Form, Card, Divider } from 'antd';
import { UploadOutlined, SaveOutlined } from '@ant-design/icons';

const MeetingMinuteForm = () => {
  // 1. React Hook Form 초기화
  const { handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      content: '',
      files: []
    }
  });

  // 2. React Query: 최종 폼 데이터 저장 Mutation
  const saveMutation = useMutation({
    mutationFn: async (data) => {
      // API 호출 시뮬레이션
      console.log("전송 데이터:", data);
      return new Promise((res) => setTimeout(res, 1000));
    },
    onSuccess: () => message.success('회의록이 성공적으로 저장되었습니다.')
  });

  // 3. Custom Upload: 파일별 개별 API 호출
  const handleCustomRequest = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      // 자체 API 호출 예시: const res = await uploadFile(formData);
      // 성공 시 onSuccess(res.data) 호출하여 file 객체에 정보 결합
      setTimeout(() => onSuccess("done"), 800);
    } catch (err) {
      onError(err);
      message.error(`${file.name} 업로드에 실패했습니다.`);
    }
  };

  // 4. 삭제 로직
  const handleRemove = (file, currentFiles, onChange) => {
    const updatedList = currentFiles.filter((item) => item.uid !== file.uid);
    onChange(updatedList);
    message.warning(`${file.name} 파일이 삭제되었습니다.`);
  };

  const onSubmit = (data) => {
    saveMutation.mutate(data);
  };

  return (
    <Card 
      title="회의록 작성" 
      style={{ maxWidth: 800, margin: '20px auto' }}
      // 외부 저장 버튼 구성
      extra={
        <Button 
          type="primary" 
          icon={<SaveOutlined />} 
          form="meeting-form" 
          htmlType="submit"
          loading={saveMutation.isPending}
        >
          저장하기
        </Button>
      }
    >
      <Form id="meeting-form" layout="vertical" onFinish={handleSubmit(onSubmit)}>
        {/* 제목 입력 (필수, 100자) */}
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
              required: '제목은 필수 입력 사항입니다.', 
              maxLength: { value: 100, message: '제목은 100자 이내로 작성해주세요.' } 
            }}
            render={({ field }) => <Input {...field} placeholder="제목을 입력하세요" />}
          />
        </Form.Item>

        {/* 내용 입력 (필수) */}
        <Form.Item 
          label="내용" 
          required 
          validateStatus={errors.content ? 'error' : ''} 
          help={errors.content?.message}
        >
          <Controller
            name="content"
            control={control}
            rules={{ required: '내용은 필수 입력 사항입니다.' }}
            render={({ field }) => <Input.TextArea {...field} rows={6} placeholder="내용을 입력하세요" />}
          />
        </Form.Item>

        <Divider />

        {/* 첨부파일 (필수, 확장자 제한, 삭제 로직) */}
        <Form.Item 
          label="첨부파일 (jpg, png, doc, ppt, pdf)" 
          required 
          validateStatus={errors.files ? 'error' : ''} 
          help={errors.files?.message}
        >
          <Controller
            name="files"
            control={control}
            rules={{ required: '하나 이상의 첨부파일이 필요합니다.' }}
            render={({ field }) => (
              <Upload
                {...field}
                customRequest={handleCustomRequest}
                fileList={field.value}
                onRemove={(file) => handleRemove(file, field.value, field.onChange)}
                onChange={({ fileList }) => field.onChange(fileList)}
                accept=".jpg,.jpeg,.png,.doc,.docx,.ppt,.pptx,.pdf"
                beforeUpload={(file) => {
                  const ext = file.name.split('.').pop().toLowerCase();
                  const allowed = ['jpg', 'jpeg', 'png', 'doc', 'docx', 'ppt', 'pptx', 'pdf'];
                  const forbidden = ['exe', 'zip'];

                  if (forbidden.includes(ext)) {
                    message.error(`${ext} 파일은 보안상 업로드할 수 없습니다.`);
                    return Upload.LIST_IGNORE;
                  }
                  
                  if (!allowed.includes(ext)) {
                    message.error('허용되지 않는 확장자입니다.');
                    return Upload.LIST_IGNORE;
                  }
                  
                  return true;
                }}
              >
                <Button icon={<UploadOutlined />}>파일 업로드</Button>
              </Upload>
            )}
          />
        </Form.Item>
      </Form>
    </Card>
  );
};

export default MeetingMinuteForm;
