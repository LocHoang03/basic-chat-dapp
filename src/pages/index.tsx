import React, { useEffect, useRef, useState } from 'react';
import {
  Layout,
  Button,
  Row,
  Col,
  Card,
  Space,
  Skeleton,
  Avatar,
  Input,
  message,
  Popover,
} from 'antd';
import {
  UserAddOutlined,
  DeleteOutlined,
  UserOutlined,
  SendOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useChat } from '@/contexts/contract';
import dayjs from 'dayjs';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { isMsgOlderThan } from '@/utils/apiFeature';

const { Content } = Layout;

interface User {
  friendAddress: string;
  name: string;
}

interface Message {
  _sender: string;
  _content: string;
  _timestamp: {
    _hex: string;
    _isBigNumber: boolean;
  };
  _isDeleted: boolean;
  _isEdited: boolean;
}

const Home: React.FC = () => {
  const [activeAdr, setActiveAdr] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState('');
  const [valueCheck, setValueCheck] = useState('');
  const [sending, setSending] = useState(false);
  const [listMsg, setListMsg] = useState<Message[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const name = searchParams.get('name');
  const address = searchParams.get('address');
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [showNotice, setShowNotice] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [now, setNow] = useState(dayjs());

  const {
    account,
    userName,
    friendLists,
    loading,
    sendMessage,
    readMessage,
    editMessage,
    deleteMessage,
  } = useChat();

  const fetchData = async () => {
    try {
      setIsLoading(true);

      if (!name?.trim() && !address?.trim()) {
        if (!friendLists.length) return;

        const firstFriend = friendLists[0];
        setActiveAdr(firstFriend);

        const dataMsg = await readMessage(firstFriend.friendAddress);
        setListMsg(dataMsg);
      } else {
        if (!name || !address) return;

        const selected: User = {
          name,
          friendAddress: address,
        };

        setActiveAdr(selected);

        const dataMsg = await readMessage(address);
        setListMsg(dataMsg);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  useEffect(() => {
    fetchData();
  }, [friendLists, address, name]);
  useEffect(() => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  }, [listMsg]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(dayjs());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSendMessage = async () => {
    if (!value.trim()) return;
    setSending(true);
    let valueCancel = value;

    try {
      setValue('');
      if (!valueCheck.trim()) {
        const success = await sendMessage({
          msg: value,
          address: activeAdr?.friendAddress || '',
        });

        if (!success) {
          setSending(false);
          return;
        }

        const timestamp = {
          _hex: '0x' + Math.floor(Date.now() / 1000).toString(16),
          _isBigNumber: true,
        };

        const newMessage = {
          _sender: account,
          _content: value,
          _timestamp: timestamp,
          _isDeleted: false,
          _isEdited: false,
        };

        setListMsg((prev) => [...prev, newMessage]);
        setSending(false);
      } else {
        const success = await editMessage({
          msg: value,
          address: activeAdr?.friendAddress || '',
          index: Number(selectedIndex),
        });

        if (!success) {
          setValue(valueCancel);
          setSending(false);
          return;
        }

        setListMsg((prev) => {
          const newList = [...prev];
          newList[Number(selectedIndex)] = {
            ...newList[Number(selectedIndex)],
            _content: value,
            _isEdited: true,
          };
          return newList;
        });
        setSending(false);
        setValue('');
        setSelectedIndex(0);
        setValueCheck('');
        setShowNotice(false);
      }
    } catch (error: any) {
      setSending(false);
    }
  };

  const handleChangeUserChat = async (dt: any) => {
    router.push({
      pathname: '/',
      query: {
        name: dt.name,
        address: dt.friendAddress,
      },
    });
  };
  const handleEdit = (msg: any, index: any) => {
    setSelectedIndex(index);
    setValueCheck(msg._content);
    setValue(msg._content);
    setShowNotice(true);
  };
  const handleCancel = () => {
    setValueCheck('');
    setValue('');
    setShowNotice(false);
  };

  const handleDelete = async (index: any) => {
    setSending(true);
    try {
      const success = await deleteMessage({
        index: Number(index),
        address: activeAdr?.friendAddress || '',
      });

      if (!success) return;
      setListMsg((prev) => {
        const newList = [...prev];
        newList[Number(index)] = {
          ...newList[Number(index)],
          _isDeleted: true,
        };
        return newList;
      });
      setSending(false);
    } catch (error) {}
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 z-50">
        <p className="text-white text-lg font-semibold">Vui lòng chờ...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: '#262626',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
        marginTop: 16,
      }}>
      <Row justify="end" style={{ marginTop: '16px', marginRight: '24px' }}>
        <Row gutter={16}>
          <Col span={24}>
            <Link href={'/users'}>
              <Button
                icon={<UserAddOutlined />}
                block
                size="large"
                style={{
                  backgroundColor: '#52c41a',
                  borderColor: '#52c41a',
                }}>
                Thêm bạn bè
              </Button>
            </Link>
          </Col>
        </Row>
      </Row>

      <Content style={{ padding: '16px 16px' }}>
        <Row gutter={24}>
          <Col span={8}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Row gutter={16}>
                <Col span={24}>
                  <Card
                    title={
                      <span style={{ color: '#91d5ff' }}>Danh sách bạn bè</span>
                    }
                    bordered={false}
                    bodyStyle={{ padding: 0, marginTop: '1px' }}
                    style={{
                      backgroundColor: '#434343',
                      minHeight: '350px',
                    }}>
                    <div className="flex-1 h-80 overflow-y-auto overflow-x-hidden">
                      {loading ? (
                        <Skeleton />
                      ) : (
                        <div>
                          {friendLists?.length > 0 ? (
                            friendLists.map((dt: any, index: number) => {
                              return (
                                <div
                                  onClick={() => handleChangeUserChat(dt)}
                                  key={index}
                                  className={`py-[8px] hover:bg-slate-600 cursor-pointer border-b-2 border-orange-500
                                     ${
                                       activeAdr?.friendAddress.toLowerCase() ===
                                       dt.friendAddress.toLowerCase()
                                         ? 'bg-slate-600'
                                         : ''
                                     }`}>
                                  <Row gutter={10}>
                                    <Col
                                      span={2}
                                      className="ml-[5px] mr-[30px]">
                                      {' '}
                                      <Avatar
                                        size={50}
                                        icon={<UserOutlined />}
                                      />
                                    </Col>
                                    <Col
                                      span={18}
                                      className="overflow-hidden whitespace-nowrap text-ellipsis text-white">
                                      <h3 className="font-bold text-[16px] ">
                                        {dt.name}
                                      </h3>
                                      <span className="">
                                        {dt.friendAddress}
                                      </span>
                                    </Col>
                                  </Row>
                                </div>
                              );
                            })
                          ) : (
                            <div
                              style={{
                                height: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: '100px',
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '18px',
                              }}>
                              <p className="">Chưa có bạn bè</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                </Col>
              </Row>
            </Space>
          </Col>

          <Col span={16}>
            <Card
              title={
                activeAdr ? (
                  <Row gutter={10} className="py-[8px]">
                    <Col span={1}>
                      {' '}
                      <Avatar size={50} icon={<UserOutlined />} />
                    </Col>
                    <Col
                      span={18}
                      className="overflow-hidden whitespace-nowrap text-ellipsis text-white ml-[35px]">
                      <h3 className="font-bold text-[18px] ">
                        {activeAdr.name}
                      </h3>
                      <span className="">{activeAdr.friendAddress}</span>
                    </Col>
                  </Row>
                ) : (
                  ''
                )
              }
              bordered={false}
              style={{
                backgroundColor: '#434343',
                minHeight: '450px',
              }}>
              <div
                style={{
                  height: '400px',
                  border: '1px dashed #595959',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}>
                {account && userName ? (
                  <>
                    {' '}
                    <div
                      style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: 12,
                        color: '#fff',
                      }}>
                      {isLoading ? (
                        <>
                          <Skeleton />
                          <Skeleton className="mt-5" />
                        </>
                      ) : (
                        <div className="">
                          {listMsg.length > 0 ? (
                            listMsg.map((msg: any, index) => {
                              const content = (
                                <div
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                  }}>
                                  {isMsgOlderThan(msg._timestamp, now) && (
                                    <button
                                      className="buttonContent px-2 py-1 text-sm bg-gray-200 rounded mb-1 hover:bg-gray-300"
                                      onClick={() => handleEdit(msg, index)}>
                                      Sửa
                                    </button>
                                  )}
                                  {!msg._isDeleted && (
                                    <button
                                      className="buttonContent px-2 py-1 text-sm bg-red-400 rounded hover:bg-red-500 text-white"
                                      onClick={() => handleDelete(index)}>
                                      Xóa
                                    </button>
                                  )}
                                </div>
                              );

                              return (
                                <div
                                  key={index}
                                  className={`mb-2 flex ${
                                    msg._sender.toLowerCase() ===
                                    account.toLowerCase()
                                      ? 'justify-end'
                                      : 'justify-start'
                                  }`}>
                                  <div
                                    className={`flex flex-col max-w-[50%] ${
                                      msg._sender.toLowerCase() ===
                                      account.toLowerCase()
                                        ? 'items-end'
                                        : 'items-start'
                                    }`}>
                                    <Popover
                                      content={
                                        isMsgOlderThan(msg._timestamp, now) ||
                                        !msg._isDeleted
                                          ? content
                                          : null
                                      }
                                      placement={
                                        msg._sender.toLowerCase() ===
                                        account.toLowerCase()
                                          ? 'left'
                                          : 'right'
                                      }
                                      trigger="hover">
                                      <span
                                        className={`${
                                          msg._sender.toLowerCase() ===
                                          account.toLowerCase()
                                            ? 'bg-green-600'
                                            : 'bg-blue-500'
                                        } px-3 py-1 border rounded-[4px] font-medium 
                break-words whitespace-pre-wrap inline-block w-fit text-white`}>
                                        {msg._isDeleted
                                          ? 'Tin nhắn đã bị xóa'
                                          : msg._content}
                                      </span>
                                    </Popover>

                                    <span className="text-xs text-white mt-1 self-end block">
                                      {msg._isEdited &&
                                        !msg._isDeleted &&
                                        'Đã sửa'}
                                      {''}{' '}
                                      {msg._timestamp
                                        ? dayjs(
                                            parseInt(msg._timestamp._hex, 16) *
                                              1000,
                                          ).format('DD/MM/YYYY HH:mm:ss')
                                        : ''}
                                    </span>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="h-full flex items-center justify-center mt-[150px]">
                              <span>Hãy bắt đầu cuộc trò chuyện</span>
                            </div>
                          )}
                          <div ref={bottomRef} />
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        gap: 10,
                        padding: 8,
                        background: '#1f2937',
                        borderTop: '1px solid #333',
                        position: 'relative',
                      }}>
                      <Input
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="nhập tin nhắn"
                        style={{
                          borderRadius: 20,
                          border: 'none',
                          color: '#000',
                        }}
                      />

                      <Button
                        type="primary"
                        onClick={handleSendMessage}
                        icon={<SendOutlined />}
                        style={{ background: 'orange', border: 'none' }}
                        disabled={sending || valueCheck === value}
                      />
                      {showNotice && (
                        <div className="absolute top-0 left-0 right-0 -translate-y-full bg-yellow-200 text-black px-2 py-1 rounded flex justify-between items-center text-sm z-10">
                          <span>Sửa tin nhắn</span>
                          <button onClick={handleCancel} className="font-bold">
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div style={{ margin: '200px auto 0' }}>
                    <p style={{ color: 'white', fontSize: '18px' }}>
                      Vui lòng tạo tài khoản
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </Content>
    </div>
  );
};

export default Home;
