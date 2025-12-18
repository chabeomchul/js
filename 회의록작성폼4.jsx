import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Form, Input, Button, Upload, Card, Space, message, Typography } from 'antd';
import { UploadOutlined, SaveOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const MeetingMinutesForm = () => {
  const queryClient = useQueryClient();

  // 1. React Hook Form 설정
  const { 
    control, 
    handleSubmit, 
    formState: { errors },
    watch 
  } = useForm({
    defaultValues: {
      title: '',
      content: '',
      files: []
    },
    mode: 'onTouched' // 사용자가 입력란을 벗어날 때 검사
  });

  const titleValue = watch('title') || '';

  // 2. React Query - 자체 API 호출 Mutation
  const mutation = useMutation({
    mutationFn: async (data) => {
      // 첨부파일 포함을 위해 FormData 객체 생성
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.content);
      
      // 파일 목록 추가 (antd Upload의 fileList 구조에서 originFileObj 추출)
      data.files.forEach((file) => {
        formData.append('attachments', file.originFileObj);
      });

      // 예시: axios.post('/api/meeting-minutes', formData);
      console.log('서버로 전송될 FormData:', Object.fromEntries(formData));
      return new Promise((resolve) => setTimeout(resolve, 1000)); // API 시뮬레이션
    },
    onSuccess: () => {
      message.success('회의록이 성공적으로 저장되었습니다.');
      // 저장 후 리스트 새로고침 등의 작업 수행
      // queryClient.invalidateQueries(['meetingMinutes']);
    },
    onError: (error) => {
      message.error('저장 중 오류가 발생했습니다.');
      console.error(error);
    }
  });

  // 3. 폼 제출 핸들러
  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
      {/* [상단 헤더 - 외부 저장 버튼] */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px' 
      }}>
        <Title level={3} style={{ margin: 0 }}>회의록 작성</Title>
        <Space>
          <Button size="large">취소</Button>
          {/* form 속성을 통해 내부 Form의 id와 연결 */}
          <Button 
            type="primary" 
            size="large" 
            icon={<SaveOutlined />} 
            htmlType="submit" 
            form="meeting-minutes-form" 
            loading={mutation.isPending}
          >
            저장하기
          </Button>
        </Space>
      </div>

      <Card variant="outlined">
        <Form 
          id="meeting-minutes-form" 
          layout="vertical" 
          onFinish={handleSubmit(onSubmit)}
        >
          {/* 제목 필드: 필수입력, 100자 이내 */}
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
                maxLength: { value: 100, message: '제목은 최대 100자까지 입력 가능합니다.' }
              }}
              render={({ field }) => (
                <>
                  <Input {...field} placeholder="제목을 입력하세요 (100자 이내)" size="large" />
                  <div style={{ textAlign: 'right', marginTop: '4px' }}>
                    <Text type={titleValue.length > 100 ? 'danger' : 'secondary'} style={{ fontSize: '12px' }}>
                      {titleValue.length} / 100
                    </Text>
                  </div>
                </>
              )}
            />
          </Form.Item>

          {/* 내용 필드: 필수입력 */}
          <Form.Item 
            label="상세 내용" 
            required 
            validateStatus={errors.content ? 'error' : ''} 
            help={errors.content?.message}
          >
            <Controller
              name="content"
              control={control}
              rules={{ required: '내용을 입력해주세요.' }}
              render={({ field }) => (
                <Input.TextArea {...field} rows={10} placeholder="내용을 입력하세요" />
              )}
            />
          </Form.Item>

          {/* 첨부파일 필드: 필수첨부 */}
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
                validate: (value) => (value && value.length > 0) || '최소 1개 이상의 파일을 첨부해야 합니다.' 
              }}
              render={({ field }) => (
                <Upload
                  fileList={field.value}
                  onRemove={(file) => {
                    const newFileList = field.value.filter((item) => item.uid !== file.uid);
                    field.onChange(newFileList);
                  }}
                  beforeUpload={(file) => {
                    // 자체 API로 한 번에 보낼 것이므로 자동 업로드 중단
                    field.onChange([...field.value, file]);
                    return false;
                  }}
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

export default MeetingMinutesForm;
