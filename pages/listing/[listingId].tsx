/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  MediaRenderer,
  useContract,
  useListing,
  useNetwork,
  useNetworkMismatch,
  useMakeBid,
  useOffers,
  useMakeOffer,
  useBuyNow,
  useAddress,
  useAcceptDirectListingOffer,
} from '@thirdweb-dev/react'
import { UserCircleIcon } from '@heroicons/react/20/solid'
import { ListingType, NATIVE_TOKENS } from '@thirdweb-dev/sdk'
import Countdown from 'react-countdown'
import { ToastContainer } from 'react-toastify'
import { ethers } from 'ethers'
import network from '../../utils/network'
import 'react-toastify/dist/ReactToastify.css'
import notify from '../../utils/toast'

function ListingPage() {
  const router = useRouter()
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    'marketplace'
  )
  const { listingId } = router.query as { listingId: string }
  const {
    data: listing,
    isLoading,
    error: errorListing,
  } = useListing(contract, listingId)
  const [minimumNextBid, setMinimumNextBid] = useState<{
    displayValue: string
    symbol: string
  }>()
  const [bidAmount, setBidAmount] = useState<string>()
  const address = useAddress()
  const [, switchNetwork] = useNetwork()
  const networkMismatch = useNetworkMismatch()
  const { mutate: buyNow, isLoading: isLoadingByNow } = useBuyNow(contract)
  const { mutate: makeOffer, isLoading: isLoadingMakeOffer } =
    useMakeOffer(contract)
  const { data: offers } = useOffers(contract, listingId)
  const { mutate: makeBid, isLoading: isLoadingMakeBid } = useMakeBid(contract)
  const { mutate: acceptOffer } = useAcceptDirectListingOffer(contract)

  useEffect(() => {
    if (!listingId || !contract || !listing) return
    if (listing?.type === ListingType.Auction) {
      fetchMinNextBid()
    }
  }, [listingId, contract, listing])

  const fetchMinNextBid = async () => {
    if (!listingId || !contract) return
    const { displayValue, symbol } = await contract.auction.getMinimumNextBid(
      listingId
    )
    setMinimumNextBid({
      displayValue,
      symbol,
    })
  }

  const formatPlaceHolder = () => {
    if (!minimumNextBid) return ''
    if (listing?.type === ListingType.Direct) {
      return `Enter an offer in ${listing.buyoutCurrencyValuePerToken.symbol}`
    }
    return Number(minimumNextBid?.displayValue) === 0
      ? 'Enter bid amount'
      : `${minimumNextBid?.displayValue} ${minimumNextBid?.symbol} or more`
  }

  const buyNft = async () => {
    if (networkMismatch) {
      switchNetwork && switchNetwork(network)
      return
    }
    if (!listingId || !contract || !listing) return

    await buyNow(
      {
        id: listingId,
        buyAmount: 1,
        type: listing.type,
      },
      {
        onSuccess() {
          router.push('/')
          notify('NFT bought successfully', 'success')
        },
        onError() {
          notify('Error buying NFT', 'error')
        },
      }
    )
  }

  // const notify = (message: string, type: TypeOptions) =>
  //   toast(message, { type, position: 'top-center', autoClose: 3000 })

  const createBidOrOffer = async () => {
    try {
      if (networkMismatch) {
        switchNetwork && switchNetwork(network)
        return
      }

      if (!bidAmount) return

      // Direct listing
      if (listing?.type === ListingType.Direct) {
        if (
          listing.buyoutPrice.toString() ===
          ethers.utils.parseEther(bidAmount).toString()
        ) {
          await buyNft()
          return
        }
        await makeOffer(
          {
            listingId,
            quantity: 1,
            pricePerToken: bidAmount,
          },
          {
            onSuccess() {
              notify('Offer made successfully', 'success')
              setBidAmount('')
              router.push('/')
            },
            onError() {
              notify('Offer could not be made', 'error')
            },
          }
        )
      }
      // Auction listing
      if (listing?.type === ListingType.Auction) {
        await makeBid(
          {
            listingId,
            bid: bidAmount,
          },
          {
            onSuccess() {
              notify('Bid made successfully', 'success')
              setBidAmount('')
              router.replace('/')
            },
            onError() {
              notify('Bid could not be made', 'error')
            },
          }
        )
      }
    } catch (error) {
      notify('Error making bid', 'error')
    }
  }

  if (isLoading) return <div className="loading">Loading Item...</div>

  if (errorListing) return <div className="error">Error loading item</div>

  if (!listing) return <div className="error">Item not found</div>

  if (isLoadingByNow) return <div className="loading">Buying NFT...</div>

  if (isLoadingMakeOffer) return <div className="loading">Making offer...</div>

  if (isLoadingMakeBid) return <div className="loading">Making bid...</div>

  return (
    <main className="max-w-6xl mx-auto p-2 flex flex-col lg:flex-row space-y-10 space-x-5 pr-10">
      <div className="p-10 border mx-auto lg:mx-0 max-w-md lg:max-w-xl">
        <MediaRenderer src={listing?.asset.image} />
      </div>
      <section className="flex-1 space-y-5 pb-20 lg:pb-0">
        <h1 className="text-xl font-bold">{listing.asset.name}</h1>
        <p className="text-gray-600">{listing.asset.description}</p>

        <div className="flex flex-col sm:flex-row">
          <div className="flex items-center">
            <UserCircleIcon className="h-5" />
            <span className="font-bold pr-2 ">Seller: </span>
          </div>
          <p className="text-xs sm:text-base">{listing.sellerAddress}</p>
        </div>
        <div className="grid grid-cols-2 items-center py-2">
          <p className="font-bold">Listing Types:</p>
          <p className="text-xs">
            {listing.type === ListingType.Direct
              ? 'Direct Listing'
              : 'Auction Listing'}
          </p>

          <p className="font-bold">Buy It Now Price:</p>
          <p className="text-4xl font-bold">
            {listing.buyoutCurrencyValuePerToken.displayValue}{' '}
            {listing.buyoutCurrencyValuePerToken.symbol}
          </p>
          <button
            onClick={buyNft}
            className="col-start-2 mt-2 bg-blue-600 buttonFull "
            type="button"
          >
            Buy now
          </button>
        </div>
        {listing.type === ListingType.Direct && offers && (
          <div className="grid grid-cols-2 gap-y-2">
            <p className="font-bold">Offers:</p>
            <p className="font-bold">{offers.length > 0 ? offers.length : 0}</p>
            {offers.map((offer) => (
              <>
                <p className="flex items-center ml-5 text-sm italic">
                  <UserCircleIcon className="h-3 mr-2" />
                  {offer.offeror.slice(0, 5)}...{offer.offeror.slice(-5)}
                </p>
                <div>
                  <p
                    key={
                      offer.listingId +
                      offer.offeror +
                      offer.totalOfferAmount.toString()
                    }
                    className="text-sm italic "
                  >
                    {ethers.utils.formatEther(offer.totalOfferAmount)}{' '}
                    {NATIVE_TOKENS[network].symbol}
                  </p>
                  {listing.sellerAddress === address && (
                    <button
                      type="button"
                      className="p-2 w-32 bg-red-500/50 rounded-lg font-bold text-xs cursor-pointer"
                      onClick={() =>
                        acceptOffer(
                          {
                            listingId,
                            addressOfOfferor: offer.offeror,
                          },
                          {
                            onSuccess() {
                              notify('Offer accepted successfully', 'success')
                              router.replace('/')
                            },
                            onError() {
                              notify('Offer could not be accepted', 'error')
                            },
                          }
                        )
                      }
                    >
                      Accept Offer
                    </button>
                  )}
                </div>
              </>
            ))}
          </div>
        )}
        <div className="grid grid-cols-2 space-y-2 items-center justify-end">
          <hr className="col-span-2" />
          <p className="col-span-2 font-bold">
            {listing.type === ListingType.Direct
              ? 'Make an offer'
              : 'Bid on this auction'}
          </p>
          {listing.type === ListingType.Auction && (
            <>
              <p>Current minimum bid:</p>
              <p className="font-bold">
                {minimumNextBid?.displayValue} {minimumNextBid?.symbol}
              </p>
              <p>Time remaining:</p>
              <Countdown
                date={Number(listing.endTimeInEpochSeconds.toString()) * 1000}
              />
            </>
          )}
          <input
            className="border p-2 rounded-lg mr-5 outline-blue-600"
            type="text"
            onChange={(e) => setBidAmount(e.target.value)}
            placeholder={formatPlaceHolder()}
          />
          <button
            onClick={createBidOrOffer}
            type="button"
            className="bg-red-600 buttonFull"
          >
            {listing.type === ListingType.Direct ? 'Offer' : 'Bid'}
          </button>
        </div>
      </section>
      <ToastContainer />
    </main>
  )
}

export default ListingPage
