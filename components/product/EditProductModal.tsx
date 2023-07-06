import  { useState,useRef,useEffect, FormEvent, useContext } from "react";
import Button from "@/components/Button";
import { Product } from "@/pages/sell";
import { IProductBox } from "./ProductBox";
import Image from "next/image";
import { ThirdwebStorage,IpfsUploader } from "@thirdweb-dev/storage";
import { Web3Context } from "@/context/web3context";
import { ethers } from "ethers";

interface FormError {
  name?: boolean;
  price?: boolean;
  stock?: boolean;
  desc?: boolean;
  img?: boolean;
}

export default function EditProductModal({ name,id,price,stock, img,desc,url,imgUrl,sellerProducts,setSellerProducts }: IProductBox) {
  const {contract,setLoading} = useContext(Web3Context);  
  const [showModal, setShowModal] = useState(false);
  const [updatedProduct, setUpdatedProduct] = useState<Product>({
    name: name,
    id: id,
    price: price,
    stock: stock,
    img: img,
    desc: desc,
    url: url,
    imgUrl: imgUrl,
  });
  const [prevImg, setPrevImg] = useState<File>();
  const [formError, setFormError] = useState<FormError>({});
  const [isFormValid, setIsFormValid] = useState(true);

  const uploader = new IpfsUploader();
  const storage = new ThirdwebStorage({ uploader });




  useEffect(() => {
    if (
      updatedProduct.name !== name ||
      updatedProduct.price !== price ||
      updatedProduct.stock !== stock ||
      updatedProduct.desc !== desc ||
      prevImg
    ) {
      let isValid=true;
      const newFormError={...formError};
      
      if (updatedProduct.name === "" || updatedProduct.name === undefined) {
        isValid=false;
        newFormError.name=true;
      }
      else{
        newFormError.name=false;
      }

      if (isNaN(parseFloat(updatedProduct.price)) || parseFloat(updatedProduct.price) <= 0) {
        isValid=false;
        newFormError.price=true;
      }
      else{
        newFormError.price=false;
      }

      if (isNaN(parseInt(updatedProduct.stock)) || parseInt(updatedProduct.stock) < 0) {
        isValid=false;
        newFormError.stock=true;
      }
      else{
        newFormError.stock=false;
      }
      
      if (updatedProduct.desc === "" || updatedProduct.name === undefined) {
        isValid=false;
        newFormError.desc=true;
      }
      else{
        newFormError.desc=false;
      }
      setFormError(newFormError);
      setIsFormValid(isValid);
    } else {
      setIsFormValid(false);
    }  

    
  }, 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [desc, name, prevImg, price, stock, updatedProduct]);

  const onFormChange = (e:FormEvent) => {
    e.preventDefault();
    const target = e.target as HTMLInputElement;
    setUpdatedProduct({...updatedProduct, [target.name]: target.value});
  };

  const onImgChange = (e: any) => {
    if (e.target.files[0]){
      setPrevImg(e.target.files[0]);
      setUpdatedProduct({...updatedProduct, img: URL.createObjectURL(e.target.files[0])});
    }
  };



  const updateSellerProduct = async () => {
    if (isFormValid) {
      try {  
        setLoading(true); 
        const newSellerProducts = [...sellerProducts];
        const index = newSellerProducts.findIndex(
          (product) => product.id === updatedProduct.id
        );
        newSellerProducts[index] = updatedProduct;

        let productURI: string;
        if (
          updatedProduct.name != name ||
          updatedProduct.img != img ||
          updatedProduct.desc != desc
        ) {
          let newImgUrl: string;
          if (prevImg?.name) {
            newImgUrl = await storage.upload(prevImg);
            setUpdatedProduct({...updatedProduct, imgUrl: newImgUrl});
            console.log("newImgUrl:", newImgUrl);
            
          } else newImgUrl = updatedProduct.imgUrl as string;

          productURI = await storage.upload({
            name: updatedProduct.name,
            desc: updatedProduct.desc,
            img: newImgUrl,
          });
        } else productURI = url as string;

        // console.log("productURI after edit:", productURI);
        // alert("productURI after edit:"+productURI);
        

        const tx = await contract?.updateProduct(
          parseInt(id),
          ethers.utils.parseEther(updatedProduct.price),
          parseInt(updatedProduct.stock),
          productURI
        );
        await tx?.wait();
        console.log("tx:", tx);

        setSellerProducts(newSellerProducts);
        setLoading(false);
        setShowModal(false);
    
      } catch (error:any) {
        alert("Güncellenemedi:"+error.message);
        setLoading(false);
        
      }
    }
    
  };

  return (
    <>
      <button onClick={() => setShowModal(true)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="#0EA5E9"
          className="w-4 h-4 hover:opacity-50"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
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
                <div className="flex items-start justify-between p-5 bg-dark-H18 border-dark-600 border-b-[1px] rounded-t-3xl">
                  <h3 className="text-3xl font-semibold text-white">
                    Ürünü Güncelle
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
                  <form className="w-full mb-5">                    
                    <label className="block text-white font-bold mb-1">
                    Ürün Adı
                    </label>
                    <input className={`${formError.name ? "text-red-500 border-red-500 focus:outline-red-500 focus:outline-none":"text-white"}  border-[1px] rounded-full w-full px-4 h-11 bg-transparent ` } defaultValue={name} name="name" onChange={onFormChange}/>
                    
                    <label className="block text-white font-bold mb-1 mt-2">
                    Stok
                    </label>
                    <input className={`${formError.stock ? "text-red-500 border-red-500 focus:outline-red-500 focus:outline-none":"text-white"}  border-[1px] rounded-full w-full px-4 h-11 bg-transparent ` } defaultValue={stock} name="stock" onChange={onFormChange}/>
                    
                    <label className="block text-white font-bold mb-1 mt-2">
                    Fiyat
                    </label>
                    <input className={`${formError.price ? "text-red-500 border-red-500 focus:outline-red-500 focus:outline-none":"text-white"} border-[1px] rounded-full w-full px-4 h-11 bg-transparent ` } defaultValue={price} name="price" onChange={onFormChange}/>
                    
                    <label className="block text-white font-bold mb-1 mt-2">
                    Açıklama
                    </label>
                    <input className={`${formError.desc ? "text-red-500 border-red-500 focus:outline-red-500 focus:outline-none":"text-white"} border-[1px] rounded-full w-full px-4 h-11 bg-transparent ` } defaultValue={desc} name="desc" onChange={onFormChange}/>
                       
                    <label className="block text-white font-bold mb-1 mt-2">
                    Ürün Görseli
                    </label>
                    
                    <div className="border-[1px] rounded-full w-full px-4 h-11 bg-transparent text-white flex flex-col justify-center">
                      <input
                        type="file"
                        name="img"
                        onChange={onImgChange}
                    
                      />
                    </div>
                    
                  </form>
                  <Image
                    src={prevImg ? URL.createObjectURL(prevImg) :img}
                    alt="preview"
                    width={128}
                    height={128}/>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end gap-x-2 p-6 border-dark-600 border-t-[1px] rounded-b-3xl bg-dark-H18">
                  
                  <Button variant="solid" onClick={updateSellerProduct} disabled={!isFormValid}>
                    Güncelle
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