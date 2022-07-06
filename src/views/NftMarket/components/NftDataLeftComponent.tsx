import React, { useState, useMemo, useCallback, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import toast from 'react-hot-toast'
import { Button } from '@pancakeswap-libs/uikit'
import Genesis from 'config/abi/Genesis.json'
import Market from 'config/abi/Market.json'
import NonFungiblePlayer from 'config/abi/NonFungiblePlayer.json'
import GolToken from 'config/abi/GolToken.json'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { useWeb3React } from '@web3-react/core'
import { fromWei, AbiItem, toBN, toWei } from 'web3-utils'
import Web3 from 'web3'
import {
  getNonFungiblePlayerAddress,
  getGolTokenAddress,
  getMarketAddress,
  getAirNftAddress,
} from 'utils/addressHelpers'
import useTheme from 'hooks/useTheme'
import { LoadingContext } from 'contexts/LoadingContext'
import { PINATA_BASE_URI } from 'config/constants/nfts'
import { getNumberSuffix } from 'utils/formatBalance'

const NftMetaDataContainer = styled.div`
  display: flex;
  padding: 16px 32px;
  flex: 1;
  flex-wrap: wrap;
  align-items: inherit;

  @media (max-width: 768px) {
    justify-content: center;
  }
`
const NftImageContainer = styled.div`
  max-width: 332px;
  max-height: 100%;
  min-width: 240px;
  min-height: 240px;
  width: 46%;
  border-radius: 16px 16px 0 0;
  overflow: hidden;
  margin: 16px 32px 16px 0;
  position: relative;

  @media (max-width: 768px) {
    width: 100%;
  }
`

const NftImage = styled.div`
  width: 100%;
  padding-bottom: 100%;
  height: 0;
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: auto 100%;
`

const NftInfo = styled.div`
  flex: 1;
  min-width: 220px;
  margin: 16px 0;
  display: flex;
  flex-direction: column;
`

const NftTitleContainer = styled.div`
  font-size: 28px;
  font-weight: 600;
  color: #431216;
  word-break: break-word;
`

const NftSalePriceContainer = styled.div`
  margin-top: 20px;
  box-shadow: 0 6px 12px 0 rgb(0 0 0 / 6%), 0 -1px 2px 0 rgb(0 0 0 / 2%);
  border-radius: 16px;
  display: flex;
`

const NftSalePrice = styled.div`
  padding: 16px;
  flex: 1;
`
const NftSalePriceTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #694f4e;
`

const TokenSelectContainer = styled.div`
  display: flex;
  align-items: center;
`
const NftSalePriceDetail = styled.div`
  font-size: 28px;
  color: #431216;
  font-weight: 700;
  margin-top: 6px;
  display: flex;
  align-items: center;
`
const BuyNowBtnContainer = styled.div`
  margin-top: 24px;
`
const web3 = new Web3(Web3.givenProvider)

export interface NftDataLeftComponentInterface {
  itemId?: string
}

const NftDataLeftComponent = ({ itemId }: NftDataLeftComponentInterface) => {
  const { isDark } = useTheme()
  const history = useHistory()
  const { account } = useWeb3React()
  const selectedToken = 'Gol'
  const [isAIR, setIsAIR] = useState(false)
  const [image, setImage] = useState('')
  const [name, setName] = useState('')
  const [salePrice, setSalePrice] = useState('')
  const [golPrice, setGolPrice] = useState(0)
  const [description, setDescription] = useState('')
  const [flgButtonState, setFlgButtonState] = useState(true)
  const [flgMyNft, setFlgMyNft] = useState(false)
  const [nftInfo, setNftInfo] = useState({ lvl: '', gen: '', class: '', rarity: '', position: '' })
  const { setLoading } = useContext(LoadingContext)
  const cakePriceUsd = usePriceCakeBusd()

  const nfpContract = useMemo(() => {
    return new web3.eth.Contract(NonFungiblePlayer.abi as AbiItem[], getNonFungiblePlayerAddress())
  }, [])

  const marketContract = useMemo(() => {
    return new web3.eth.Contract(Market.abi as AbiItem[], getMarketAddress())
  }, [])

  const airnftContract = useMemo(() => {
    return new web3.eth.Contract(Genesis.abi as AbiItem[], getAirNftAddress())
  }, [])
  const golTokenContract = new web3.eth.Contract(GolToken.abi as AbiItem[], getGolTokenAddress())

  const fetchNft = useCallback(async () => {
    const marketItems = await marketContract.methods.fetchMarketItems().call({ from: account })
    let isAirToken = false
    let tokenId = null
    for (let i = 0; i < marketItems.length; i++) {
      if (marketItems[i].itemId === itemId) {
        isAirToken = marketItems[i].nftContract === getAirNftAddress()
        tokenId = marketItems[i].tokenId
        setSalePrice(fromWei(marketItems[i].price, 'ether'))
        if (marketItems[i].seller === account) {
          setFlgMyNft(true)
        }
        break
      }
    }

    if (!tokenId) return

    let nftHash = null
    if (isAirToken) nftHash = await airnftContract.methods.tokenURI(toBN(tokenId)).call({ from: account })
    else {
      nftHash = await nfpContract.methods.tokenURI(toBN(tokenId)).call({ from: account })
      const tmpLvl = await nfpContract.methods.getLevel(toBN(tokenId)).call()
      const tmpGen = await nfpContract.methods.getGeneration(toBN(tokenId)).call()
      const tmpClass = await nfpContract.methods.getClass(toBN(tokenId)).call()
      const tmpRarity = await nfpContract.methods.getRarity(toBN(tokenId)).call()
      const tmpPosition = await nfpContract.methods.getPosition(toBN(tokenId)).call()

      setNftInfo({ lvl: tmpLvl, gen: tmpGen, class: tmpClass, rarity: tmpRarity, position: tmpPosition })
    }
    const res = await fetch(nftHash)
    const json = await res.json()

    let imageUrl = json.image
    // if (isAirToken) {
    //   setImage(imageUrl)
    // } else {
    //   imageUrl = imageUrl.slice(7)
    //   setImage(`${PINATA_BASE_URI}${imageUrl}`)
    // }
    imageUrl = imageUrl.slice(7)
    setImage(`${PINATA_BASE_URI}${imageUrl}`)
    setIsAIR(isAirToken)
    setName(json.name)
    setDescription(json.description)

    setGolPrice(cakePriceUsd.toNumber())
  }, [account, marketContract, itemId, nfpContract, airnftContract, cakePriceUsd])
  useEffect(() => {
    fetchNft()
  }, [fetchNft])

  const buyNft = async () => {
    setFlgButtonState(false)
    setLoading(true)

    try {
      const priceWei = toWei(toBN('10000000000000000000000000000000000000000'), 'ether')
      const allowance = await golTokenContract.methods.allowance(account, getMarketAddress()).call()

      if (parseInt(allowance.toString()) < parseInt(salePrice)) {
        await golTokenContract.methods.approve(getMarketAddress(), priceWei).send({ from: account })
        toast.success('Approved Gol token.')
      }
      if (isAIR) await marketContract.methods.createMarketSale(getAirNftAddress(), itemId).send({ from: account })
      else await marketContract.methods.createMarketSale(getNonFungiblePlayerAddress(), itemId).send({ from: account })
      history.push('/nft-marketplace')
      toast.success('Successfully bought NFT.')
    } catch (error) {
      const { message } = error as Error
      toast.error(message)
    }

    setFlgButtonState(true)
    setLoading(false)
  }
  return (
    <NftMetaDataContainer>
      <NftImageContainer>
        <NftImage style={{ backgroundImage: `url(${image})` }} />
        <div
          style={{
            paddingTop: '10px',
            fontSize: '17px',
            color: isDark ? 'white' : 'rgb(105, 79, 78)',
            width: 'fit-content',
            margin: 'auto',
          }}
        >
          {description}
        </div>
        {!isAIR ? (
          <div
            style={{
              textAlign: 'center',
              paddingTop: '10px',
              fontSize: '17px',
              color: isDark ? 'white' : 'rgb(105, 79, 78)',
            }}
          >
            <div style={{ paddingTop: '5px' }}>{`Level : ${nftInfo.lvl}`}</div>
            <div style={{ paddingTop: '5px' }}>{`Generation : ${nftInfo.gen}`}</div>
            <div style={{ paddingTop: '5px' }}>{`Class : ${nftInfo.class}`}</div>
            <div style={{ paddingTop: '5px' }}>{`Rarity : ${nftInfo.rarity}`}</div>
            <div style={{ paddingTop: '5px' }}>{`Position : ${nftInfo.position}`}</div>
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              paddingTop: '10px',
              fontSize: '17px',
              color: isDark ? 'white' : 'rgb(105, 79, 78)',
            }}
          >
            Genesis Token
          </div>
        )}
      </NftImageContainer>
      <NftInfo>
        <NftTitleContainer style={{ color: isDark ? 'white' : '' }}>{name}</NftTitleContainer>
        <NftSalePriceContainer
          style={{
            background: isDark ? '#16151a' : '',
            boxShadow: isDark ? '0 6px 12px 0 rgb(255 255 255 / 6%), 0 -1px 2px 0 rgb(255 255 255 / 2%)' : '',
          }}
        >
          <NftSalePrice>
            <NftSalePriceTitleContainer style={{ color: isDark ? 'white' : '' }}>
              Sale Price
              <TokenSelectContainer>
                <div
                  style={{
                    color: `${selectedToken === 'Gol' ? '#00d86c' : '#694f4e'}`,
                    fontWeight: selectedToken === 'Gol' ? 700 : 400,
                  }}
                >
                  <div
                    style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: isDark ? 'white' : '' }}
                  >
                    <img
                      style={{ width: '16px', height: '16px', marginRight: '5px', transform: 'translateY(-.5px)' }}
                      src="/images/favicon-32x32.png"
                      alt="GolToken"
                    />
                    Gol
                  </div>
                </div>
              </TokenSelectContainer>
            </NftSalePriceTitleContainer>
            <NftSalePriceDetail style={{ color: isDark ? 'white' : '' }}>
              <img
                style={{ width: '24px', height: '24px', marginRight: '8px' }}
                src="/images/favicon-32x32.png"
                alt="GolToken"
              />
              {getNumberSuffix(salePrice)}
              <span
                style={{ fontSize: '14px', color: isDark ? 'white' : '#694f4e', fontWeight: 400, marginLeft: '4px' }}
              >
                ≈ ${getNumberSuffix(Math.round(golPrice * parseInt(salePrice) * 100) / 100)}
              </span>
            </NftSalePriceDetail>
          </NftSalePrice>
        </NftSalePriceContainer>
        <div style={{ flex: 1 }} />
        <BuyNowBtnContainer>
          <div>
            {account && flgButtonState && !flgMyNft ? (
              <Button style={{ width: '100%' }} onClick={buyNft}>
                Buy NFT
              </Button>
            ) : (
              <Button style={{ width: '100%' }} disabled>
                {flgMyNft ? 'Your Listing NFT' : 'Buy NFT'}
              </Button>
            )}
          </div>
        </BuyNowBtnContainer>
      </NftInfo>
    </NftMetaDataContainer>
  )
}

export default NftDataLeftComponent
