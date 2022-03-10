import _ from 'lodash'
import React, { useContext, useCallback, useEffect, useState } from 'react'
import { StakeContext } from 'contexts/StakeContext'
import styled from 'styled-components'
import toast from 'react-hot-toast'
import { PINATA_BASE_URI } from 'config/constants/nfts'
import NonFungiblePlayer from 'config/abi/NonFungiblePlayer.json'
import AirNfts from 'config/abi/Genesis.json'
import { getNonFungiblePlayerAddress, getStakingAddress, getAirNftAddress } from 'utils/addressHelpers'
import { useWeb3React } from '@web3-react/core'
import Staking from 'config/abi/Staking.json'
import airNFTs from 'config/constants/airnfts'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import { LoadingContext } from 'contexts/LoadingContext'
import { Tag } from '@pancakeswap-libs/uikit'

const MultiplierTag = styled(Tag)`
  margin-left: 4px;
`

const TypeTag = styled(Tag)`
  backdrop-filter: blur(10px);
`

const HoverWrapper = styled.div`
  position: absolute;
  top: 12px;
  right: 8px;
`

const CandidateWrapper = styled.div`
  cursor: pointer;
  margin: 10px;
  background: #fff;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 3%), 0 4px 6px -2px rgb(0 0 0 / 1%);
  border-radius: 24px;
  padding: 16px;
  width: calc(20% - 20px);
  box-sizing: border-box;
  display: flex;
  transition: transform 0.3s ease, -webkit-transform 0.3s ease;
  padding-top: calc(20% - 50px);
  position: relative;
  background-size: cover;
  color: white;

  @media (max-width: 768px) {
    width: calc(50% - 20px);
    padding-top: calc(50% - 50px);
  }

  &:before {
    position: absolute;
    z-index: 0;
    content: '';
    width: 100%;
    height: 40px;
    bottom: 0;
    left: 0;
    backdrop-filter: blur(5px);
    border-radius: 0 0 24px 24px;
  }

  span {
    z-index: 10;
    text-shadow: 2px 2px 2px black;
    text-transform: uppercase;
  }
`

const web3 = new Web3(Web3.givenProvider)
const stakingContract = new web3.eth.Contract(Staking.abi as AbiItem[], getStakingAddress())
const nfpContract = new web3.eth.Contract(NonFungiblePlayer.abi as AbiItem[], getNonFungiblePlayerAddress())
const airnftContract = new web3.eth.Contract(AirNfts.abi as AbiItem[], getAirNftAddress())

const StakeCandidate = ({ data, closeRequest, index }) => {
  const { account } = useWeb3React()
  const [nftInfo, setNFTInfo] = useState({ tokenName: '', tokenId: '', imgUrl: '', isAIR: false })
  const { setLoading } = useContext(LoadingContext)
  const { initMyNFTS, initSelectedNFTs } = useContext(StakeContext)

  const fetchNft = useCallback(async () => {
    if (!data || !data.tokenId) return

    const res = await fetch(data.tokenHash)
    const json = await res.json()

    let imageUrl = json.image

    // if (!data.isAIR) {
    //   imageUrl = imageUrl.slice(7)
    //   imageUrl = `${PINATA_BASE_URI}${imageUrl}`
    // }
    imageUrl = imageUrl.slice(7)
    imageUrl = `${PINATA_BASE_URI}${imageUrl}`

    setNFTInfo({ tokenName: json.name, tokenId: data.tokenId, imgUrl: imageUrl, isAIR: data.isAIR })
  }, [data])

  useEffect(() => {
    fetchNft()
  }, [fetchNft])

  const nftSelected = async () => {
    setLoading(true)
    closeRequest()
    if (!data.isAIR)
      try {
        await nfpContract.methods.approve(getStakingAddress(), data.tokenId).send({ from: account })

        await stakingContract.methods.stake(data.contractAddress, data.tokenId).send({ from: account })
        toast.success('Successfully Staked NFT.')
      } catch (error) {
        const { message } = error as Error
        toast.error(message)
      }
    else
      try {
        await airnftContract.methods.approve(getStakingAddress(), data.tokenId).send({ from: account })
        await stakingContract.methods.stake(data.contractAddress, data.tokenId).send({ from: account })
        toast.success('Successfully Staked NFT.')
      } catch (error) {
        const { message } = error as Error
        toast.error(message)
      }

    const tmpStakingItems = await stakingContract.methods.getStakedItems(account).call()
    const stakingItems = []
    for (let i = 0; i < tmpStakingItems.length; i++) {
      if (index === '1' && tmpStakingItems[i].contractAddress === getNonFungiblePlayerAddress())
        stakingItems.push(tmpStakingItems[i])
      else if (index === '2' && tmpStakingItems[i].contractAddress === getAirNftAddress())
        stakingItems.push(tmpStakingItems[i])
    }

    initSelectedNFTs(stakingItems)

    /** Init My NFTs again */

    const tokenIds = []
    const tmpMyTokens = []
    if (index === '1') {
      const nfpTokens = await nfpContract.methods.fetchMyNfts().call({ from: account })

      _.map(nfpTokens, (itm) => {
        tokenIds.push({ tokenId: itm, isAIR: false })
      })
    }

    // retrieve my nft from air
    else {
      const airNftOwners = []
      _.map(airNFTs, (nft) => {
        airNftOwners.push(airnftContract.methods.ownerOf(nft).call())
      })
      const owners = await Promise.all(airNftOwners)
      _.map(owners, (owner, idx) => {
        if (owner.toLowerCase() !== account.toLowerCase()) return
        tokenIds.push({ tokenId: airNFTs[idx], isAIR: true })
      })
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
      if (!tokenIds[i].isAIR) tmpMyTokens[i].contractAddress = getNonFungiblePlayerAddress()
      else tmpMyTokens[i].contractAddress = getAirNftAddress()
    }

    initMyNFTS(tmpMyTokens)
    setLoading(false)
  }

  return (
    <CandidateWrapper style={{ backgroundImage: `url('${nftInfo.imgUrl}')` }} onClick={(e) => nftSelected()}>
      <span>{nftInfo.tokenName}</span>
      <HoverWrapper>
        <TypeTag variant="success" outline>
          {nftInfo.isAIR ? 'Genesis' : 'NonFungibleToken'}
        </TypeTag>
        <MultiplierTag variant="secondary">{nftInfo.isAIR ? '10X' : '1X'}</MultiplierTag>
      </HoverWrapper>
    </CandidateWrapper>
  )
}

export default StakeCandidate
