import React from "react";
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";
import Link from "next/link";
import {
	BellIcon,
	ChevronDownIcon,
	MagnifyingGlassIcon,
	ShoppingCartIcon,
} from "@heroicons/react/20/solid";
import Image from "next/image";

type Props = {};

function Header({}: Props) {
	const connectWithMetamask = useMetamask();
	const disconnect = useDisconnect();
	const address = useAddress();
	return (
		<div className="max-w-6xl mx-auto p-2">
			<nav className="flex justify-between">
				<div className="flex items-center space-x-2 text-sm">
					{address ? (
						<div>
							<button
								className="connectWalletBtn"
								onClick={disconnect}>
								Hi, {address.slice(0, 4)}...{address.slice(-4)}
							</button>
						</div>
					) : (
						<button
							className="connectWalletBtn"
							onClick={connectWithMetamask}>
							Connect your wallet
						</button>
					)}
					<p className="headerLink">Daily Deals</p>
					<p className="headerLink">Help & Contact</p>
				</div>
				<div className="flex items-center space-x-4 text-sm">
					<p className="headerLink">Ship to</p>
					<p className="headerLink">Sell</p>
					<p className="headerLink">Watchlist</p>
					<Link
						href={"/addItem"}
						className="flex items-center hover:link">
						Add to inventory
						<ChevronDownIcon className="h-4" />
					</Link>
					<BellIcon className="h-6 w-6" />
					<ShoppingCartIcon className="h-6 w-6" />
				</div>
			</nav>
			<section className="flex items-center space-x-2">
				<div className="h-16 w-16 sm:w-28 md:w-44 cursor-pointer flex-shrink-0">
					<Link href={"/"}>
						<Image
							className="w-full h-full object-contain object-left"
							alt="ebay logo"
							src={"/assets/ebay-logo.png"}
							width={100}
                            height={100}
                            priority={true}
						/>
					</Link>
				</div>
				<button className="hidden lg:flex items-center space-x-2 w-20">
					<p className="text-gray-600 text-sm">Shop by category</p>
					<ChevronDownIcon className="h-4 flex-shrink-0" />
                </button>
                <div className="flex items-center space-x-2 px-2 md:px-5 py-2 border-black border-2 flex-1">
                    <MagnifyingGlassIcon className="w-5 text-gray-400" />
                    <input className="flex-1 outline-none" placeholder="Search for anything" type="text" />
                </div>
                <button className="hidden sm:inline bg-blue-600 text-white px-5 md:px-10 py-2 border-2 border-blue-600">Search</button>
                <Link href={"/create"}><button className="border-2 border-blue-600 px-5 md:px-10 py-2 text-blue-600 hover:bg-blue-600/50 hover:text-white">List Item</button></Link>
            </section>
            <hr />
            <section>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
            </section>
		</div>
	);
}

export default Header;
