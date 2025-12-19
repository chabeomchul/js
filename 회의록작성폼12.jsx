import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Input, Upload, message, Form, Card, Divider, Spin, Space } from 'antd';
import { UploadOutlined, SaveOutlined, FileTextOutlined } from '@ant-design/icons';

const MeetingMinuteForm = ({ mode = 'edit', meetingId }) => {
  // 1. React Hook Form 초기화 (Hidden 필드 id 포함)
  const { handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      id: '',      // 수정 시 필수인 Hidden ID
      title: '',
      content: '',
      files: []
    }
  });

  // 2. [수정 모드] 기존 데이터 호출 (React Query)
  const { data: detailData, isLoading: isDetailLoading } = useQuery({
    queryKey: ['meetingDetail', meetingId],
    queryFn: async () => {
      // API 예시: const res = await axios.get(`/api/meetings/${meetingId}`);
      return {
        id: meetingId,
        title: "기존 회의 제목",
        content: "기존 회의 내용 샘플입니다.",
        files: [
          { uid: '1', name: 'manual.pdf', status: 'done', url: '/files/manual.pdf' }
        ]
      };
    },
    enabled: mode === 'edit' && !!meetingId
  });

  // 데이터 로드 시 폼 값 설정
  useEffect(() => {
    if (detailData) reset(detailData);
  }, [detailData, reset]);

  // 3. 저장/수정 실행 (React Query Mutation)
  const saveMutation = useMutation({
    mutationFn: async (formData) => {
      const isEdit = !!formData.id;
      console.log(`${isEdit ? '수정' : '신규저장'} 데이터:`, formData);
      // API 호출 로직 (POST or PUT)
      return new Promise((res) => setTimeout(res, 1000));
    },
    onSuccess: () => message.success('성공적으로 저장되었습니다.')
  });

  // 4. 첨부파일 자체 API 업로드 (customRequest)
  const handleCustomRequest = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      // const res = await uploadFileApi(formData);
      // onSuccess(res.data);
      setTimeout(() => onSuccess("ok"), 500);
    } catch (err) {
      onError(err);
      message.error('업로드에 실패했습니다.');
    }
  };

  const onSubmit = (data) => saveMutation.mutate(data);

  if (isDetailLoading) return <Spin tip="데이터 로딩 중..." style={{ display: 'block', margin: '50px auto' }} />;

  return (
    <Card 
      title={<Space><FileTextOutlined /> 회의록 {mode === 'edit' ? '수정' : '작성'}</Space>}
      style={{ maxWidth: 800, margin: '20px auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
      extra={
        /* 요구사항: 저장 버튼은 폼 외부에 위치 */
        <Button 
          type="primary" 
          icon={<SaveOutlined />} 
          form="meeting-main-form" // Form ID와 연결
          htmlType="submit" 
          loading={saveMutation.isPending}
        >
          {mode === 'edit' ? '수정하기' : '등록하기'}
        </Button>
      }
    >
      <Form id="meeting-main-form" layout="vertical" onFinish={handleSubmit(onSubmit)}>
        
        {/* 수정 시 필요한 Hidden ID 필드 */}
        <Controller
          name="id"
          control={control}
          render={({ field }) => <input type="hidden" {...field} />}
        />

        {/* 제목 (필수, 100자 이내) */}
        <Form.Item 
          label="회의 제목" required 
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
            render={({ field }) => <Input {...field} placeholder="제목을 입력하세요" />}
          />
        </Form.Item>

        {/* 내용 (필수) */}
        <Form.Item 
          label="회의 내용" required 
          validateStatus={errors.content ? 'error' : ''} 
          help={errors.content?.message}
        >
          <Controller
            name="content"
            control={control}
            rules={{ required: '내용을 입력해주세요.' }}
            render={({ field }) => <Input.TextArea {...field} rows={8} placeholder="상세 내용을 기록하세요" />}
          />
        </Form.Item>

        <Divider orientation="left">첨부파일 관리</Divider>

        {/* 첨부파일 (필수, 확장자 제한, 삭제 로직) */}
        <Form.Item 
          required 
          validateStatus={errors.files ? 'error' : ''} 
          help={errors.files?.message}
        >
          <Controller
            name="files"
            control={control}
            rules={{ validate: (val) => (val && val.length > 0) || '최소 1개의 파일을 첨부해야 합니다.' }}
            render={({ field }) => (
              <Upload
                {...field}
                multiple
                listType="picture"
                fileList={field.value || []}
                customRequest={handleCustomRequest}
                accept=".jpg,.jpeg,.png,.doc,.docx,.ppt,.pptx,.pdf"
                // 삭제 로직
                onRemove={(file) => {
                  const filtered = field.value.filter(item => item.uid !== file.uid);
                  field.onChange(filtered);
                }}
                onChange={({ fileList }) => field.onChange(fileList)}
                beforeUpload={(file) => {
                  const allowedExt = ['jpg', 'jpeg', 'png', 'doc', 'docx', 'ppt', 'pptx', 'pdf'];
                  const forbiddenExt = ['exe', 'zip'];
                  const ext = file.name.split('.').pop().toLowerCase();

                  if (forbiddenExt.includes(ext)) {
                    message.error(`${ext} 파일은 보안상 업로드할 수 없습니다.`);
                    return Upload.LIST_IGNORE;
                  }
                  if (!allowedExt.includes(ext)) {
                    message.error('허용되지 않는 파일 형식입니다 (jpg, png, doc, ppt, pdf 가능).');
                    return Upload.LIST_IGNORE;
                  }
                  return true;
                }}
              >
                <Button icon={<UploadOutlined />}>파일 추가 (최대 3개)</Button>
              </Upload>
            )}
          />
        </Form.Item>
      </Form>
    </Card>
  );
};

export default MeetingMinuteForm;
