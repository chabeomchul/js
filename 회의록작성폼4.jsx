import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Form, Input, Button, Upload, Card, Space, message, Typography } from 'antd';
import { UploadOutlined, SaveOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const MeetingMinutesForm = () => {
  const { 
    control, 
    handleSubmit, 
    formState: { errors },
    watch,
    setValue
  } = useForm({
    defaultValues: {
      title: '',
      content: '',
      files: [] // 업로드 완료된 파일 정보를 담을 상태
    }
  });

  const titleValue = watch('title') || '';
  const fileList = watch('files') || [];

  // 1. [React Query] 최종 회의록 저장 Mutation
  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      console.log("최종 서버 전송 데이터:", payload);
      // return axios.post('/api/meeting-minutes', payload);
      return new Promise((res) => setTimeout(res, 1000));
    },
    onSuccess: () => message.success('회의록이 저장되었습니다.'),
  });

  // 2. [Antd customRequest] 파일 개별 업로드 처리
  const handleCustomRequest = async ({ file, onSuccess, onError }) => {
    try {
      // 자체 파일 업로드 API 호출 가정
      const formData = new FormData();
      formData.append('file', file);

      // const response = await axios.post('/api/upload', formData);
      // const fileId = response.data.id;
      
      console.log("파일 업로드 호출:", file.name);
      
      // 성공 시: 성공 처리 및 form 상태 갱신
      setTimeout(() => {
        onSuccess("ok");
        message.success(`${file.name} 업로드 성공`);
      }, 1000);
    } catch (e) {
      onError(e);
      message.error(`${file.name} 업로드 실패`);
    }
  };

  // 3. 폼 제출 핸들러 (저장 버튼 클릭 시 실행)
  const onSubmit = (data) => {
    // 이미 customRequest를 통해 업로드가 진행되므로, 
    // 여기서는 검증된 데이터를 바탕으로 최종 저장을 수행합니다.
    saveMutation.mutate(data);
  };

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
      {/* 외부 저장 버튼 영역 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Title level={3}>회의록 작성</Title>
        <Space>
          <Button 
            type="primary" 
            icon={<SaveOutlined />} 
            htmlType="submit" 
            form="meeting-form" // Form ID와 연결
            loading={saveMutation.isPending}
          >
            저장하기
          </Button>
        </Space>
      </div>

      <Card>
        <Form id="meeting-form" layout="vertical" onFinish={handleSubmit(onSubmit)}>
          
          {/* 제목: 필수 + 100자 이내 */}
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
                required: '제목은 필수 입력입니다.',
                maxLength: { value: 100, message: '제목은 100자 이내로 입력해주세요.' }
              }}
              render={({ field }) => (
                <>
                  <Input {...field} placeholder="제목을 입력하세요" size="large" />
                  <div style={{ textAlign: 'right', fontSize: '12px' }}>
                    <Text type={titleValue.length > 100 ? 'danger' : 'secondary'}>
                      {titleValue.length} / 100
                    </Text>
                  </div>
                </>
              )}
            />
          </Form.Item>

          {/* 내용: 필수 */}
          <Form.Item 
            label="내용" 
            required
            validateStatus={errors.content ? 'error' : ''} 
            help={errors.content?.message}
          >
            <Controller
              name="content"
              control={control}
              rules={{ required: '내용은 필수 입력입니다.' }}
              render={({ field }) => (
                <Input.TextArea {...field} rows={6} placeholder="회의 내용을 입력하세요" />
              )}
            />
          </Form.Item>

          {/* 첨부파일: 필수 + customRequest 이용 */}
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
                validate: (val) => (val && val.length > 0) || '파일을 최소 하나 이상 첨부해야 합니다.' 
              }}
              render={({ field }) => (
                <Upload
                  fileList={field.value}
                  customRequest={handleCustomRequest} // 자체 API 호출 로직
                  onChange={({ fileList }) => field.onChange(fileList)}
                  onRemove={(file) => {
                    const newFiles = field.value.filter(f => f.uid !== file.uid);
                    field.onChange(newFiles);
                  }}
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
