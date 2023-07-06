import React, { EventHandler, ReactNode } from "react";
interface IButton {
  variant: "solid" | "outline" | "wallet";
  onClick?: EventHandler<any>;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
}

export default function Button(props: IButton) {
  
  return (
    <button
      type="button"
      disabled={props.disabled}
      onClick={props.onClick}
      className={`${
        props.variant === "solid"
          ? "bg-sky-500 hover:bg-sky-700 text-white font-bold border-sky-700 disabled:bg-gray-400 disabled:border-gray-400 disabled:text-gray-700"
          : "bg-white hover:bg-sky-500 text-sky-700 font-semibold hover:text-white border-sky-500 hover:border-transparent"
      } py-2 px-4 border rounded ${
        props.className
      }`}
    >
      {props.children}
    </button>
  );
}
