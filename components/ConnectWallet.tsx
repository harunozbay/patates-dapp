/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useContext } from "react";
import { ethers } from "ethers";
import Button from "./Button";
import { Web3Context } from "@/context/web3context";
import potatoAbi from "../abi/potato.abi.json";



export default function ConnectWallet() {
  const {account, setAccount, setContract} = useContext(Web3Context);  
  
  useEffect(() => {
    checkIfLoggedIn();
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", (chainId:any) => {
          window.location.reload();
          console.log("chainChanged: ",chainId);
      });
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();// do not reload when first connecting
      });
    }
  });

  const checkIfLoggedIn = async () => {
    if (window.ethereum.isMetaMask) {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      console.log("Accounts: ",accounts);
      
      if (accounts.length > 0) {
        loginWithMetamask(accounts);
      }
    } else alert("Please install Metamask");
  };


  const loginWithMetamask = async (accountsAlready?:any) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = accountsAlready
      ? accountsAlready
      : await provider.send("eth_requestAccounts", []);

    const chainId = await provider.send("eth_chainId",[]);
    if (chainId !== "0x13881") {
      setAccount(undefined);
      setContract(undefined);
      return;
    }

    const balance = await provider.getBalance(accounts[0]);
    const balanceInEther = ethers.utils.formatEther(balance);

    const signer = provider.getSigner();
    const contract= new ethers.Contract("0x5741DD9E3746104bF313674B671B619006B12D5A", potatoAbi, signer);

    setContract(contract);
    setAccount(accounts[0]);
   
  };

  const logout= async()=>{
      setAccount(undefined);      
  }

  const renderMetamask = () => {
    if (!account) {
      return (
        <Button variant="solid" onClick={() => loginWithMetamask()}>Metamaskı Bağla</Button>
      );
    } else {
      return (
        <div className="flex flex-row justify-center items-center">
          <div className="border border-sky-500 rounded py-2 px-4 mr-5">
            Account: <span className="font-bold">{account.slice(0,8)}....{account.slice(-4)}</span>
          </div>
          <Button variant="outline" onClick={()=>{logout()}}> Çıkış</Button>
        </div>
      );
    }
  };

  return <div className="">{renderMetamask()}</div>;
}

