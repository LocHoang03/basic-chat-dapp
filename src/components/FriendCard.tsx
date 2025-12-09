import { useChat } from '@/contexts/contract';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, message } from 'antd';
import { useRouter } from 'next/router';

const FriendCard = ({ user, setList }: any) => {
  const { addFriends, account, userName } = useChat();
  const router = useRouter();

  return (
    <div className="bg-slate-800 p-8 rounded-xl shadow-lg w-72 text-center relative flex flex-col items-center">
      <div className="relative w-24 h-24 mb-5">
        <Avatar size={100} icon={<UserOutlined />} />
      </div>

      <div className="mb-6 w-full">
        <p
          className="text-white text-lg font-bold mb-1"
          title={user.addressUser}>
          {user.name}
        </p>
        <p
          className="text-gray-400 text-sm italic w-full overflow-hidden whitespace-nowrap text-ellipsis px-1 block"
          title={user.addressUser}>
          {user.addressUser}
        </p>
      </div>

      <button
        className="w-full py-2 px-4 text-indigo-400 border border-indigo-500 
                           rounded-full font-semibold transition duration-300 
                           hover:bg-indigo-600 hover:text-white hover:border-indigo-600"
        onClick={async () => {
          try {
            if (account && userName) {
              const success = await addFriends({
                name: user.name,
                accountAddress: user.addressUser,
              });

              if (success)
                setList((prevList: any) =>
                  prevList.filter(
                    (item: any) => item.addressUser !== user.addressUser,
                  ),
                );
            } else router.push('/create-account');
          } catch (error) {}
        }}>
        Thêm bạn bè
      </button>
    </div>
  );
};
export default FriendCard;
