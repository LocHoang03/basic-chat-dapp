import ChatABI from '../contracts/BasicChat.json';

export const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  '0x9374f2cFA66767129831A462A32369284Ed881a2';

export const ABI_CHAT_BASIC = ChatABI.abi;
