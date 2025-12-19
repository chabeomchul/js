import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Input, Upload, message, Form, Card, Divider, Spin } from 'antd';
import { UploadOutlined, SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const MeetingFormContainer = ({ mode = 'edit', meetingId }) => {
  // 1. React Hook Form 설정
  const { handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: { title: '', content: '', files: [] }
  });

  // 2. [수정 모드] 기존 데이터 불러오기
  const { data: initialData, isLoading } = useQuery({
    queryKey: ['meeting', meetingId],
    queryFn: async () => {
      // API 호출 예시: const res = await axios.get(`/api/meetings/${meetingId}`);
      // return res.data;
      return {
        title: "기존 회의 제목",
        content: "기존 회의 내용입니다.",
        files: [
          { uid: '-1', name: 'old_file.pdf', status: 'done', url: 'https://cdn.com/old_file.pdf' }
        ]
      };
    },
    enabled: mode === 'edit' && !!meetingId,
  });

  // 데이터 로드 완료 후 폼 초기화
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  // 3. 저장/수정 Mutation
  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const url = mode === 'edit' ? `/api/meetings/${meetingId}` : '/api/meetings';
      const method = mode === 'edit' ? 'PUT' : 'POST';
      console.log(`${method} 전송 데이터:`, data);
      return new Promise((res) => setTimeout(res, 1000));
    },
    onSuccess: () => message.success(`회의록이 ${mode === 'edit' ? '수정' : '저장'}되었습니다.`)
  });

  // 4. Custom Upload & Remove 로직
  const handleCustomRequest = async ({ file, onSuccess, onError }) => {
    try {
      // const res = await uploadFileApi(file);
      // onSuccess(res.data);
      setTimeout(() => onSuccess("ok"), 500);
    } catch (err) {
      onError(err);
      message.error('파일 업로드 실패');
    }
  };

  const handleRemove = (file, currentFiles, onChange) => {
    const updatedList = currentFiles.filter((item) => item.uid !== file.uid);
    onChange(updatedList);
  };

  const onSubmit = (data) => saveMutation.mutate(data);

  if (isLoading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

  return (
    <Card 
      title={mode === 'edit' ? "회의록 수정" : "회의록 작성"} 
      style={{ maxWidth: 800, margin: '20px auto' }}
      extra={
        <Button 
          type="primary" 
          icon={<SaveOutlined />} 
          form="meeting-form" 
          htmlType="submit"
          loading={saveMutation.isPending}
        >
          {mode === 'edit' ? '수정 완료' : '저장하기'}
        </Button>
      }
    >
      <Form id="meeting-form" layout="vertical" onFinish={handleSubmit(onSubmit)}>
        {/* 제목 */}
        <Form.Item 
          label="제목" 
          required 
          validateStatus={errors.title ? 'error' : ''} 
          help={errors.title?.message}
        >
          <Controller
            name="title"
            control={control}
            rules={{ required: '제목은 필수입니다.', maxLength: 100 }}
            render={({ field }) => <Input {...field} placeholder="제목을 입력하세요 (100자 이내)" />}
          />
        </Form.Item>

        {/* 내용 */}
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
            render={({ field }) => <Input.TextArea {...field} rows={6} />}
          />
        </Form.Item>

        <Divider />

        {/* 첨부파일 */}
        <Form.Item 
          label="첨부파일" 
          required
          validateStatus={errors.files ? 'error' : ''} 
          help={errors.files?.message}
        >
          <Controller
            name="files"
            control={control}
            rules={{ validate: (val) => val.length > 0 || '최소 하나의 파일이 필요합니다.' }}
            render={({ field }) => (
              <Upload
                {...field}
                listType="picture"
                fileList={field.value}
                customRequest={handleCustomRequest}
                onRemove={(file) => handleRemove(file, field.value, field.onChange)}
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
                  return true;
                }}
              >
                <Button icon={<UploadOutlined />}>파일 추가</Button>
              </Upload>
            )}
          />
        </Form.Item>
      </Form>
    </Card>
  );
};

export default MeetingFormContainer;
