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
import { PINATA_BASE_URI } from 'config/constants/nfts'
import { LoadingContext } from 'contexts/LoadingContext'
import { Button, Heading, Tag } from '@pancakeswap-libs/uikit'
import Modal from 'react-modal'
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
const BoxShadow = styled.div`
  background: #27262c;
  box-shadow: 0px 2px 12px -8px rgba(203, 203, 203, 0.7), 0px 1px 1px rgba(203, 203, 203, 0.05);
  position: relative;
  width: 100%;
`
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
const nfpContract = new web3.eth.Contract(NonFungiblePlayer.abi as AbiItem[], getNonFungiblePlayerAddress())
const fusionContract = new web3.eth.Contract(Fusion.abi as AbiItem[], getFusionAddress())
const golTokenContract = new web3.eth.Contract(GolToken.abi as AbiItem[], getGolTokenAddress())

const FusionContainer = () => {
  const { account } = useWeb3React()
  const { initMyNFTS, initSelectedFirstNft, initSelectedSecondNft, selectedFirstNft, selectedSecondNft } =
    useContext(StakeContext)
  const { setLoading } = useContext(LoadingContext)

  const [fusionAvailable, setFusionAvailable] = useState(false)
  const [tokenId1, setTokenId1] = useState(0)
  const [tokenId2, setTokenId2] = useState(0)
  const [isOpen, setModalOpen] = useState(false)

  const [fusionedNft, setFusionedNft] = useState({
    tokenId: 0,
    tokenName: '',
    imgUrl: '',
    skillPoint: 0,
    level: 0,
    gen: 0,
    position: '',
    class: '',
  })

  useEffect(() => {
    const fetchNftData = async () => {
      if (selectedFirstNft.tokenId === 0 || selectedSecondNft.tokenId === 0) return

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

    let tokenUri = ''
    let tmpSkillPoint = 0
    let tmpLevel = 0
    let tmpGen = 0
    let tmpClass = ''
    let tmpPosition = ''

    let tmpFusionedTokenId = 0
    try {
      await fusionContract.methods
        .fusionNFPs(tokenId1, tokenId2)
        .send({ from: account })
        .on('transactionHash', function () {
          toast.success('Transaction submitted')
        })
        .on('receipt', function (receipt) {
          console.log('Receipt0 => ', receipt.events.fusionSucceed.returnValues.tokenId)
          tmpFusionedTokenId = parseInt(receipt.events.fusionSucceed.returnValues.tokenId)
          toast.success('Mint succeed')
        })
    } catch (err: unknown) {
      const { message } = err as Error
      toast.error(message)
    }

    if (tmpFusionedTokenId !== 0) {
      console.log('TMp Fusioned Token Id', tmpFusionedTokenId)

      tokenUri = await nfpContract.methods.tokenURI(tmpFusionedTokenId).call()
      tmpSkillPoint = await nfpContract.methods.getSkillPoint(tmpFusionedTokenId).call()
      tmpLevel = await nfpContract.methods.getLevel(tmpFusionedTokenId).call()
      tmpGen = await nfpContract.methods.getGeneration(tmpFusionedTokenId).call()
      tmpClass = await nfpContract.methods.getClass(tmpFusionedTokenId).call()
      tmpPosition = await nfpContract.methods.getPosition(tmpFusionedTokenId).call()
      const res = await fetch(tokenUri)
      const json = await res.json()
      let tmpImageUrl = json.image
      tmpImageUrl = tmpImageUrl.slice(7)
      tmpImageUrl = `${PINATA_BASE_URI}${tmpImageUrl}`

      setFusionedNft({
        tokenId: selectedFirstNft.tokenId,
        tokenName: json.name,
        imgUrl: tmpImageUrl,
        skillPoint: tmpSkillPoint,
        level: tmpLevel,
        gen: tmpGen,
        position: tmpPosition,
        class: tmpClass,
      })

      setModalOpen(true)
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

    initSelectedFirstNft({ tokenId: 0, isAIR: false })
    initSelectedSecondNft({ tokenId: 0, isAIR: false })

    setFusionAvailable(false)

    setLoading(false)
  }

  const closeDialog = () => {
    setModalOpen(false)
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

      <Modal
        isOpen={isOpen}
        onRequestClose={closeDialog}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '70vw',
            maxWidth: '70vw',
            minWidth: '70vw',
            borderRadius: '15px',
            background: '#27262c',
            zindex: 15,
          },
        }}
        contentLabel="Example Modal"
      >
        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <Heading as="h1" size="lg" color="primary" mb="25px" style={{ textAlign: 'center', width: '600px' }}>
            <BoxShadow style={{ borderRadius: '16px', padding: '24px' }}>Fusion Successfully Minted</BoxShadow>
          </Heading>
          <div
            style={{ cursor: 'pointer', position: 'absolute', right: 0 }}
            onClick={closeDialog}
            onKeyDown={closeDialog}
            role="button"
            tabIndex={0}
          >
            <img src="/images/close.png" style={{ width: '25px', height: '25px', cursor: 'pointer' }} alt="close" />
          </div>
        </div>

        <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap', justifyContent: 'center' }}>
          <CandidateWrapper style={{ backgroundImage: `url('${fusionedNft.imgUrl}')` }}>
            <span>{fusionedNft.tokenName}</span>
            <HoverWrapper>
              <TypeTag variant="success" outline>
                {fusionedNft.position}
              </TypeTag>
              <MultiplierTag variant="secondary">{`Gen ${fusionedNft.gen}`}</MultiplierTag>
            </HoverWrapper>
          </CandidateWrapper>
        </div>
      </Modal>
    </FusionControlContainer>
  )
}

export default FusionContainer
