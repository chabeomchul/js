import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Button, Input, Upload, message, Form, Card } from 'antd';
import { UploadOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons';

const MeetingMinuteForm = () => {
  // 1. React Hook Form 설정
  const { handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      content: '',
      files: [] // 파일 목록 상태
    }
  });

  // 2. React Query: 최종 저장 API
  const saveMutation = useMutation({
    mutationFn: async (data) => {
      // console.log("최종 전송 데이터:", data);
      // return await axios.post('/api/meetings', data);
      return new Promise((res) => setTimeout(res, 1000));
    },
    onSuccess: () => message.success('회의록이 안전하게 저장되었습니다.')
  });

  // 3. Custom Upload: 자체 API 호출
  const handleCustomRequest = async ({ file, onSuccess, onError }) => {
    try {
      // const res = await uploadFileApi(file);
      // onSuccess(res.data); 
      setTimeout(() => onSuccess("ok"), 500); 
    } catch (err) {
      onError(err);
      message.error(`${file.name} 업로드 실패`);
    }
  };

  // 4. 삭제 로직 처리
  const handleRemove = (file, currentFiles, onChange) => {
    // uid를 기준으로 리스트에서 제거
    const nextFiles = currentFiles.filter(item => item.uid !== file.uid);
    onChange(nextFiles);
    message.info(`${file.name} 파일이 제거되었습니다.`);
  };

  const onSubmit = (data) => saveMutation.mutate(data);

  return (
    <Card 
      title="회의록 등록" 
      style={{ maxWidth: 800, margin: '20px auto' }}
      extra={
        /* 요구사항: 저장 버튼은 폼 외부에 위치 */
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
        {/* 제목: 필수, 100자 이내 */}
        <Form.Item 
          label="회의 제목" 
          required 
          validateStatus={errors.title ? 'error' : ''} 
          help={errors.title?.message}
        >
          <Controller
            name="title"
            control={control}
            rules={{ 
              required: '제목을 입력해주세요.', 
              maxLength: { value: 100, message: '제목은 100자 이내여야 합니다.' } 
            }}
            render={({ field }) => <Input {...field} placeholder="제목을 입력하세요" />}
          />
        </Form.Item>

        {/* 내용: 필수 */}
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
            render={({ field }) => <Input.TextArea {...field} rows={8} placeholder="내용을 입력하세요" />}
          />
        </Form.Item>

        {/* 첨부파일: 필수, 확장자 제한, 삭제 로직 */}
        <Form.Item 
          label="첨부파일 (jpg, png, doc, ppt, pdf)" 
          required 
          validateStatus={errors.files ? 'error' : ''} 
          help={errors.files?.message}
        >
          <Controller
            name="files"
            control={control}
            rules={{ required: '첨부파일을 하나 이상 등록해주세요.' }}
            render={({ field }) => (
              <Upload
                fileList={field.value}
                customRequest={handleCustomRequest}
                accept=".jpg,.jpeg,.png,.doc,.docx,.ppt,.pptx,.pdf"
                onRemove={(file) => handleRemove(file, field.value, field.onChange)}
                onChange={({ fileList }) => field.onChange(fileList)}
                beforeUpload={(file) => {
                  const allowedExtensions = ['jpg', 'jpeg', 'png', 'doc', 'docx', 'ppt', 'pptx', 'pdf'];
                  const ext = file.name.split('.').pop().toLowerCase();
                  if (!allowedExtensions.includes(ext)) {
                    message.error('허용되지 않는 파일 형식입니다.');
                    return Upload.LIST_IGNORE;
                  }
                  return true;
                }}
              >
                <Button icon={<UploadOutlined />}>파일 선택</Button>
              </Upload>
            )}
          />
        </Form.Item>
      </Form>
    </Card>
  );
};

export default MeetingMinuteForm;
