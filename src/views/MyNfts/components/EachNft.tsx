import React, { useState, useEffect, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import Web3 from 'web3'
import Market from 'config/abi/Market.json'
import { fromWei, AbiItem } from 'web3-utils'
import { useWeb3React } from '@web3-react/core'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { getMarketAddress } from 'utils/addressHelpers'
import useTheme from 'hooks/useTheme'
import { PINATA_BASE_URI } from 'config/constants/nfts'
import { getNumberSuffix } from 'utils/formatBalance'

const NftEachItemContainer = styled.div`
  cursor: pointer;
  flex: 1;
  margin-right: 15px;
  margin-bottom: 15px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 3%), 0 4px 6px -2px rgb(0 0 0 / 1%);
  position: relative;
`
const ItemTop = styled.div`
  paddingtop: 2px;
`

const NftImageContainer = styled.div`
  position: relative;
  padding-bottom: 100%;
  height: 0;
  border-top-right-radius: 16px;
  border-top-left-radius: 16px;
  overflow: hidden;
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
  top: 0;
  &:hover {
    transform: scale(1.04);
  }
`
const Title = styled.div`
  height: 68px;
  padding: 0 24px;
  display: flex;
  align-items: center;
`

const TitleText = styled.div`
  width: 100%;
  font-size: 18px;
  line-height: 1.2;
  color: #431216;
  word-break: break-word;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  line-clamp: 2;
  display: flex;
  justify-content: space-between;
`

const ItemSeperation = styled.div`
  height: 1px;
  min-width: unset;
  background-image: url(../images/line.jpg);
  background-repeat: repeat-x;
  position: relative;
  background-size: contain;
  background-position: 50%;
`

const ItemBottom = styled.div`
  padding: 12px 24px 20px;
  margin: 0;
`

const ItemTitle = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #694f4e;
`

const ItemValue = styled.div`
  align-items: center;
  color: #431216;
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
`

const ItemValueText = styled.div`
  font-size: 22px;
  font-weight: 700;
`

const ItemValueToken = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
`

const web3 = new Web3(Web3.givenProvider)

export interface EachNftInterface {
  eachMyToken?: any
}

const EachNft = ({ eachMyToken }: EachNftInterface) => {
  const { account } = useWeb3React()
  const { isDark } = useTheme()

  const [imageIpfsHash, setImageIpfsHash] = useState('')
  const [name, setName] = useState('')
  const [flgList, setFlgList] = useState(false)
  const [listedPrice, setListedPrice] = useState('')
  // const [itemId, setItemId] = useState(0);
  const [golPrice, setGolPrice] = useState(0)
  const cakePriceUsd = usePriceCakeBusd()

  const marketContract = useMemo(() => {
    return new web3.eth.Contract(Market.abi as AbiItem[], getMarketAddress())
  }, [])

  const fetchMyNftImage = useCallback(async () => {
    try {
      const res = await fetch(eachMyToken.tokenHash)
      const json = await res.json()
      let imageUrl = json.image
      // if (!eachMyToken.isAIR) {
      //   imageUrl = imageUrl.slice(7)
      //   setImageIpfsHash(`${PINATA_BASE_URI}${imageUrl}`)
      // } else setImageIpfsHash(imageUrl)
      imageUrl = imageUrl.slice(7)
      setImageIpfsHash(`${PINATA_BASE_URI}${imageUrl}`)
      setName(json.name)
    } catch (e) {
      // console.log(e);
    }
  }, [eachMyToken])

  const fetchItemsCreated = useCallback(async () => {
    const res = await marketContract.methods.fetchItemsCreated().call({ from: account })
    for (let i = 0; i < res.length; i++) {
      if (eachMyToken.tokenId === res[i].tokenId && res[i].isSold === false) {
        setFlgList(true)
        setListedPrice(fromWei(res[i].price, 'ether'))
        break
      }
    }

    setGolPrice(cakePriceUsd.toNumber())
  }, [account, marketContract, eachMyToken, cakePriceUsd])

  useEffect(() => {
    fetchMyNftImage()
    fetchItemsCreated()
  }, [fetchMyNftImage, fetchItemsCreated])

  return (
    <div>
      <NftEachItemContainer style={{ background: isDark ? '#27262c' : '' }}>
        <ItemTop>
          <NftImageContainer>
            <NftImage style={{ backgroundImage: `url(${imageIpfsHash})` }} />
          </NftImageContainer>
          <Title>
            <TitleText style={{ color: isDark ? 'white' : '' }}>
              <div>{name}</div>
            </TitleText>
          </Title>
        </ItemTop>
        <ItemSeperation />
        {flgList ? (
          <ItemBottom>
            <ItemTitle style={{ color: isDark ? 'white' : '' }}>
              Sale Price
              <span> ≈ ${getNumberSuffix(Math.round(golPrice * parseInt(listedPrice) * 100) / 100)}</span>
            </ItemTitle>
            <ItemValue style={{ color: isDark ? 'white' : '' }}>
              <ItemValueText>{getNumberSuffix(listedPrice)}</ItemValueText>
              <ItemValueToken>
                <img
                  src="/images/favicon-32x32.png"
                  alt="GolToken"
                  style={{ width: '18px', height: '18px', marginRight: '4px' }}
                />
                GOL
              </ItemValueToken>
            </ItemValue>
          </ItemBottom>
        ) : (
          <ItemBottom>
            <div style={{ height: 50, color: isDark ? 'white' : '' }}>Not Listed</div>
          </ItemBottom>
        )}
      </NftEachItemContainer>
    </div>
  )
}

export default EachNft
