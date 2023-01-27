import React from 'react'

import {
  useContract,
  useAddress,
  useNetwork,
  MediaRenderer,
  useNetworkMismatch,
  useOwnedNFTs,
  useCreateAuctionListing,
  useCreateDirectListing,
} from '@thirdweb-dev/react'
import { NFT } from '@thirdweb-dev/sdk'

type Props = {}

function Create({}: Props) {
  const address = useAddress()
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    'marketplace'
  )
  const { contract: collectionContract } = useContract(
    process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
    'nft-collection'
  )
  const [selectedNft, setSelectedNft] = React.useState<NFT>()

  const { data: nfts, isLoading: loadingNfts } = useOwnedNFTs(
    collectionContract,
    address
  )

  return (
    <main className="max-w-6xl max-auto p-10 pt-2">
      <h1 className="text-4xl font-bold ">List an Item</h1>
      <h2 className="text-xl font-semibold pt-5">
        Select an Item you would like to sell
      </h2>
      <hr className="mb-5" />
      <p>Below you will find the NFT&apos;s you own in your wallet</p>
      {loadingNfts ? (
        <p className="loading">Loading...</p>
      ) : (
        <div className="flex overflow-x-scroll space-x-4 p-4">
          {nfts?.map((nft) => (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
            <div
              onClick={() => setSelectedNft(nft)}
              className={`flex flex-col space-y-2 card min-w-fit border-2 ${
                selectedNft?.metadata.id === nft.metadata.id
                  ? 'bg-gray-200 scale-105 transition-all duration-150 ease-out'
                  : 'border-transparent  bg-gray-100'
              }`}
              key={nft.metadata.id}
            >
              <MediaRenderer
                className="h-48 rounded-lg"
                src={nft.metadata.image}
              />
              <p className="text-lg truncate font-bold">{nft.metadata.name}</p>
              <p className="text-xs truncate">{nft.metadata.description}</p>
            </div>
          ))}
        </div>
      )}
      {selectedNft && (
        <form>
          <div className="flex flex-col p-10">
            <div className="grid grid-cols-2 gap-5 ">
              <label className="border-r font-light">
                Direct Listing / Fixed Price
              </label>
              <input
                className="ml-auto h-10 w-10"
                type="radio"
                name="ListingType"
                value="directListing"
              />
              <label className="border-r font-light">Auction</label>
              <input
                className="ml-auto h-10 w-10"
                type="radio"
                name="ListingType"
                value="auctionListing"
              />
            </div>
          </div>
        </form>
      )}
    </main>
  )
}

export default Create
