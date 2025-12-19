import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Input, Upload, message, Form, Card, Divider, Spin } from 'antd';
import { UploadOutlined, SaveOutlined } from '@ant-design/icons';

const MeetingForm = ({ mode = 'edit', meetingId }) => {
  // 1. React Hook Form 설정 (hidden 필드 id 포함)
  const { handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      id: '',      // 수정 시 필요한 hidden 식별자
      title: '',
      content: '',
      files: []
    }
  });

  // 2. [수정 모드] 데이터 로딩 (React Query)
  const { data: initialData, isLoading } = useQuery({
    queryKey: ['meeting', meetingId],
    queryFn: async () => {
      // API 호출 예시: const res = await axios.get(`/api/meetings/${meetingId}`);
      return {
        id: meetingId,
        title: "기존 회의 제목",
        content: "기존 상세 내용입니다.",
        files: [
          { uid: '-1', name: 'guide_file.pdf', status: 'done', url: 'https://example.com/file.pdf' }
        ]
      };
    },
    enabled: mode === 'edit' && !!meetingId,
  });

  // 데이터 로드 완료 시 폼 초기화
  useEffect(() => {
    if (initialData) reset(initialData);
  }, [initialData, reset]);

  // 3. 저장/수정 Mutation (React Query)
  const saveMutation = useMutation({
    mutationFn: async (formData) => {
      console.log("서버 전송 데이터 (Hidden ID 포함):", formData);
      // 실제 API 호출: mode === 'edit' ? PUT : POST
      return new Promise((res) => setTimeout(res, 1000));
    },
    onSuccess: () => message.success('성공적으로 저장되었습니다.')
  });

  // 4. Custom Upload: 자체 API 호출 로직
  const handleCustomRequest = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      // const res = await uploadApi(formData);
      // onSuccess(res.data);
      setTimeout(() => onSuccess("ok"), 500);
    } catch (err) {
      onError(err);
      message.error(`${file.name} 업로드 실패`);
    }
  };

  const onSubmit = (data) => saveMutation.mutate(data);

  if (isLoading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

  return (
    <Card 
      title={`회의록 ${mode === 'edit' ? '수정' : '작성'}`} 
      style={{ maxWidth: 800, margin: '20px auto' }}
      extra={
        /* 요구사항: 저장 버튼은 폼 외부에 위치 */
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
        
        {/* 수정 시 필요한 Hidden ID */}
        <Controller
          name="id"
          control={control}
          render={({ field }) => <input type="hidden" {...field} />}
        />

        {/* 제목: 필수, 100자 이내 */}
        <Form.Item 
          label="제목" required 
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
          label="내용" required 
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

        <Divider orientation="left">첨부파일 (필수, 최대 3개)</Divider>

        {/* 첨부파일: 필수, 확장자 제한, 삭제로직, 갯수제한 */}
        <Form.Item 
          validateStatus={errors.files ? 'error' : ''} 
          help={errors.files?.message}
        >
          <Controller
            name="files"
            control={control}
            rules={{ 
              validate: {
                required: (val) => (val && val.length > 0) || '파일 첨부는 필수입니다.',
                maxCount: (val) => (val && val.length <= 3) || '최대 3개까지만 첨부 가능합니다.'
              }
            }}
            render={({ field }) => (
              <Upload
                fileList={field.value}
                customRequest={handleCustomRequest}
                accept=".jpg,.jpeg,.png,.doc,.docx,.ppt,.pptx,.pdf"
                listType="picture"
                maxCount={3}
                onRemove={(file) => {
                  const nextList = field.value.filter(item => item.uid !== file.uid);
                  field.onChange(nextList);
                }}
                onChange={({ fileList }) => field.onChange(fileList)}
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
                  if (field.value.length >= 3) {
                    message.error('최대 3개까지만 업로드 가능합니다.');
                    return Upload.LIST_IGNORE;
                  }
                  return true;
                }}
              >
                {field.value.length < 3 && <Button icon={<UploadOutlined />}>파일 선택</Button>}
              </Upload>
            )}
          />
        </Form.Item>
      </Form>
    </Card>
  );
};

export default MeetingForm;
