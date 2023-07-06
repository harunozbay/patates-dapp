
import Image from 'next/image';
import EditProductModal from "@/components/product/EditProductModal";
import DeleteProductModal from "@/components/product/DeleteProductModal";
import { Product } from '@/pages/sell';

export interface IProductBox {
    id:string;
    name: string;
    price: string;
    stock: string;
    desc: string;
    img: string;
    url: string;
    imgUrl: string;
    sellerProducts: Product[];
    setSellerProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export default function ProductBox(props: IProductBox) {
    return (
      <div className="flex flex-col justify-center items-center bg-white p-4 shadow rounded-lg">
        <div className="bg-gray-300 rounded-lg">
          <Image
            className="w-full h-full object-contain rounded-lg"
            src={props.img}
            width={192}
            height={192}
            alt={props.name}
          />
        </div>
        <div className="flex flex-row justify-center items-center  w-full">
          <h3 className="text-xl font-semibold ml-2">{props.name}</h3>
          <div className='flex'>
            <div className='ml-1 flex justify-center items-center'>
              <EditProductModal
                id={props.id}
                name={props.name}
                price={props.price}
                stock={props.stock}
                desc={props.desc}
                img={props.img}
                url={props.url}
                imgUrl={props.imgUrl}
                sellerProducts={props.sellerProducts}
                setSellerProducts={props.setSellerProducts}
              />
            </div>
            <div className='ml-1 flex justify-center items-center '>
              <DeleteProductModal
                id={props.id}
                name={props.name}
                img={props.img}
                sellerProducts={props.sellerProducts}
                setSellerProducts={props.setSellerProducts}
              />
            </div>
          </div>
        </div>

        <p className="text-gray-500">Fiyat: {props.price} ETH</p>
        <p className="text-gray-500">Stok: {props.stock}</p>
        <p className="text-gray-500">Açıklama: {props.desc}</p>
      </div>
    );
}
