import React, { useEffect, useState, useContext } from 'react'
import styled from 'styled-components'
import toast from 'react-hot-toast'
import { Button, Heading, Tag } from '@pancakeswap-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import NonFungiblePlayer from 'config/abi/NonFungiblePlayer.json'
import Busd from 'config/abi/Busd.json'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { toWei, AbiItem, toBN } from 'web3-utils'
import { LoadingContext } from 'contexts/LoadingContext'
import { getNonFungiblePlayerAddress, getBusdAddress } from 'utils/addressHelpers'
import { PINATA_BASE_URI } from 'config/constants/nfts'
import Modal from 'react-modal'
import Web3 from 'web3'
import useTheme from 'hooks/useTheme'

const BoxTitle = styled.div`
  font-size: 28px;
  font-weight: 600;
  color: #431216;
  word-break: break-word;
`

const BoxShadow = styled.div`
  background: #27262c;
  box-shadow: 0px 2px 12px -8px rgba(203, 203, 203, 0.7), 0px 1px 1px rgba(203, 203, 203, 0.05);
  position: relative;
  width: 100%;
`

const RemainingAmount = styled.div`
  font-size: 16px;
  color: #694f4e;
  margin-top: 24px;
  word-break: break-word;
`

const BoxPrice = styled.div`
  margin-top: 32px;
  border-radius: 16px;
  box-shadow: 0 6px 12px 0 rgb(0 0 0 / 6%), 0 -1px 2px 0 rgb(0 0 0 / 2%);
  display: flex;
`

const BoxPriceContainer = styled.div`
  padding: 16px;
  flex: 1;
`

const PriceDetailContainer = styled.div`
  font-size: 28px;
  color: #431216;
  font-weight: 700;
  margin-top: 6px;
  display: flex;
  align-items: center;
`

const BuyNowBtnContainer = styled.div`
  margin-top: 40px;
`

const HoverWrapper = styled.div`
  position: absolute;
  top: 12px;
  right: 8px;
`

const MultiplierTag = styled(Tag)`
  margin-left: 4px;
`

