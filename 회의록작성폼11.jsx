import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Input, Upload, message, Form, Card, Divider, Spin } from 'antd';
import { UploadOutlined, SaveOutlined } from '@ant-design/icons';

const MeetingFormContainer = ({ mode = 'edit', meetingId }) => {
  // 1. React Hook Form 초기화 (id 필드 추가)
  const { handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: { 
      id: '', // Hidden 필드용 ID
      title: '', 
      content: '', 
      files: [] 
    }
  });

  // 2. 수정 데이터 로드
  const { data: initialData, isLoading } = useQuery({
    queryKey: ['meeting', meetingId],
    queryFn: async () => {
      // API 호출 시뮬레이션
      return {
        id: meetingId, // 서버에서 받아온 ID
        title: "기존 회의 내용",
        content: "기존 상세 내용...",
        files: [{ uid: '-1', name: 'existing_file.pdf', status: 'done', url: '#' }]
      };
    },
    enabled: mode === 'edit' && !!meetingId,
  });

  useEffect(() => {
    if (initialData) reset(initialData);
  }, [initialData, reset]);

  // 3. 저장/수정 Mutation
  const saveMutation = useMutation({
    mutationFn: async (data) => {
      // data.id를 통해 수정 대상 식별 가능
      console.log("전송 데이터(Hidden ID 포함):", data);
      return new Promise((res) => setTimeout(res, 1000));
    },
    onSuccess: () => message.success('성공적으로 처리되었습니다.')
  });

  const handleCustomRequest = async ({ onSuccess }) => {
    setTimeout(() => onSuccess("ok"), 500);
  };

  const onSubmit = (data) => saveMutation.mutate(data);

  if (isLoading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

  return (
    <Card 
      title={mode === 'edit' ? "회의록 수정" : "회의록 작성"} 
      style={{ maxWidth: 800, margin: '20px auto' }}
      extra={
        <Button 
          type="primary" icon={<SaveOutlined />} 
          form="meeting-form" htmlType="submit"
          loading={saveMutation.isPending}
        >
          저장하기
        </Button>
      }
    >
      <Form id="meeting-form" layout="vertical" onFinish={handleSubmit(onSubmit)}>
        
        {/* --- Hidden 필드 구성 --- */}
        <Controller
          name="id"
          control={control}
          render={({ field }) => <input type="hidden" {...field} />}
        />

        <Form.Item label="제목" required validateStatus={errors.title ? 'error' : ''} help={errors.title?.message}>
          <Controller
            name="title"
            control={control}
            rules={{ required: '제목을 입력해주세요.', maxLength: 100 }}
            render={({ field }) => <Input {...field} placeholder="100자 이내" />}
          />
        </Form.Item>

        <Form.Item label="내용" required validateStatus={errors.content ? 'error' : ''} help={errors.content?.message}>
          <Controller
            name="content"
            control={control}
            rules={{ required: '내용을 입력해주세요.' }}
            render={({ field }) => <Input.TextArea {...field} rows={6} />}
          />
        </Form.Item>

        <Divider />

        <Form.Item 
          label="첨부파일 (최대 3개)" 
          required
          validateStatus={errors.files ? 'error' : ''} 
          help={errors.files?.message}
        >
          <Controller
            name="files"
            control={control}
            rules={{ 
              validate: {
                required: (val) => (val && val.length > 0) || '최소 하나의 파일이 필요합니다.',
                maxCount: (val) => (val && val.length <= 3) || '최대 3개까지만 첨부 가능합니다.'
              }
            }}
            render={({ field }) => (
              <Upload
                {...field}
                listType="picture"
                fileList={field.value || []}
                maxCount={3}
                customRequest={handleCustomRequest}
                onRemove={(file) => {
                  const updatedList = field.value.filter((item) => item.uid !== file.uid);
                  field.onChange(updatedList);
                }}
                onChange={({ fileList }) => field.onChange(fileList)}
                accept=".jpg,.jpeg,.png,.doc,.docx,.ppt,.pptx,.pdf"
                beforeUpload={(file) => {
                  const ext = file.name.split('.').pop().toLowerCase();
                  const allowed = ['jpg', 'jpeg', 'png', 'doc', 'docx', 'ppt', 'pptx', 'pdf'];
                  const forbidden = ['exe', 'zip'];

                  if (forbidden.includes(ext)) {
                    message.error(`${ext} 파일은 업로드할 수 없습니다.`);
                    return Upload.LIST_IGNORE;
                  }
                  if (!allowed.includes(ext)) {
                    message.error('허용되지 않는 확장자입니다.');
                    return Upload.LIST_IGNORE;
                  }
                  if ((field.value?.length || 0) >= 3) {
                    message.error('최대 3개까지만 업로드 가능합니다.');
                    return Upload.LIST_IGNORE;
                  }
                  return true;
                }}
              >
                {(field.value?.length || 0) < 3 && <Button icon={<UploadOutlined />}>파일 추가</Button>}
              </Upload>
            )}
          />
        </Form.Item>
      </Form>
    </Card>
  );
};

export default MeetingFormContainer;
