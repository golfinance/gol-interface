import React from 'react'
import styled from 'styled-components'
import { Heading } from '@pancakeswap-libs/uikit'
import Page from '../../components/Layout/Page'
import NftHeader from './components/NftHeader'
import NftItems from './components/NftItems'

const StyledHero = styled.div`
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 20px;
`
const NftMarket = () => {
  return (
    <Page>
      <StyledHero>
        <Heading as="h1" size="lg" color="secondary" mb="20px">
          NFT Market
        </Heading>
      </StyledHero>
      <NftHeader />
      <NftItems />
    </Page>
  )
}

export default NftMarket
