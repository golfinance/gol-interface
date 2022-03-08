import React, { useState, useEffect, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import Market from 'config/abi/Market.json'
import { useWeb3React } from '@web3-react/core'
import { AbiItem } from 'web3-utils'
import Web3 from 'web3'
import { useSelector } from 'react-redux'
import { getMarketAddress } from 'utils/addressHelpers'
import addresses from 'config/constants/contracts'
import NftEachItem from './NftEachItem'
import { State } from '../../../state/types'

const NftItemContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 -15px;
`
const chainId = process.env.REACT_APP_CHAIN_ID
const web3 = new Web3(Web3.givenProvider)

const NftItems = () => {
  const { account } = useWeb3React()
  const [marketItems, setMarketItems] = useState([])
  const sortOrder = useSelector((state: State) => state.markets.sortOrder)
  const collectionType = useSelector((state: State) => state.markets.collectionType)

  const marketContract = useMemo(() => {
    return new web3.eth.Contract(Market.abi as AbiItem[], getMarketAddress())
  }, [])

  const fetchNftItems = useCallback(async () => {
    const tmpMarketItems = await marketContract.methods.fetchMarketItems().call({ from: account })
    const filteredTmpMarketItems = []
    for (let i = 0; i < tmpMarketItems.length; i++) {
      // if(tmpMarketItems[i].seller !== account) {
      filteredTmpMarketItems.push(tmpMarketItems[i])
      // }
    }
    let filteredMarketItems = []
    let index = 0
    switch (collectionType.field) {
      case 'All':
        filteredMarketItems = filteredTmpMarketItems
        break
      case 'HappyCows':
        for (let i = 0; i < filteredTmpMarketItems.length; i++) {
          if (filteredTmpMarketItems[i].nftContract === addresses.nonFungiblePlayer[chainId]) {
            filteredMarketItems[index] = filteredTmpMarketItems[i]
            index++
          }
        }
        break
      case 'AirNFT':
        for (let i = 0; i < filteredTmpMarketItems.length; i++) {
          if (filteredTmpMarketItems[i].nftContract === '') {
            filteredMarketItems[index] = filteredTmpMarketItems[i]
            index++
          }
        }
        break
      default:
        break
    }

    switch (sortOrder.field) {
      case 'RecentlyListed':
        for (let i = 0; i < filteredMarketItems.length - 1; i++) {
          for (let j = i + 1; j < filteredMarketItems.length; j++) {
            if (parseInt(filteredMarketItems[i].listedTime) < parseInt(filteredMarketItems[j].listedTime)) {
              const tmp = filteredMarketItems[i]
              filteredMarketItems[i] = filteredMarketItems[j]
              filteredMarketItems[j] = tmp
            }
          }
        }
        break
      case 'LowestPrice':
        for (let i = 0; i < filteredMarketItems.length - 1; i++) {
          for (let j = i + 1; j < filteredMarketItems.length; j++) {
            if (parseInt(filteredMarketItems[i].price) > parseInt(filteredMarketItems[j].price)) {
              const tmp = filteredMarketItems[i]
              filteredMarketItems[i] = filteredMarketItems[j]
              filteredMarketItems[j] = tmp
            }
          }
        }
        break
      case 'HighestPrice':
        for (let i = 0; i < filteredMarketItems.length - 1; i++) {
          for (let j = i + 1; j < filteredMarketItems.length; j++) {
            if (parseInt(filteredMarketItems[i].price) < parseInt(filteredMarketItems[j].price)) {
              const tmp = filteredMarketItems[i]
              filteredMarketItems[i] = filteredMarketItems[j]
              filteredMarketItems[j] = tmp
            }
          }
        }
        break

      default:
        break
    }
    setMarketItems(filteredMarketItems)
  }, [account, marketContract, collectionType, sortOrder])

  useEffect(() => {
    fetchNftItems()
  }, [fetchNftItems])

  return (
    <NftItemContainer>
      {marketItems.map((nftEachItem) => {
        return <NftEachItem nftEachItem={nftEachItem} key={nftEachItem.itemId} />
      })}
    </NftItemContainer>
  )
}

export default NftItems
