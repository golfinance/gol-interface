import _ from 'lodash'
import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { StakeContext } from 'contexts/StakeContext'
import { useWeb3React } from '@web3-react/core'
import NonFungiblePlayer from 'config/abi/NonFungiblePlayer.json'
import Fusion from 'config/abi/Fusion.json'
import GolToken from 'config/abi/GolToken.json'
import Web3 from 'web3'
import { toWei, AbiItem, toBN } from 'web3-utils'
import { getNonFungiblePlayerAddress, getFusionAddress, getGolTokenAddress } from 'utils/addressHelpers'
import toast from 'react-hot-toast'
import { LoadingContext } from 'contexts/LoadingContext'
import { Button } from '@pancakeswap-libs/uikit'
import NewItem from './ItemComponents/NewItem'

const FusionControlContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const StakeItemEach = styled.div`
  width: 25%;
  @media (max-width: 500px) {
    width: 100%;
  }
`

const web3 = new Web3(Web3.givenProvider)
const nfpContract = new web3.eth.Contract(NonFungiblePlayer.abi as AbiItem[], getNonFungiblePlayerAddress())
const fusionContract = new web3.eth.Contract(Fusion.abi as AbiItem[], getFusionAddress())
const golTokenContract = new web3.eth.Contract(GolToken.abi as AbiItem[], getGolTokenAddress())

const FusionContainer = () => {
  const { account } = useWeb3React()
  const { initMyNFTS, initSelectedFirstNft, initSelectedSecondNft } = useContext(StakeContext)
  const { setLoading } = useContext(LoadingContext)

  const { selectedFirstNft, selectedSecondNft } = useContext(StakeContext)

  const [fusionAvailable, setFusionAvailable] = useState(false)
  const [tokenId1, setTokenId1] = useState(0)
  const [tokenId2, setTokenId2] = useState(0)

  useEffect(() => {
    const fetchNftData = async () => {
      const gen1 = await nfpContract.methods.getGeneration(selectedFirstNft.tokenId).call()
      const class1 = await nfpContract.methods.getClass(selectedFirstNft.tokenId).call()
      const position1 = await nfpContract.methods.getPosition(selectedFirstNft.tokenId).call()

      const gen2 = await nfpContract.methods.getGeneration(selectedSecondNft.tokenId).call()
      const class2 = await nfpContract.methods.getClass(selectedSecondNft.tokenId).call()
      const position2 = await nfpContract.methods.getPosition(selectedSecondNft.tokenId).call()

      setTokenId1(selectedFirstNft.tokenId)
      setTokenId2(selectedSecondNft.tokenId)

      if (
        selectedFirstNft.tokenId !== selectedSecondNft.tokenId &&
        gen1.toString() === gen2.toString() &&
        class1.toString() === class2.toString() &&
        position1.toString() === position2.toString()
      )
        setFusionAvailable(true)
      else setFusionAvailable(false)
    }
    fetchNftData()
  }, [selectedFirstNft, selectedSecondNft])

  const fusionNFP = async () => {
    setLoading(true)
    console.log(tokenId1, tokenId2)

    const priceWei = toWei(toBN('10000000000000000000000000000000000000000'), 'ether')
    const allowance = await golTokenContract.methods.allowance(account, getFusionAddress()).call()
    const fusionFee = await fusionContract.methods.fusionFee().call()
    if (parseInt(allowance.toString()) < parseInt(fusionFee) * 100000000000000000000) {
      await golTokenContract.methods.approve(getFusionAddress(), priceWei).send({ from: account })
    }
    try {
      await fusionContract.methods
        .fusionNFPs(tokenId1, tokenId2)
        .send({ from: account })
        .on('transactionHash', function () {
          toast.success('Transaction submitted')
        })
        .on('receipt', function (receipt) {
          console.log('Receipt => ', receipt)
          toast.success('Mint succeed')
        })
    } catch (err: unknown) {
      const { message } = err as Error
      toast.error(message)
    }

    const tokenIds = []
    const tmpMyTokens = []
    const nfpTokens = await nfpContract.methods.fetchMyNfts().call({ from: account })
    console.log('NFP Tokens: ', nfpTokens)
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
      tmpMyTokens[i].contractAddress = getNonFungiblePlayerAddress()
    }
    initMyNFTS(tmpMyTokens)

    // initSelectedFirstNft({ tokenId: 0, isAir: false })
    // initSelectedSecondNft({ tokenId: 0, isAir: false })

    setLoading(false)
  }
  return (
    <FusionControlContainer>
      <StakeItemEach>
        <NewItem index={1} />
      </StakeItemEach>
      {fusionAvailable ? (
        <Button style={{ width: '25%' }} onClick={fusionNFP}>
          Fusion
        </Button>
      ) : (
        <Button style={{ width: '25%' }} disabled>
          Not matching NFTs
        </Button>
      )}
      <StakeItemEach>
        <NewItem index={2} />
      </StakeItemEach>
    </FusionControlContainer>
  )
}

export default FusionContainer
