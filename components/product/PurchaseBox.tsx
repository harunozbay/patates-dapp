
import Image from 'next/image';
import { Product } from '@/pages/buy';
import Button from '@/components/Button';
import { useContext, useState } from 'react';
import { Web3Context } from '@/context/web3context';
import { ethers } from 'ethers';

export interface IPurchaseBox {
    id:string;
    name: string;
    price: string;
    stock: string;
    desc: string;
    img: string;
    allProducts: Product[];
    setAllProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export default function ProductBox(props: IPurchaseBox) {
    const [quantity, setQuantity] = useState<number>(0);
    const {account, contract,loading,setLoading} = useContext(Web3Context);
    
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (
          e.target.value === "" ||
          e.target.value === undefined ||
          e.target.value === null ||
          parseInt(e.target.value)<0 ||
          Number.isNaN(parseInt(e.target.value))
        )
          setQuantity(0);
        else {
            setQuantity(parseInt(e.target.value))
            
        };
            
    }

    const purchaseProduct = async () => {
      if(contract && account){
            if(quantity>0){
                try {
                  setLoading(true);
                  const tx = await contract.purchaseProduct(parseInt(props.id), quantity, {value: ethers.utils.parseEther((parseFloat(props.price)*quantity).toString())});
                  await tx.wait();
                  console.log("tx: ", tx);
                  if (quantity == parseInt(props.stock)) {
                      const newProducts = props.allProducts.filter((product) => product.id !== props.id);
                      props.setAllProducts(newProducts);
                  }
                  else {
                    const newProducts = props.allProducts.map((product) => {
                        if (product.id === props.id) {
                            product.stock = (parseInt(product.stock) - quantity).toString();
                        }
                        return product;
                    });
                    props.setAllProducts(newProducts);
                  }
                  setLoading(false);
                } catch (error:any) {
                  alert("Satın alma işlemi başarısız oldu: " + error.message);
                  setLoading(false);
                }

            }
            else 
                alert("Lütfen miktar giriniz");
        }
    }

    return (
      <div className="flex flex-col justify-center items-center bg-white p-4 shadow rounded-lg">
        <div className="bg-gray-300 rounded-lg">
          <Image
            className="w-full h-full object-contain"
            src={props.img}
            width={192}
            height={192}
            alt={props.name}
          />
        </div>
        <h3 className="text-xl font-semibold mr-1">{props.name}</h3>
        <p className="text-gray-500">Fiyat: {props.price} ETH</p>
        <p className="text-gray-500">Stok: {props.stock}</p>
        <p className="text-gray-500 mb-5">Açıklama: {props.desc}</p>
        <div className='flex flex-row justify-center '>
            <input type="number" placeholder='Adet' value={Number(quantity)} onChange={onInputChange} className='border border-black rounded mr-2 box-border px-2 w-1/4' />
            <Button variant='solid'  disabled={ parseInt(props.stock) < quantity || quantity===0 } onClick={purchaseProduct}>Satın Al</Button>
        </div>
      </div>
    );
}
