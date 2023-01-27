import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThirdwebProvider } from '@thirdweb-dev/react'
import network from '../utils/network'
import Container from '../components/Container'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider desiredChainId={network}>
      <Container>
        <Component {...pageProps} />
      </Container>
    </ThirdwebProvider>
  )
}

export default MyApp
