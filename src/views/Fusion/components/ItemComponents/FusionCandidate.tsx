import _ from 'lodash'
import React, { useContext, useCallback, useEffect, useState } from 'react'
import { StakeContext } from 'contexts/StakeContext'
import styled from 'styled-components'
import toast from 'react-hot-toast'
import { PINATA_BASE_URI } from 'config/constants/nfts'
import NonFungiblePlayer from 'config/abi/NonFungiblePlayer.json'
import { getNonFungiblePlayerAddress, getTrainingAddress } from 'utils/addressHelpers'
import { useWeb3React } from '@web3-react/core'
import Training from 'config/abi/Training.json'
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
const trainingContract = new web3.eth.Contract(Training.abi as AbiItem[], getTrainingAddress())
const nfpContract = new web3.eth.Contract(NonFungiblePlayer.abi as AbiItem[], getNonFungiblePlayerAddress())

const FusionCandidate = ({ data, closeRequest, index }) => {
  const { account } = useWeb3React()
  const [nftInfo, setNFTInfo] = useState({ tokenName: '', tokenId: '', imgUrl: '', position: '', gen: '' })
  const { setLoading } = useContext(LoadingContext)
  const { initSelectedFirstNft, initSelectedSecondNft } = useContext(StakeContext)
  const fetchNft = useCallback(async () => {
    if (!data || !data.tokenId) return

    const tmpPosition = await nfpContract.methods.getPosition(data.tokenId).call()
    const tmpGen = await nfpContract.methods.getGeneration(data.tokenId).call()

    const res = await fetch(data.tokenHash)
    const json = await res.json()

    let imageUrl = json.image

    imageUrl = imageUrl.slice(7)
    imageUrl = `${PINATA_BASE_URI}${imageUrl}`

    setNFTInfo({
      tokenName: json.name,
      tokenId: data.tokenId,
      imgUrl: imageUrl,
      position: tmpPosition.toString(),
      gen: tmpGen.toString(),
    })
  }, [data])

  useEffect(() => {
    fetchNft()
  }, [fetchNft])

  const nftSelected = () => {
    if (index === 1) {
      initSelectedFirstNft({ tokenId: data.tokenId, isAIR: data.isAIR })
    } else if (index === 2) {
      initSelectedSecondNft({ tokenId: data.tokenId, isAIR: data.isAIR })
    }

    closeRequest()
  }

  return (
    <CandidateWrapper style={{ backgroundImage: `url('${nftInfo.imgUrl}')` }} onClick={(e) => nftSelected()}>
      <span>{nftInfo.tokenName}</span>
      <HoverWrapper>
        <TypeTag variant="success" outline>
          {nftInfo.position}
        </TypeTag>
        <MultiplierTag variant="secondary">{`Gen ${nftInfo.gen}`}</MultiplierTag>
      </HoverWrapper>
    </CandidateWrapper>
  )
}

export default FusionCandidate
