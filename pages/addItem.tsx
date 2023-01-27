/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react'
import { useAddress, useContract } from '@thirdweb-dev/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function addItem() {
  const router = useRouter()
  const address = useAddress()
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
    'nft-collection'
  )
  const [preview, setPreview] = useState<string>()
  const [image, setImage] = useState<File>()
  const [isUploading, setIsUploading] = useState(false)
  const [errorDescription, setErrorDescription] = useState(false)
  const [errorName, setErrorName] = useState(false)
  const [errorImage, setErrorImage] = useState(false)

  const notifyError = (error: string) => {
    toast.error(error)
  }

  const mintNft = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    let errorForm = false

    if (!address || !contract) return

    const target = e.target as typeof e.target & {
      name: { value: string }
      description: { value: string }
    }

    if (target.name.value === '') {
      setErrorName(true)
      errorForm = true
    }

    if (target.description.value === '') {
      setErrorDescription(true)
      errorForm = true
    }

    if (!image) {
      setErrorImage(true)
      errorForm = true
    }

    if (errorForm) return

    const metadata = {
      name: target.name.value,
      description: target.description.value,
      image,
    }

    try {
      setIsUploading(true)
      const transaction = await contract.mintTo(address, metadata)
      await transaction.data()
      setIsUploading(false)
      router.push('/')
    } catch (error) {
      notifyError('Something went wrong, please try again...')
      setIsUploading(false)
    }
  }

  if (isUploading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-2xl font-bold text-blue-600">Uploading...</p>
      </div>
    )
  }

  return (
    <main className="max-w-6xl mx-auto p-10 border">
      <h1 className="text-4xl font-bold">Add an item to the marketplace</h1>
      <h2 className="text-xl font-semibold pt-5">Item Details</h2>
      <p className="pb-5">
        By adding an item to the marketplace, you&apos;re essentially Minting in
        NFT of the item into your wallet witch we can then list for sale
      </p>
      <div className="flex flex-col items-center md:flex-row md:space-x-5 pt-5">
        <Image
          className="border h-80 w-80 object-contain"
          src={preview || '/assets/ebay-logo.png'}
          width={80}
          height={80}
          alt="image"
        />
        <form onSubmit={mintNft} className="flex flex-col flex-1 p-2 space-y-2">
          <label className="font-light">Name of Item</label>
          <input
            onChange={(e) => setErrorName(e.target.value === '')}
            className="formField"
            placeholder="Enter name..."
            type="text"
            name="name"
            id="name"
          />
          <span className=" text-red-500">
            {errorName && 'Name is required'}
          </span>
          <label className="font-light">Description of Item</label>
          <input
            onChange={(e) => setErrorDescription(e.target.value === '')}
            className="formField"
            placeholder="Enter description..."
            type="text"
            name="description"
            id="description"
          />
          <span className=" text-red-500">
            {errorDescription && 'Description is required'}
          </span>
          <label className="font-light">Image of the Item</label>
          <input
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setImage(e.target.files[0])
                setPreview(URL.createObjectURL(e.target.files[0]))
                setErrorImage(false)
              }
            }}
            className="mb-5"
            placeholder="Enter image url..."
            type="file"
          />
          <span className=" text-red-500">
            {errorImage && 'Image is required'}
          </span>
          <button
            className="bg-blue-600 text-white rounded-full py-4 px-10 w-56 mx-auto md:mr-0"
            type="submit"
          >
            Add/Mint Item
          </button>
        </form>
      </div>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </main>
  )
}

export default addItem
