import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

import { connectingWithContract, connectWallet } from '../utils/apiFeature';
import { message } from 'antd';
interface Friend {
  friendAddress: string;
  name: string;
}

interface Message {
  _sender: string;
  _content: string;
  _timestamp: number;
  _isDeleted: boolean;
}

interface ChatContextType {
  account: string;
  userName: string;
  friendLists: Friend[];
  friendMsg: Message[];
  loading: boolean;
  error: string;
  currentUserName: string;
  currentUserAddress: string;
  setAccount: React.Dispatch<React.SetStateAction<string>>;
  setUserName: React.Dispatch<React.SetStateAction<string>>;

  fetchData: () => Promise<void>;
  readMessage: (friendAddress: string) => any;
  createAccount: (params: {
    name: string;
    accountAddress: string;
  }) => Promise<void>;
  addFriends: (params: {
    name: string;
    accountAddress: string;
  }) => Promise<boolean | void>;
  sendMessage: (params: {
    msg: string;
    address: string;
  }) => Promise<boolean | void>;
  editMessage: (params: {
    msg: string;
    address: string;
    index: number;
  }) => Promise<boolean | void>;
  deleteMessage: (params: {
    address: string;
    index: number;
  }) => Promise<boolean | void>;
  readUser: (userAddress: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState('');
  const [userName, setUserName] = useState('');
  const [friendLists, setFriendLists] = useState<Friend[]>([]);
  const [friendMsg, setFriendMsg] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUserName, setCurrentUserName] = useState('');
  const [currentUserAddress, setCurrentUserAddress] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const contract = await connectingWithContract();
      if (!contract) {
        alert('Không thể kết nối với Hợp đồng. Vui lòng kiểm tra ví MetaMask.');
        return;
      }

      const connectAccount = await connectWallet();
      if (connectAccount) setAccount(connectAccount);

      const userName = await contract.getUserName(connectAccount);
      setUserName(userName);

      const friendList = await contract.getMyFriendlist();
      setFriendLists(friendList);
    } catch (error) {
      console.error(error);
      setError('Vui lòng kết nối ví MetaMask');
    } finally {
      setLoading(false);
    }
  };

  const readMessage = async (friendAddress: string) => {
    try {
      const contract = await connectingWithContract();
      if (!contract) return;
      const read: Message[] = await contract.getChatMessageForId(friendAddress);
      console.log(read);
      return read;
    } catch (error) {
      console.error(error);
    }
  };

  const createAccount = async ({
    name,
    accountAddress,
  }: {
    name: string;
    accountAddress: string;
  }) => {
    if (!name || !accountAddress)
      return alert('Vui lòng cung cấp Tên và Địa chỉ Ví.');
    const hide = message.loading('Vui lòng đợi...', 0);

    try {
      const contract = await connectingWithContract();
      if (!contract)
        return setError(
          'Không thể kết nối với Hợp đồng. Vui lòng kiểm tra ví MetaMask.',
        );

      const tx = await contract.createAccountUser(name);
      await tx.wait();
      hide();
      message.success('Tạo thành công!');
      window.location.reload();
    } catch (error) {
      setLoading(false);
      hide();
      message.error('Bạn đã hủy yêu cầu!');
    }
  };

  const addFriends = async ({
    name,
    accountAddress,
  }: {
    name: string;
    accountAddress: string;
  }) => {
    if (!name || !accountAddress)
      return alert('Vui lòng cung cấp Tên và Địa chỉ Ví của người bạn.');
    const hide = message.loading('Vui lòng chờ...', 0);
    try {
      const contract = await connectingWithContract();
      if (!contract)
        return alert(
          'Không thể kết nối với Hợp đồng. Vui lòng kiểm tra ví MetaMask.',
        );

      const tx = await contract.addFriend(accountAddress, name);
      await tx.wait();
      setFriendLists((prev) => [
        ...prev,
        { name: name, friendAddress: accountAddress },
      ]);
      hide();
      message.success('Thêm thành công!');
      return true;
    } catch (error) {
      hide();
      message.error('Bạn đã hủy yêu cầu!');
      return false;
    }
  };

  const sendMessage = async ({
    msg,
    address,
  }: {
    msg: string;
    address: string;
  }) => {
    if (!msg || !address)
      return alert(
        'Vui lòng nhập nội dung tin nhắn và chọn địa chỉ người nhận.',
      );
    const hide = message.loading('Đang gửi tin nhắn...', 0);
    try {
      const contract = await connectingWithContract();
      if (!contract)
        return alert(
          'Không thể kết nối với Hợp đồng. Vui lòng kiểm tra ví MetaMask.',
        );

      const tx = await contract.sendMessage(address, msg);
      await tx.wait();
      hide();
      message.success('Đã gửi thành công!');
      return true;
    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn:', error);
      hide();
      message.error('Bạn đã hủy yêu cầu!');

      return false;
    }
  };

  const editMessage = async ({
    msg,
    address,
    index,
  }: {
    msg: string;
    address: string;
    index: number;
  }) => {
    if (!msg || !address)
      return alert(
        'Vui lòng nhập nội dung tin nhắn và chọn địa chỉ người nhận.',
      );
    const hide = message.loading('Đang gửi tin nhắn...', 0);
    try {
      const contract = await connectingWithContract();
      if (!contract)
        return alert(
          'Không thể kết nối với Hợp đồng. Vui lòng kiểm tra ví MetaMask.',
        );

      const tx = await contract.editMessage(address, index, msg);
      await tx.wait();
      hide();
      message.success('Sửa thành công!');
      return true;
    } catch (error) {
      hide();
      message.error('Bạn đã hủy yêu cầu!');
      return false;
    }
  };

  const deleteMessage = async ({
    address,
    index,
  }: {
    address: string;
    index: number;
  }) => {
    if (!address) return setError('Vui lòng nhập địa chỉ người nhận.');
    const hide = message.loading('Vui lòng chờ...', 0);
    try {
      const contract = await connectingWithContract();
      if (!contract)
        return alert(
          'Không thể kết nối với Hợp đồng. Vui lòng kiểm tra ví MetaMask.',
        );

      const tx = await contract.deleteMessage(address, index);
      await tx.wait();
      hide();
      message.success('Xóa thành công!');
      return true;
    } catch (error) {
      hide();
      message.error('Bạn đã hủy yêu cầu!');
      return false;
    }
  };

  const readUser = async (userAddress: string) => {
    try {
      const contract = await connectingWithContract();
      if (!contract) return;

      const userName = await contract.getUsername(userAddress);
      setCurrentUserName(userName);
      setCurrentUserAddress(userAddress);
    } catch (error) {
      console.error('Lỗi khi đọc thông tin người dùng:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ChatContext.Provider
      value={{
        account,
        userName,
        friendLists,
        friendMsg,
        loading,
        error,
        currentUserName,
        currentUserAddress,
        setAccount,
        setUserName,
        fetchData,
        readMessage,
        createAccount,
        addFriends,
        sendMessage,
        editMessage,
        deleteMessage,
        readUser,
      }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
