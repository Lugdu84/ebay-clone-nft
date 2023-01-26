import React from "react";
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";
import Link from "next/link";

type Props = {};

function Header({}: Props) {
	const connectWithMetamask = useMetamask();
	const disconnect = useDisconnect();
	const address = useAddress();
	return (
		<div>
			<nav className="flex justify-between">
				<div className="flex items-center space-x-2 text-sm">
					{address ? (
						<div>
                            <button className="connectWalletBtn" onClick={disconnect}>Hi, {address.slice(0, 4)}...{address.slice(-4)}</button>
						</div>
					) : (
						<button
							className="connectWalletBtn"
							onClick={connectWithMetamask}>
							Connect with Metamask
						</button>
                    )}
                    <p className="headerLink">Daily Deals</p>
                    <p className="headerLink">Help & Contact</p>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                    <p className="headerLink">Ship to</p>
                    <p className="headerLink">Sell</p>
                    <p className="headerLink">Watchlist</p>
                    <Link href={"/addItem"} >
                        Add to inventory
                    </Link>
                </div>
			</nav>
		</div>
	);
}

export default Header;
