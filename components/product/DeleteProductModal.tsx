
import  { useState,useRef,useEffect, FormEvent, useContext } from "react";
import Button from "@/components/Button";
import { Product } from "@/pages/sell";
import Image from "next/image";
import { ThirdwebStorage,IpfsUploader } from "@thirdweb-dev/storage";
import { Web3Context } from "@/context/web3context";
import { ethers } from "ethers";

interface ModalProps {
    id:string;
    name: string;
    img: string; 
    sellerProducts: Product[];
    setSellerProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}
    

export default function DeleteProductModal({ name,id,img,sellerProducts,setSellerProducts }: ModalProps) {
  const {contract,setLoading} = useContext(Web3Context);  
  const [showModal, setShowModal] = useState(false);

  const deleteProduct = async () => {
    try {  
        setLoading(true); 
        const newSellerProducts = [...sellerProducts];
        const index = newSellerProducts.findIndex(
          (product) => product.id ===id
        );
        newSellerProducts.splice(index, 1);
        const tx = await contract?.removeProduct( parseInt(id));
        await tx?.wait();
        console.log("tx:", tx);

        setSellerProducts(newSellerProducts);
        setLoading(false);
        setShowModal(false);
    
      } catch (error:any) {
        alert("Silinemedi:"+error.message);
        setLoading(false);
        
      }
    
    
  };

  return (
    <>
      <button onClick={() => setShowModal(true)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="#DC2626"
          className="w-4 h-4 hover:opacity-50"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
          />
        </svg>
      </button>
      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-40"
          >
            <div className="mx-auto w-full sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4">
              {/*content*/}
              <div className="border-dark-600 border-[1px] rounded-3xl relative flex flex-col w-full bg-gradient-to-t from-sky-900 via-sky-800 to-sky-700">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-dark-600 border-b-[1px] rounded-t-3xl">
                  <h3 className="text-3xl font-semibold text-white">
                    Ürün Silinsin mi?
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent font-semibold hover:opacity-50"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="h-6 w-6 text-3xl block leading-none focus:outline-none text-white">
                      x
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto flex flex-col items-center">                    
                    <Image
                        src={img}
                        alt="preview"
                        width={128}
                        height={128}/>
                    
                    <h3 className="text-2xl font-semibold text-white">
                        {name} ürünü silinsin mi?
                    </h3>
                    
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end gap-x-2 p-6 border-dark-600 border-t-[1px] rounded-b-3xl bg-dark-H18">
                  
                  <Button variant="solid" className="!bg-red-500 !hover:bg-red-300" onClick={deleteProduct} >
                    Sil
                  </Button>
                  <Button variant="outline" onClick={() => setShowModal(false)} >
                    Kapat
                  </Button>
                  
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-50 fixed inset-0 z-30 bg-black" ></div>
        </>
      ) : null}
    </>
  );
}