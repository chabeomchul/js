import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Form, Input, Button, Upload, Card, Space, message, Typography } from 'antd';
import { UploadOutlined, SaveOutlined } from '@ant-design/icons';

const { Text } = Typography;

const MeetingMinutesForm = () => {
  // 1. React Hook Form 설정 (입력값 제어 및 유효성 검사)
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
    }
  });

  // 제목 글자 수 실시간 모니터링용
  const titleValue = watch('title');

  // 2. React Query를 이용한 저장 API 호출 설정
  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      // 실제 프로젝트에서는 FormData를 사용하여 파일을 포함해 전송합니다.
      console.log("전송 데이터:", data);
      return new Promise((resolve) => setTimeout(resolve, 1000));
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
    mutate(data);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      {/* [외부 헤더 영역] 저장 버튼이 폼 밖에 위치 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '16px' 
      }}>
        <Typography.Title level={3} style={{ margin: 0 }}>회의록 작성</Typography.Title>
        <Space>
          <Button size="large">취소</Button>
          {/* htmlType="submit"과 form ID 연결로 폼 외부에서 제출 가능 */}
          <Button 
            type="primary" 
            size="large" 
            icon={<SaveOutlined />} 
            htmlType="submit" 
            form="meeting-minutes-form" 
            loading={isPending}
          >
            저장
          </Button>
        </Space>
      </div>

      <Card>
        <Form 
          id="meeting-minutes-form" // 버튼의 form 속성과 일치해야 함
          layout="vertical" 
          onFinish={handleSubmit(onSubmit)}
        >
          {/* 제목 입력 - 필수, 100자 제한 */}
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
                maxLength: { value: 100, message: '제목은 100자 이내로 입력해주세요.' }
              }}
              render={({ field }) => (
                <>
                  <Input {...field} placeholder="회의 제목을 입력하세요" />
                  <div style={{ textAlign: 'right', marginTop: '4px' }}>
                    <Text type={titleValue.length > 100 ? 'danger' : 'secondary'} style={{ fontSize: '12px' }}>
                      ({titleValue.length} / 100)
                    </Text>
                  </div>
                </>
              )}
            />
          </Form.Item>

          {/* 내용 입력 - 필수 */}
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
              render={({ field }) => (
                <Input.TextArea {...field} rows={6} placeholder="회의 내용을 입력하세요" />
              )}
            />
          </Form.Item>

          {/* 첨부파일 - 필수 */}
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
                required: '최소 한 개의 파일을 첨부해야 합니다.',
                validate: (value) => value.length > 0 || '파일을 선택해주세요.' 
              }}
              render={({ field }) => (
                <Upload
                  fileList={field.value}
                  beforeUpload={() => false} // 서버로 직접 업로드 방지
                  onChange={({ fileList }) => field.onChange(fileList)}
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
