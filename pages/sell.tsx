import { useContext, useEffect, useState } from "react";
import { ThirdwebStorage , StorageDownloader} from "@thirdweb-dev/storage";
import { ethers } from "ethers";
import { Web3Context } from "@/context/web3context";
import Button from "@/components/Button";
import ProductBox from "@/components/product/ProductBox";
import AddProductModal from "@/components/product/AddProductModal";


export interface Product {
  id:string;
  name: string;
  price: string;
  stock: string;
  desc: string;
  img: string;
  url: string;
  imgUrl:string;
}

export default function Sell() {
  
  const {account, contract,loading,setLoading} = useContext(Web3Context);  
  const [canSell, setCanSell] = useState<boolean>();
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);

  const [sellerFee, setSellerFee] = useState<ethers.BigNumberish>(0);

  useEffect(() => {
    const isSeller = async () => {
      if (contract && account) {
        setLoading(true);
        const isSeller = await contract.isSeller(account);
        console.log("isSeller: ", isSeller);
        if (isSeller) {
          const products = await contract.getSellerProducts(account);
          console.log("products: ", products);
          
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
                url: productURL,
                imgUrl: productData.img,
              }
            });
            setSellerProducts(await Promise.all(productsArray));
          }
        } 
        else{
          const sellerFee = await contract.sellerFee();
          setSellerFee(sellerFee);
        }
        return isSeller;
      }
      return false;
    };

    isSeller().then((isSeller) => {
      setCanSell(isSeller);
      setLoading(false);
    });
  }, [contract, account, setLoading]);



  const becomeSeller = async () => {
    if (contract && account) {
      setLoading(true);
      try {
        const tx = await contract.becomeSeller({value: sellerFee});
        await tx.wait();
        setLoading(false);
        setCanSell(true);
      } catch (error:any) {
        setLoading(false);
        alert(error.message);
      }
    }
  };

  

  return (
    <div className="h-full  w-full flex flex-col">
      <h1 className="text-6xl font-bold text-center py-10 ">Patates DAPP</h1>
      <div className="flex flex-grow justify-center items-center ">
        <div className="flex justify-center items-center w-full">
          {canSell ? (
            <div className="w-full">
              <div className="flex justify-center items-center mb-5">
                <AddProductModal
                  sellerProducts={sellerProducts}
                  setSellerProducts={setSellerProducts}
                />
              </div>

              <div className="flex flex-row justify-center gap-4 px-8 flex-wrap">
              {
                sellerProducts.length>0 ?
                  sellerProducts.map((product, index) => (
                    <div key={index} className="w-1/5">
                      <ProductBox
                      name={product.name}
                      id={product.id}
                      desc={product.desc}
                      price={product.price}
                      img={product.img}
                      stock={product.stock}
                      url={product.url}
                      imgUrl={product.imgUrl}
                      sellerProducts={sellerProducts}
                      setSellerProducts={setSellerProducts}
                    />
                    </div>
                  )):
                  <div className="w-full flex justify-center items-center">
                    <h1 className="text-2xl font-bold text-center py-10">Satışta Ürününüz Bulunmamaktadır</h1>
                  </div>
                
              }
              </div>
            </div>
          ) : loading ? <></>:(
              <div className="w-full flex flex-col justify-center items-center">
                <h1 className="text-2xl font-bold text-center  py-10">Henüz Satıcı Değilsiniz</h1>
                <Button variant="solid" onClick={becomeSeller}>
                { ethers.utils.formatEther(sellerFee)} ETH Karşılığında Satıcı Ol
              </Button>
              </div>
          )}
        </div>
      </div>
    </div>
  );
}
