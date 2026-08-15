import Image from "next/image";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="flex justify-around mx-auto">
      <Link
        href={"/"}
        className="w-18 aspect-square relative block m-6"
        title="스타벅스 메인페이지"
      >
        <Image src={"/logo.png"} alt="logo" fill></Image>
      </Link>
      <div className="mt-2">
        <div className="flex justify-end">
          <ul className="flex text-sm">
            {[
              "Sign In",
              "My Starbucks",
              "Customer Service & Ideas",
              "Find a Store",
            ].map((label) => (
              <li className="flex items-center" key={label}>
                <Link className="block px-4 hover:underline" href={"/"}>
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <button className="w-8 aspect-square rounded-sm border border-gray-300 bg-white"></button>
            </li>
          </ul>
        </div>
        <div>
          <ul className="flex">
            <li>COFFEE</li>
            <li>MENU</li>
            <li>STORE</li>
            <li>ESG</li>
            <li>STARBUCKS REWARDS</li>
            <li>CORPORATE SALES</li>
            <li>WHAT'S NEW</li>
          </ul>
        </div>
      </div>
    </header>
  );
};
