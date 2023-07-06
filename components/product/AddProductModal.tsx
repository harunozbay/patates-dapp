import  { useState,useRef,useEffect, FormEvent, useContext } from "react";
import Button from "@/components/Button";
import { Product } from "@/pages/sell";
import { ThirdwebStorage ,IpfsUploader} from "@thirdweb-dev/storage";
import { Web3Context } from "@/context/web3context";
import Image from "next/image";
import { ethers } from "ethers";

type ModalProps = {
  sellerProducts: Product[];
  setSellerProducts: React.Dispatch<React.SetStateAction<Product[]>>;
};

interface FormError {
  name?: boolean;
  price?: boolean;
  stock?: boolean;
  desc?: boolean;
  img?: boolean;
}

export default function AddProductModal({ sellerProducts, setSellerProducts }: ModalProps) {
  const [showModal, setShowModal] = useState(false);
  const {contract,setLoading} = useContext(Web3Context);  
  const [newProduct, setNewProduct] = useState<Product>({} as Product);
  const [formError, setFormError] = useState<FormError>({});
  const [isFormValid, setIsFormValid] = useState(true);
  const [prevImg, setPrevImg] = useState<File>();

  const uploader = new IpfsUploader();
  const storage = new ThirdwebStorage({ uploader });



  


  useEffect(() => {
    let isValid=true;
    const newFormError={...formError};
    
    if (newProduct.name === "" || newProduct.name === undefined) {
      isValid=false;
      newFormError.name=true;
    }
    else{
      newFormError.name=false;
    }

    if (isNaN(parseFloat(newProduct.price)) || parseFloat(newProduct.price) <= 0) {
      isValid=false;
      newFormError.price=true;
    }
    else{
      newFormError.price=false;
    }

    if (isNaN(parseInt(newProduct.stock)) || parseInt(newProduct.stock) < 0) {
      isValid=false;
      newFormError.stock=true;
    }
    else{
      newFormError.stock=false;
    }
    
    if (newProduct.desc === "" || newProduct.name === undefined) {
      isValid=false;
      newFormError.desc=true;
    }
    else{
      newFormError.desc=false;
    }

    if (prevImg === undefined) {
      isValid=false;
      newFormError.img=true;
    }
    else{
      newFormError.img=false;
    }

    setFormError(newFormError);
    setIsFormValid(isValid);
    
  }, 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [ newProduct]);


  const closeModal = () => {
    setShowModal(false);
    setPrevImg(undefined);
    setNewProduct({} as Product);
  };

  const onFormChange = (e:FormEvent) => {
    e.preventDefault();
    const target = e.target as HTMLInputElement;
    setNewProduct({...newProduct, [target.name]: target.value});
  };

  const onImgChange = (e: any) => {
    if (e.target.files[0]) {
      setPrevImg(e.target.files[0]);
      setNewProduct({...newProduct, img: URL.createObjectURL(e.target.files[0])});
    }
    
    
  };


  const addSellerProducts = async () => {
    if(isFormValid){
      setLoading(true);
      const imgUploadUrl = await storage.upload(prevImg);
      console.log("imgUploadUrl:",imgUploadUrl);
      const url = await storage.upload({name:newProduct.name, desc:newProduct.desc, img:imgUploadUrl});
      console.log("URL:",url);
      console.log("Producttan önce",contract);
      
      const tx = await contract?.addProduct( parseInt(newProduct.stock) , ethers.utils.parseEther(newProduct.price), url);
      await tx.wait();
      console.log("tx:",tx);

      setSellerProducts([...sellerProducts, newProduct]);
      setLoading(false);
      closeModal();
    }
    

  }

  return (
    <>
      <Button variant="solid" onClick={() => setShowModal(true)}>
        Ürün Ekle
      </Button>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-40">
            <div className="mx-auto w-full sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4">
              {/*content*/}
              <div
                className="border-dark-600 border-[1px] rounded-3xl relative flex flex-col w-full bg-gradient-to-t from-sky-900 via-sky-800 to-sky-700"
              >
                {/*header*/}
                <div className="flex items-start justify-between p-5 bg-dark-H18 border-dark-600 border-b-[1px] rounded-t-3xl">
                  <h3 className="text-3xl font-semibold text-white">
                    Yeni Ürün
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent font-semibold hover:opacity-50"
                    onClick={() => closeModal()}
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
                    <input
                      className={`${formError.name ? "text-red-500 border-red-500 focus:outline-red-500 focus:outline-none":"text-white"}  border-[1px] rounded-full w-full px-4 h-11 bg-transparent ` }
                      name="name"
                      onChange={onFormChange}
                    />

                    <label className="block text-white font-bold mb-1 mt-2">
                      Stok
                    </label>
                    <input
                      className={`${formError.stock ? "text-red-500 border-red-500 focus:outline-red-500 focus:outline-none":"text-white"}  border-[1px] rounded-full w-full px-4 h-11 bg-transparent ` }
                      name="stock"
                      onChange={onFormChange}
                    />

                    <label className="block text-white font-bold mb-1 mt-2">
                      Fiyat
                    </label>
                    <input
                      className={`${formError.price ? "text-red-500 border-red-500 focus:outline-red-500 focus:outline-none":"text-white"}  border-[1px] rounded-full w-full px-4 h-11 bg-transparent ` }
                      name="price"
                      onChange={onFormChange}
                    />

                    <label className="block text-white font-bold mb-1 mt-2">
                      Açıklama
                    </label>
                    <input
                      className={`${formError.desc ? "text-red-500 border-red-500 focus:outline-red-500 focus:outline-none":"text-white"}  border-[1px] rounded-full w-full px-4 h-11 bg-transparent ` }
                      name="desc"
                      onChange={onFormChange}
                    />

                    <label className="block text-white font-bold mb-1 mt-2">
                      Ürün Görseli
                    </label>
                    <div className={`${formError.img ? "text-red-500 border-red-500 focus:outline-red-500 focus:outline-none":"text-white"}  border-[1px] rounded-full w-full px-4 h-11 bg-transparent flex items-center justify-center `}
                    >
                      <input
                        type="file"
                        name="img"
                        onChange={onImgChange}
                      />
                    </div>
                  </form>
                  <Image
                    src={prevImg ? URL.createObjectURL(prevImg) : "/dummy.jpg"}
                    alt="preview"
                    width={128}
                    height={128}/>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end gap-x-2 p-6 border-dark-600 border-t-[1px] rounded-b-3xl bg-dark-H18">
                  <Button
                    variant="solid"
                    onClick={addSellerProducts}
                    disabled={!isFormValid}
                  >
                    Ekle
                  </Button>
                  <Button variant="outline" onClick={() => closeModal()}>
                    Kapat
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div
            className="opacity-50 fixed inset-0 z-30 bg-black"
            
          ></div>
        </>
      ) : null}
    </>
  );
}