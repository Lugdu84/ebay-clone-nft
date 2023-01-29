import type { NextPage } from 'next'
import {
  useActiveListings,
  useContract,
  MediaRenderer,
} from '@thirdweb-dev/react'
import { ListingType } from '@thirdweb-dev/sdk'
import { BanknotesIcon, ClockIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// eslint-disable-next-line react/function-component-definition
const Home: NextPage = () => {
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    'marketplace'
  )
  const { data: listings, isLoading: loadingListings } =
    useActiveListings(contract)
  return (
    <div className="">
      <main className="max-w-6xl mx-auto py-2 px-6">
        {loadingListings ? (
          <p className="loading">Loading listings...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mx-auto">
            {listings?.map((listing) => (
              <Link
                className="flex flex-col card hover:scale-105 transition-all duration-150 ease-out  hover:bg-gray-100 "
                key={listing.id}
                href={`/listing/${listing.id}`}
              >
                <div className="flex flex-1 flex-col pb-2 items-center">
                  <MediaRenderer className="w-44" src={listing.asset.image} />
                </div>
                <div className="pt-2 space-y-4">
                  <div>
                    <h2 className="text-lg truncate">{listing.asset.name}</h2>
                    <hr />
                    <p className="truncate text-sm text-gray-600 mt-2">
                      {listing.asset.description}
                    </p>
                  </div>
                  <p className="">
                    <span className="font-bold mr-1">
                      Price : {listing.buyoutCurrencyValuePerToken.displayValue}
                    </span>
                    {listing.buyoutCurrencyValuePerToken.symbol}
                  </p>
                  <div
                    className={`flex items-center space-x-1 justify-end text-xs border w-fit ml-auto p-2 rounded-lg text-white ${
                      listing.type === ListingType.Direct
                        ? 'bg-blue-600'
                        : 'bg-red-500'
                    }`}
                  >
                    <p>
                      {listing.type === ListingType.Direct
                        ? 'Buy now'
                        : 'Auction'}
                    </p>
                    {listing.type === ListingType.Direct ? (
                      <BanknotesIcon className="h-4" />
                    ) : (
                      <ClockIcon className="h-4" />
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <ToastContainer />
    </div>
  )
}

export default Home
