import React, { useState } from 'react';
import { Form, Input, Button, Typography, Space, message } from 'antd';
import { SendOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useChat } from '@/contexts/contract';
import Link from 'next/link';
import { useRouter } from 'next/router';

const { Title } = Typography;

const RegisterForm: React.FC = () => {
  const [value, setValue] = useState('');
  const { account, userName, createAccount, loading } = useChat();

  const router = useRouter();

  const createAccountUser = async () => {
    if (value === '') {
      return;
    }
    await createAccount({
      name: value,
      accountAddress: account,
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
        <p className="text-white text-lg font-semibold">Vui lòng chờ...</p>
      </div>
    );
  }

  if (account && userName) {
    router.push('/');
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
        <p className="text-white text-lg font-semibold">Vui lòng chờ...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#1f1f1f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}>
      <div
        style={{
          maxWidth: '800px',
          width: '100%',
          backgroundColor: '#262626',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.7)',
          color: '#fff',
        }}>
        <Title
          level={1}
          style={{
            color: '#fff',
            fontSize: '48px',
            marginBottom: '0',
            textAlign: 'center',
          }}>
          CHÀO MỪNG ĐẾN VỚI <br />
          <span style={{ color: '#40a9ff' }}>CHAT APP BASIC</span>
        </Title>

        <Form
          name="registration"
          // onFinish={onFinish}
          layout="vertical"
          style={{ marginTop: '30px' }}>
          <Form.Item
            label={
              <span style={{ color: '#bfbfbf' }}>Nhập tên bí danh của bạn</span>
            }
            name="name"
            rules={[
              { required: true, message: 'Vui lòng nhập tên người dùng!' },
            ]}>
            <Input
              placeholder="@theblockchaincoders"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              size="large"
              style={{
                backgroundColor: '#434343',
                borderColor: '#434343',
                color: '#fff',
                borderRadius: '6px',
              }}
            />
          </Form.Item>

          <Form.Item
            label={
              <span style={{ color: '#bfbfbf' }}>Địa chỉ Ví đã kết nối</span>
            }>
            <Input
              value={account || 'Nhập địa chỉ'}
              readOnly
              size="large"
              style={{
                backgroundColor: '#1f1f1f',
                borderColor: '#595959',
                color: '#40a9ff',
                borderRadius: '6px',
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: '0' }}>
            <Space size="large">
              <Button
                type="primary"
                htmlType="submit"
                icon={<SendOutlined />}
                size="large"
                onClick={createAccountUser}
                style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}>
                Xác nhận
              </Button>

              <Link href={'/'}>
                <Button
                  type="default"
                  icon={<CloseCircleOutlined />}
                  size="large"
                  style={{
                    backgroundColor: '#595959',
                    borderColor: '#595959',
                    color: '#fff',
                  }}>
                  Hủy bỏ
                </Button>
              </Link>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default RegisterForm;
