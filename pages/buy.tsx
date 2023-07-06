import { useContext, useEffect, useState } from "react";
import { ThirdwebStorage , StorageDownloader} from "@thirdweb-dev/storage";

import Link from "next/link";
import { ethers } from "ethers";
import Button from "@/components/Button";
import potatoAbi from "@/abi/potato.abi.json";
import { Web3Context } from "@/context/web3context";
import PurchaseBox from "@/components/product/PurchaseBox";


export interface Product {
  id:string;
  name: string;
  price: string;
  stock: string;
  desc: string;
  img: string;
}

export default function Buy() {
  
  const {account, contract,loading,setLoading} = useContext(Web3Context);  
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  

  useEffect(() => {
    const getAllProducts = async () => {
      if (contract && account) {
        setLoading(true);
        const products = await contract.getAvailableProducts(account);
        console.log("products: ", products[0]);
        if (products.length > 0) {
          const productsArray = products.map(async (product: any) => {
            const downloader = new StorageDownloader();
            const storage = new ThirdwebStorage({ downloader });  
            const productURL = product.productURI;
            const productData = await storage.downloadJSON(productURL);
            console.log("productData: ", productData);
            const imgData = await storage.download(productData.img);
            const imgBlob = await imgData.blob();
            
            console.log("productData: ", productData);
            console.log("imgData: ", imgData);
            return {
              id: product[0].toString(),
              price: ethers.utils.formatEther(product.price),
              stock: product.stock.toString(),
              name: productData.name,
              desc: productData.desc,
              img: URL.createObjectURL(imgBlob),
            }
          });
          setAllProducts(await Promise.all(productsArray));
          
        }
        setLoading(false);
      }
    };

    getAllProducts();
  }, [contract, account, setLoading]);


  return (
    <div className="h-full  w-full flex flex-col">
      <h1 className="text-6xl font-bold text-center py-10 ">Patates DAPP</h1>
      <div className="flex flex-grow justify-center items-center ">
        <div className="flex justify-center items-center w-full">{/* silmek? */}
          <div className="flex flex-row flex-wrap justify-center gap-4 px-8 w-full">
              { 
                allProducts.length > 0 ?
                  allProducts.map((product, index) => (
                    <div key={index} className="w-1/4">
                      <PurchaseBox
                        name={product.name}
                        id={product.id}
                        desc={product.desc}
                        price={product.price}
                        img={product.img}
                        stock={product.stock}
                        allProducts={allProducts}
                        setAllProducts={setAllProducts}
                    />
                    </div>
                  )) : loading ? <></> :
                  <div className="w-full flex justify-center items-center">
                    <h1 className="text-2xl font-bold text-center py-10">Satışta Ürün Bulunamadı</h1>
                  </div>
              }
          </div>
        </div>
      </div>
    </div>
  );
}
