import Link from "next/link";
import {useContext} from "react";
import ConnectWallet from "./ConnectWallet";



const MENU_LIST = [
  { text: "Al", href: "/buy" },
  { text: "Sat", href: "/sell" },
];


export default function Navbar() {
  
  return (
    <header className="sticky top-0 left-0 bg-white">
      <nav className="flex flex-row h-16 items-center justify-between">
        <div className="pl-5 flex flex-row">
          <Link href={"/"} className="mr-5">
            <div className="text-lg font-bold">PatatesDAPP</div>
          </Link>
          <>
            {MENU_LIST.map((item) => (
              <Link key={item.href} href={item.href} className="text-lg mr-5">
                {item.text}
              </Link>
            ))}
          </>
        </div>
        <div className="pr-5">
          <ConnectWallet/>
        </div>
      </nav>
    </header>
  );
}
