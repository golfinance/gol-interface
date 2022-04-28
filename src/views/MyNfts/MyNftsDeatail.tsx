import _ from 'lodash'
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import Genesis from 'config/abi/Genesis.json'
import NonFungiblePlayer from 'config/abi/NonFungiblePlayer.json'
import { getNonFungiblePlayerAddress, getMarketAddress, getAirNftAddress } from 'utils/addressHelpers'
import Market from 'config/abi/Market.json'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Heading } from '@pancakeswap-libs/uikit'
import airNFTs from 'config/constants/airnfts'
import Page from '../../components/Layout/Page'
import MyNftData from './components/MyNftData'
import MyNftDetailHeader from './components/MyNftDetailHeader'

const StyledHero = styled.div`
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 20px;
`
const NftDetailContainer = styled.div`
  margin-top: 32px;
`

const web3 = new Web3(Web3.givenProvider)

type boxParam = {
  myTokenId: string
}

const MyNftsDeatail = () => {
  const { myTokenId } = useParams<boxParam>()
  const { account } = useWeb3React()
  const [myToken, setMyToken] = useState({})
  const [isAIR, setIsAIR] = useState(false)

  const nfpContract = useMemo(() => {
    return new web3.eth.Contract(NonFungiblePlayer.abi as AbiItem[], getNonFungiblePlayerAddress())
  }, [])

  const marketContract = useMemo(() => {
    return new web3.eth.Contract(Market.abi as AbiItem[], getMarketAddress())
  }, [])

  const airnftContract = useMemo(() => {
    return new web3.eth.Contract(Genesis.abi as AbiItem[], getAirNftAddress())
  }, [])

  const getTokenHashes = useCallback(async () => {
    const tmpMyTokens = []
    const tokenIds = []
    // const nfpTokens = await nfpContract.methods.fetchMyNfts().call({ from: account })
    // _.map(nfpTokens, (itm) => {
    //   tokenIds.push({ tokenId: itm, isAIR: false })
    // })

    // retrieve my nft from air
    const airNftOwners = []
    _.map(airNFTs, (nft) => {
      airNftOwners.push(airnftContract.methods.ownerOf(nft).call())
    })
    const owners = await Promise.all(airNftOwners)
    _.map(owners, (owner, idx) => {
      if (owner !== account) return

      tokenIds.push({ tokenId: airNFTs[idx], isAIR: true })
    })
    const items = await marketContract.methods.fetchItemsCreated().call({ from: account })
    const tokenIdLength = tokenIds.length
    for (let i = 0; i < tokenIdLength; i++) {
      if (!tmpMyTokens[i]) tmpMyTokens[i] = {}
      tmpMyTokens[i].itemId = '0'
    }
    let currentIndex = 0
    for (let i = 0; i < items.length; i++) {
      if (items[i].isSold === false) {
        tokenIds.push({ tokenId: items[i].tokenId, isAIR: false })
        if (!tmpMyTokens[currentIndex + tokenIdLength]) tmpMyTokens[currentIndex + tokenIdLength] = {}
        tmpMyTokens[currentIndex + tokenIdLength].itemId = items[i].itemId
        currentIndex++
      }
    }

    const myTokenHashes = []
    for (let i = 0; i < tokenIds.length; i++) {
      if (!tokenIds[i].isAIR) myTokenHashes.push(nfpContract.methods.tokenURI(tokenIds[i].tokenId).call())
      else myTokenHashes.push(airnftContract.methods.tokenURI(tokenIds[i].tokenId).call())
    }
    const result = await Promise.all(myTokenHashes)

    for (let i = 0; i < tokenIds.length; i++) {
      if (!tmpMyTokens[i]) tmpMyTokens[i] = {}
      tmpMyTokens[i].tokenId = tokenIds[i].tokenId
      tmpMyTokens[i].tokenHash = result[i]
      tmpMyTokens[i].isAIR = tokenIds[i].isAIR
    }

    setIsAIR(tmpMyTokens[myTokenId].isAIR)
    setMyToken(tmpMyTokens[myTokenId])
  }, [account, nfpContract, marketContract, myTokenId, airnftContract])
  useEffect(() => {
    getTokenHashes()
  }, [getTokenHashes])

  return (
    <Page>
      <StyledHero>
        <Heading as="h1" size="lg" color="secondary" mb="20px">
          My NFT Detail
        </Heading>
      </StyledHero>
      <MyNftDetailHeader collectionName={isAIR ? 'Air NFT' : 'NonFungiblePlayer'} />
      <NftDetailContainer>
        <MyNftData myToken={myToken} />
      </NftDetailContainer>
    </Page>
  )
}

export default MyNftsDeatail