const TypeTag = styled(Tag)`
  backdrop-filter: blur(10px);
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

const BoxBuyDetailComponent = () => {
  const { setLoading } = useContext(LoadingContext)
  const { isDark } = useTheme()
  const { account } = useWeb3React()
  const [mintingState, setMintingState] = useState(true)
  const [mintedAmount, setMintedAmount] = useState(0)
  const [isOpen, setModalOpen] = useState(false)
  const [price, setPrice] = useState('0')
  const [golPrice, setGolPrice] = useState(0)
  const [mintedNft, setMintedNft] = useState({
    tokenId: 0,
    tokenName: '',
    imgUrl: '',
    skillPoint: 0,
    level: 0,
    gen: 0,
    position: '',
    class: '',
  })
  const cakePriceUsd = usePriceCakeBusd()

  /** Styles Div */

  /** Calling Smart Contract Function */

  useEffect(() => {
    const getTotalSupply = async () => {
      const web3 = new Web3(Web3.givenProvider)
      const nfpContract = new web3.eth.Contract(NonFungiblePlayer.abi as AbiItem[], getNonFungiblePlayerAddress())
      const amount = await nfpContract.methods.totalSupply().call()
      const tmpPrice = await nfpContract.methods.price().call()
      setPrice(tmpPrice)
      setMintedAmount(parseInt(amount))

      if (amount === 0) {
        setMintingState(false)
      }

      const currentBlockNumber = await web3.eth.getBlockNumber()
      const blockNumber = await nfpContract.methods.blockNumber().call()

      // if (currentBlockNumber < blockNumber) {
      //     setMintingState(false);
      // }
    }
    setGolPrice(cakePriceUsd.toNumber())
    getTotalSupply()
  }, [account, cakePriceUsd])

  const buyButtonHandler = async () => {
    setMintingState(false)
    // setLoading(true)
    const priceWei = toWei(toBN('10000000000000000000000000000000000000000'), 'ether')
    const web3 = new Web3(Web3.givenProvider)
    const nfpContract = new web3.eth.Contract(NonFungiblePlayer.abi as AbiItem[], getNonFungiblePlayerAddress())
    const busdContract = new web3.eth.Contract(Busd.abi as AbiItem[], getBusdAddress())
    const allowance = await busdContract.methods.allowance(account, getNonFungiblePlayerAddress()).call()
    if (parseInt(allowance.toString()) < parseInt(price))
      await busdContract.methods.approve(getNonFungiblePlayerAddress(), priceWei).send({ from: account })

    let tokenUri = ''
    let tmpSkillPoint = 0
    let tmpLevel = 0
    let tmpGen = 0
    let tmpClass = ''
    let tmpPosition = ''

    let mintedTokenId = 0
    try {
      await nfpContract.methods
        .buyNFPBox()
        .send({ from: account })
        .on('transactionHash', function () {
          toast.success('Transaction submitted')
        })
        .on('receipt', function (receipt) {
          setMintedAmount((prev) => prev + 1)
          toast.success('Mint succeed')
          mintedTokenId = parseInt(receipt.events.BuyBlindBox.returnValues.itemId)
          console.log(receipt)
        })
    } catch (err: unknown) {
      const { message } = err as Error
      toast.error(message)
    }

    if (mintedTokenId !== 0) {
      console.log('TMp Fusioned Token Id', mintedTokenId)

      tokenUri = await nfpContract.methods.tokenURI(mintedTokenId).call()
      tmpSkillPoint = await nfpContract.methods.getSkillPoint(mintedTokenId).call()
      tmpLevel = await nfpContract.methods.getLevel(mintedTokenId).call()
      tmpGen = await nfpContract.methods.getGeneration(mintedTokenId).call()
      tmpClass = await nfpContract.methods.getClass(mintedTokenId).call()
      tmpPosition = await nfpContract.methods.getPosition(mintedTokenId).call()
      const res = await fetch(tokenUri)
      const json = await res.json()
      let tmpImageUrl = json.image
      tmpImageUrl = tmpImageUrl.slice(7)
      tmpImageUrl = `${PINATA_BASE_URI}${tmpImageUrl}`

      console.log(mintedTokenId, json.name, tmpImageUrl)

      setMintedNft({
        tokenId: mintedTokenId,
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

    // setLoading(false)
    setMintingState(true)
  }

  const closeDialog = () => {
    setModalOpen(false)
  }

  return (
    <div>
      <BoxTitle style={{ color: isDark ? 'white' : '' }}>NonFungiblePlayer Box</BoxTitle>
      <RemainingAmount style={{ color: isDark ? 'white' : '' }}>
        Remaining Amount:{' '}
        <span style={{ fontSize: '18px', color: isDark ? 'white' : '#431216', fontWeight: 700 }}>
          {1000 - mintedAmount}
        </span>
      </RemainingAmount>
      <BoxPrice
        style={{
          background: isDark ? '#16151a' : '',
          boxShadow: isDark ? '0 6px 12px 0 rgb(255 255 255 / 6%), 0 -1px 2px 0 rgb(255 255 255 / 2%)' : '',
        }}
      >
        <BoxPriceContainer style={{ color: isDark ? 'white' : '' }}>
          Price
          <PriceDetailContainer style={{ color: isDark ? 'white' : '' }}>
            <img
              src="/images/binance-usd-busd-logo.png"
              alt="GolToken"
              style={{ width: '24px', height: '24px', marginRight: '8px' }}
            />
            {price}
            <span
              style={{ fontSize: '14px', color: isDark ? 'white' : '#694f4e', fontWeight: 400, marginLeft: '4px' }}
            >{` ≈ $${Math.round(golPrice * parseInt(price) * 100) / 100}`}</span>
          </PriceDetailContainer>
        </BoxPriceContainer>
      </BoxPrice>
      <BuyNowBtnContainer>
        {account && mintingState === true ? (
          <div>
            <Button onClick={buyButtonHandler} style={{ width: 'calc(100% - 10px)', marginRight: '10px' }}>
              Mint
            </Button>
          </div>
        ) : (
          <Button style={{ width: '100%' }} disabled>
            Mint
          </Button>
        )}
      </BuyNowBtnContainer>

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
            maxHeight: '85vh',
            borderRadius: '15px',
            background: '#27262c',
            zindex: 15,
          },
        }}
        contentLabel="Example Modal"
      >
        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <Heading as="h1" size="lg" color="primary" mb="25px" style={{ textAlign: 'center', width: '600px' }}>
            <BoxShadow style={{ borderRadius: '16px', padding: '24px' }}>New NonFungiblePlayer Minted</BoxShadow>
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
          <CandidateWrapper style={{ backgroundImage: `url('${mintedNft.imgUrl}')` }}>
            <span>{mintedNft.tokenName}</span>
            <HoverWrapper>
              <TypeTag variant="success" outline>
                {mintedNft.position}
              </TypeTag>
              <MultiplierTag variant="secondary">{`Gen ${mintedNft.gen}`}</MultiplierTag>
            </HoverWrapper>
          </CandidateWrapper>
        </div>
      </Modal>
    </div>
  )
}

export default BoxBuyDetailComponent
