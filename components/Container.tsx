import React from 'react'
import Header from './Header'

type Props = {
  children: React.ReactNode
}

function Container({ children }: Props) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}

export default Container
