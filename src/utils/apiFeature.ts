import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { CONTRACT_ADDRESS, ABI_CHAT_BASIC } from './contract';
import dayjs from 'dayjs';

export const checkIfWalletConnected = async (): Promise<string | null> => {
  try {
    if (!window.ethereum) {
      alert('Vui lòng cài đặt MetaMask để sử dụng DApp');
      return null;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    if (!accounts.length) return null;

    return accounts[0];
  } catch (error) {
    console.error('checkIfWalletConnected error:', error);
    return null;
  }
};

/**
 * Kết nối MetaMask
 */
export const connectWallet = async (): Promise<string | null> => {
  try {
    if (!window.ethereum) {
      alert('Vui lòng cài đặt MetaMask để sử dụng DApp');
      return null;
    }

    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    if (!accounts.length) return null;
    return accounts[0];
  } catch (error) {
    console.error('connectWallet error:', error);
    return null;
  }
};

const fetchContract = (
  signerOrProvider: ethers.Signer | ethers.providers.Provider,
) => new ethers.Contract(CONTRACT_ADDRESS, ABI_CHAT_BASIC, signerOrProvider);

export const connectingWithContract =
  async (): Promise<ethers.Contract | null> => {
    try {
      if (!window.ethereum) {
        alert('Vui lòng cài đặt MetaMask!');
        return null;
      }

      const web3Modal = new Web3Modal();
      const instance = await web3Modal.connect();

      const provider = new ethers.providers.Web3Provider(instance);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      return contract;
    } catch (error) {
      console.error('connectWithContract error:', error);
      return null;
    }
  };

export const isMsgOlderThan = (
  timestamp: any,
  now: dayjs.Dayjs,
  minutes: number = 5,
): boolean => {
  if (!timestamp) return false;
  const msgTime = dayjs(parseInt(timestamp._hex, 16) * 1000);
  return now.diff(msgTime, 'minute') < minutes;
};
