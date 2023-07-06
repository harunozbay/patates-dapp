import type { NextPage } from "next";
import Link from "next/link";
import Button from "../components/Button";

const Home: NextPage = () => {
  return (
    <div className="h-full flex flex-col">
      <h1 className="text-6xl font-bold text-center py-10 ">Patates DAPP</h1>
      <div className="flex flex-grow justify-center items-center">
        <div className="flex justify-center items-center">
          <Link href={"/buy"} className="flex flex-col items-center hover:opacity-50 mr-20">
            <div className="py-2 px-4 border-8 border-sky-500 rounded mb-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#0EA5E9"
                className="h-32 w-32"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
            </div>
            <div className="text-2xl font-bold text-center">Alışveriş</div>
          </Link>
          <Link href={"/sell"} className="flex flex-col items-center hover:opacity-50">
            <div className="py-2 px-4 border-8 border-green-700 rounded hover:opacity-50 mb-5"> 
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#15803d"
                className="w-32 h-32"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="text-2xl font-bold text-center">Satış</div>

          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
