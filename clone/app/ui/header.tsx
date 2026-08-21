import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="flex justify-around h-30 mx-auto max-w-[1550px]">
      <Link
        className="h-18 aspect-square relative block m-6"
        href={"/"}
        title="스타벅스 메인페이지"
      >
        <Image src={"/logo.png"} className="" alt="logo" fill></Image>
      </Link>
      <div className="mt-2 h-full flex flex-col">
        <div className="flex justify-end">
          <ul className="flex text-sm">
            {[
              "Sign In",
              "My Starbucks",
              "Customer Service & Ideas",
              "Find a Store",
            ].map((label, idx) => (
              <li
                className={clsx(
                  "flex items-center relative after:content-[''] after:block after:absolute after:top-1/2 after:right-0 after:border-r after:border-gray-200 after:h-3 after:-translate-y-1/2",
                  idx == 3 && "after:none",
                )}
                key={label}
              >
                <Link className="block px-4 hover:underline" href={"/"}>
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <button className="w-8 aspect-square rounded-sm border border-gray-300 bg-white p-1">
                <MagnifyingGlassIcon strokeWidth={3} />
              </button>
            </li>
          </ul>
        </div>
        <div className="mt-4 grow-1">
          <ul className="flex h-full">
            {[
              "COFFEE",
              "MENU",
              "STORE",
              "ESG",
              "STARBUCKS REWARDS",
              "CORPORATE SALES",
              "WHAT'S NEW",
            ].map((label) => (
              <li key={label} className={""}>
                <Link
                  className="block h-full pt-2 px-4 hover:bg-stone-800 hover:underline hover:text-green-600"
                  href={"/"}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
};
