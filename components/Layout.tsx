import { ReactNode, useContext } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Web3Context } from "@/context/web3context";

export default function Layout({ children }: { children?: ReactNode }) {
  const { account, contract, loading } = useContext(Web3Context);

  return (
    <div className="flex flex-col h-screen">
      {
        loading &&
        <>
          <div className="opacity-70 fixed inset-0 z-50 bg-black flex justify-center items-center"></div>
          <div className="fixed bg-transparent inset-0 z-50 bg-black flex justify-center items-center">
              <div className={`h-10 w-10 bg-sky-500 !opacity-100 rounded-full mr-1 animate-bounce`}></div>
              <div className={`h-10 w-10 bg-sky-500 rounded-full mr-1 animate-bounce200`}></div>
              <div className={`h-10 w-10 bg-sky-500 rounded-full animate-bounce400`}></div>
          </div>
        </>

      }
      <Navbar />
      <main className="bg-gradient-to-t from-gray-400 to-gray-200 text-black flex flex-grow justify-center items-center pb-5" >
        {account && contract ? children : loading ? <></> : <div className="text-5xl"> Cüzdan Bağlayın ve Polygon Testnete geçin...</div>}
      </main>
      <Footer />
    </div>
  );
}
