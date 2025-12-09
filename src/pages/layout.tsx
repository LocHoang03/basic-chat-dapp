import React from 'react';
import { Layout, Button, Row, Col, Avatar } from 'antd';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useChat } from '@/contexts/contract';
import { useRouter } from 'next/router';

const { Header } = Layout;

const LayoutApp: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userName } = useChat();
  const router = useRouter();

  return (
    <Layout
      style={{
        minHeight: '100vh',
        backgroundColor: '#1f1f1f',
        padding: '16px',
      }}>
      <Header
        style={{
          background: 'transparent',
          borderBottom: '1px solid #434343',
          height: 'auto',
          lineHeight: 'normal',
          padding: 0,
        }}>
        <Row
          justify="space-between"
          align="middle"
          style={{ paddingBottom: '16px' }}>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Row justify="start" gutter={[14, 14]}>
              <Col>
                <Link
                  href="/users"
                  className="menuLink"
                  style={{
                    color: router.pathname === '/users' ? 'orange' : '#fff',
                    textDecoration:
                      router.pathname === '/users' ? 'underline' : 'none',
                    fontSize: 16,
                  }}>
                  Danh sách người dùng
                </Link>
              </Col>
              <Col>
                <Link
                  href="/"
                  className="menuLink"
                  style={{
                    fontSize: 16,
                    textDecoration:
                      router.pathname === '/' ? 'underline' : 'none',
                    color: router.pathname === '/' ? 'orange' : '#fff',
                  }}>
                  Đoạn chat
                </Link>
              </Col>
            </Row>
          </Col>
          <Col style={{ textAlign: 'right' }} xs={12} sm={12} md={12} lg={12}>
            {userName ? (
              <>
                <Button
                  type="primary"
                  size="large"
                  style={{
                    backgroundColor: '#1890ff',
                    borderColor: '#1890ff',
                    width: '150px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                  <Avatar icon={<UserOutlined />} /> {userName}
                </Button>
              </>
            ) : (
              <Link href={'/create-account'}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  size="large"
                  style={{
                    backgroundColor: '#1890ff',
                    borderColor: '#1890ff',
                    width: '150px',
                  }}>
                  Tạo tài khoản
                </Button>
              </Link>
            )}
          </Col>
        </Row>
      </Header>

      {children}
    </Layout>
  );
};

export default LayoutApp;
