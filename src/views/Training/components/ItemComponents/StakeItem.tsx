import _ from 'lodash'
import React, { useContext, useCallback, useEffect, useState } from 'react'
import { Flex, Image, Text, Tag } from '@pancakeswap-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import { getNonFungiblePlayerAddress, getTrainingAddress, getAirNftAddress } from 'utils/addressHelpers'
import { PINATA_BASE_URI } from 'config/constants/nfts'
import NonFungiblePlayer from 'config/abi/NonFungiblePlayer.json'
import Training from 'config/abi/Training.json'
import toast from 'react-hot-toast'
import { LoadingContext } from 'contexts/LoadingContext'
import { StakeContext } from 'contexts/StakeContext'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import styled from 'styled-components'
import { getNumberSuffix } from 'utils/formatBalance'

const TypeTag = styled(Tag)`
  backdrop-filter: blur(10px);
  margin-top: 10px;
`

const MultiplierTag = styled(Tag)`
  margin-left: 4px;
  margin-top: 10px;
`

const ImageContainer = styled.div`
  position: relative;
  padding-bottom: 100%;
  height: 0;
  border-top-right-radius: 16px;
  border-top-left-radius: 16px;
  overflow: hidden;
  cursor: pointer;
`

const NftImage = styled.div`
  transition: transform 0.3s ease, -webkit-transform 0.3s ease;
  transform-origin: center;
  background-size: auto 100%;
  background-position: 50%;
  background-repeat: no-repeat;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  text-align: center;
  margin-top: 24px;
  top: 0;
  &:hover {
    transform: scale(1.04);
  }
`
const Divider = styled.div`
  height: 1px;
  min-width: unset;
  background-image: url(../images/line.jpg);
  background-repeat: repeat-x;
  position: relative;
  background-size: contain;
  background-position: 50%;
`

const ItemTitle = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #694f4e;
`

const ItemContainer = styled.div`
  margin-right: 15px;
  margin-bottom: 15px;
  border-radius: 16px;
  background: #27262c;
  box-shadow: 0px 2px 12px -8px rgba(203, 203, 203, 0.7), 0px 1px 1px rgba(203, 203, 203, 0.05);
  position: relative;
`
const StakeBtn = styled.div`
  border-color: #101820;
  background-color: #101820;
  color: white;
  cursor: pointer;
  display: flex;
  justify-content: center;
  padding: 16px 12px;
  font-size: 18px;
  margin-bottom: 12px;
  border-radius: 12px;
  transition: transform 0.3s ease, -webkit-transform 0.3s ease;
  cursor: pointer;
  &:hover {
    transform: scale(1.04);
  }
`

const web3 = new Web3(Web3.givenProvider)

const nfpContract = new web3.eth.Contract(NonFungiblePlayer.abi as AbiItem[], getNonFungiblePlayerAddress())
const trainingContract = new web3.eth.Contract(Training.abi as AbiItem[], getTrainingAddress())

const StakeItem = ({ data }) => {
  const { account } = useWeb3React()
  const { setLoading } = useContext(LoadingContext)
  const { initTrainingNfts, initTrainingSelectedNfts } = useContext(StakeContext)

  const [nftInfo, setNFTInfo] = useState({
    tokenName: '',
    tokenId: '',
    imgUrl: '',
    skillPoint: 0,
    upgradableSP: 0,
    position: '',
  })

  const fetchNft = useCallback(async () => {
    if (!data || !data.tokenId) return
    const tokenURI = await nfpContract.methods.tokenURI(data.tokenId).call()
    const tmpSkillPoint = await nfpContract.methods.getSkillPoint(data.tokenId).call()
    const tmpPosition = await nfpContract.methods.getPosition(data.tokenId).call()
    const tmpUpgradableSP = await trainingContract.methods.getUpgradableSP(data.itemId).call()

    console.log('Skill Point: ', tmpSkillPoint)
    const res = await fetch(tokenURI)
    const json = await res.json()
    let imageUrl = json.image
    imageUrl = imageUrl.slice(7)
    imageUrl = `${PINATA_BASE_URI}${imageUrl}`

    setNFTInfo({
      tokenName: json.name,
      tokenId: data.tokenId,
      imgUrl: imageUrl,
      skillPoint: tmpSkillPoint,
      upgradableSP: tmpUpgradableSP,
      position: tmpPosition,
    })
  }, [data])

  useEffect(() => {
    fetchNft()
  }, [fetchNft])

  const unstakeNFT = async () => {
    setLoading(true)
    try {
      await trainingContract.methods.unStakeNfpFromTrain(data.itemId).send({ from: account })
      toast.success('Successfully Upgrade Level and Unstake For this NFT.')
    } catch (error) {
      const { message } = error as Error
      toast.error(message)
    }

    const stakingItems = await trainingContract.methods.getStakedItems(account).call()
    initTrainingSelectedNfts(stakingItems)

    const tokenIds = []
    const tmpMyTokens = []
    const nfpTokens = await nfpContract.methods.fetchMyNfts().call({ from: account })
    _.map(nfpTokens, (itm) => {
      tokenIds.push({ tokenId: itm, isAIR: false })
    })

    const myTokenHashes = []
    for (let i = 0; i < tokenIds.length; i++) {
      myTokenHashes.push(nfpContract.methods.tokenURI(tokenIds[i].tokenId).call())
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
    initTrainingNfts(tmpMyTokens)
    setLoading(false)
  }
  return (
    <ItemContainer style={{ background: '#27262c' }}>
      <Flex flexDirection="column">
        <ImageContainer>
          <NftImage style={{ backgroundImage: `url(${nftInfo.imgUrl})` }} />
        </ImageContainer>
        <Divider />
        <Flex flexDirection="column" style={{ padding: '24px' }}>
          <Text fontSize="20px" style={{ textAlign: 'center', marginBottom: '15px' }}>
            {nftInfo.tokenName}
          </Text>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '8px' }}>
            <Text fontWeight="200">Position: </Text> &nbsp;&nbsp;
            <Text fontWeight="200" fontSize="15px">
              {nftInfo.position}
            </Text>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '5px' }}>
            <Text>Current Skill Point: </Text> &nbsp;&nbsp;
            <Text fontSize="15px">{nftInfo.skillPoint}</Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
            <Text>Upgradable Skill Point: </Text> &nbsp;&nbsp;
            <Text fontSize="15px">{nftInfo.upgradableSP}</Text>
          </div>
          <StakeBtn onClick={() => unstakeNFT()}>Unstake</StakeBtn>
          {/* <UpgradeBtn>Upgrade HashRate</UpgradeBtn> */}
        </Flex>
      </Flex>
    </ItemContainer>
  )
}

export default StakeItem
