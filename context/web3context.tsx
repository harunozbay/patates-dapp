import { createContext, useState, ReactNode } from "react";
import { ethers } from "ethers";

export const Web3Context = createContext<{
    account: string | undefined;
    setAccount: (account: string | undefined) => void;
    contract: ethers.Contract | undefined;
    setContract: (contract: ethers.Contract | undefined) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}>({
    account: undefined,
    setAccount: () => {},
    contract: undefined,
    setContract: () => {},
    loading: false,
    setLoading: () => {},
});
export const Web3Provider = ({ children }: { children?: ReactNode }) => {
  const [account, setAccount] = useState<string>();
  const [contract, setContract] = useState<ethers.Contract>();
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <Web3Context.Provider
      value={{ account, setAccount, contract, setContract, loading, setLoading }}
    >
      {children}
    </Web3Context.Provider>
  );
};
