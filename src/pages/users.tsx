// components/FindFriendsSectionTailwind.js
import FriendCard from '@/components/FriendCard';
import { useChat } from '@/contexts/contract';
import { connectingWithContract } from '@/utils/apiFeature';
import { Col, Empty, Row } from 'antd';
import React, { useEffect, useState } from 'react';

const AllUser: React.FC = () => {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { account, userName, friendLists, loading } = useChat();

  const getAllUsers = async () => {
    setIsLoading(true);
    try {
      const contract = await connectingWithContract();
      if (!contract) return alert('Vui lòng kết nối ví metamark của bạn.');
      const listUsers = await contract.getAllUsers();
      if (account && userName) {
        const lowerAccount = account.toLowerCase();
        const friendSet = new Set(
          friendLists.map((f: any) => f.friendAddress.toLowerCase()),
        );
        setList(
          listUsers.filter((u: any) => {
            const addr = u.addressUser.toLowerCase();
            return addr !== lowerAccount && !friendSet.has(addr);
          }),
        );
      } else {
        setList(listUsers);
      }
    } catch (error) {
      console.error(error);
      return alert('Hiện đang có lỗi xảy ra vui lòng thử lại sau.');
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, [account, userName, friendLists]);

  if (loading || isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 z-50">
        <p className="text-white text-lg font-semibold">Vui lòng chờ...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: '1200px',
        margin: '0 auto',
        padding: '20px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}>
      <h1
        style={{
          color: 'white',
          fontWeight: 800,
          fontSize: '26px',
          margin: '20px 0',
        }}>
        Tìm bạn bè của bạn
      </h1>
      <section
        style={{
          padding: '20px 0',
          minHeight: '60vh',
        }}>
        {list.length > 0 ? (
          <Row gutter={[16, 16]} justify="start">
            {list.map((friend, index) => (
              <Col key={index}>
                <FriendCard user={friend} setList={setList} />
              </Col>
            ))}
          </Row>
        ) : (
          <div
            style={{
              minHeight: '300px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '1200px',
            }}>
            <Empty
              description={
                <span style={{ color: '#b2bec3', fontSize: '1.2em' }}>
                  Danh sách người dùng trống
                </span>
              }
            />
          </div>
        )}
      </section>
    </div>
  );
};

export default AllUser;
