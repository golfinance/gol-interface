import React from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Heading } from '@pancakeswap-libs/uikit'
import Page from '../../components/Layout/Page'
import NftData from './components/NftData'
import NftMarketRule from './components/NftMarketRule'
import NftDetailHeader from './components/NftDetailHeader'

type boxParam = {
  itemId: string
}

const StyledHero = styled.div`
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 20px;
`

const NftDetailContainer = styled.div`
  margin-top: 32px;
`

const NftMarketDetail = () => {
  const { itemId } = useParams<boxParam>()

  return (
    <Page>
      <StyledHero>
        <Heading as="h1" size="lg" color="secondary" mb="20px">
          NFT MarketPlace
        </Heading>
      </StyledHero>
      <NftDetailHeader collectionName="Sale Detail" />
      <NftDetailContainer>
        <NftData itemId={itemId} />
      </NftDetailContainer>
      <NftMarketRule />
    </Page>
  )
}

export default NftMarketDetail
