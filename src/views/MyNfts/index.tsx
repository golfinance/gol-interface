import _ from 'lodash'
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Heading } from '@pancakeswap-libs/uikit'
import { AbiItem } from 'web3-utils'
import { useWeb3React } from '@web3-react/core'
import Web3 from 'web3'
import Genesis from 'config/abi/Genesis.json'
import NonFungiblePlayer from 'config/abi/NonFungiblePlayer.json'
import Market from 'config/abi/Market.json'
import { getNonFungiblePlayerAddress, getMarketAddress, getAirNftAddress } from 'utils/addressHelpers'
import airNFTs from 'config/constants/airnfts'
import Page from '../../components/Layout/Page'
import EachNft from './components/EachNft'

const StyledHero = styled.div`
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 20px;
`
const NftItemContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 -15px;
`

const web3 = new Web3(Web3.givenProvider)

const MyNfts = () => {
  const { account } = useWeb3React()
  const [myTokens, setMyTokens] = useState([])

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
    console.log('Reading NFTs >>> ')
    const tmpMyTokens = []
    const nfpTokens = await nfpContract.methods.fetchMyNfts().call({ from: account })
    console.log('> nfpTokens: ', nfpTokens)
    const tokenIds = []
    _.map(nfpTokens, (itm) => {
      tokenIds.push({ tokenId: itm, isAIR: false })
    })

    // Method to fetch airNfts (Genesis) dev@topospec
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
    setMyTokens(tmpMyTokens)
  }, [account, nfpContract, marketContract, airnftContract])
  useEffect(() => {
    getTokenHashes()
  }, [getTokenHashes])

  return (
    <Page>
      <StyledHero>
        <Heading as="h1" size="lg" color="secondary" mb="20px">
          My NFTs
        </Heading>
      </StyledHero>
      <NftItemContainer>
        {myTokens.map((EachMyToken, index) => {
          return (
            <Link key={EachMyToken.tokenHash} to={`/myNFTs/${index}`} style={{ width: '25%' }}>
              <EachNft eachMyToken={EachMyToken} key={EachMyToken.tokenId} />
            </Link>
          )
        })}
      </NftItemContainer>
    </Page>
  )
}

export default MyNfts
