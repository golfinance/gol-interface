import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import NonFungiblePlayer from 'config/abi/NonFungiblePlayer.json'
import { getNonFungiblePlayerAddress } from 'utils/addressHelpers'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import StartTime from './StartTime'

const MainContainer = styled.div`
  right: 60px;
  left: 60px;
  top: 40px;
  bottom: 40px;
  color: white;
  position: absolute;
  display: flex;
  flex-direction: column;
`
const PhaseContainer = styled.div`
  background: rgba(0, 0, 0, 0.12);
  height: 30px;
  font-size: 18px;
  width: fit-content;
  border-radius: 10px;
  padding: 0 12px;
  align-items: center;
  justify-content: center;
  display: flex;
`
const TitleContainer = styled.div`
  font-size: 32px;
  font-weight: 700;
  margin-top: 12px;
  line-height: 1.25;
  display: flex;
  align-items: center;
`

export interface ItemMainContainerInterface {
  itemId?: number
  itemTitle?: string
}

const ItemMainContainer = ({ itemId, itemTitle }: ItemMainContainerInterface) => {
  const [mintedAmount, setMintedAmount] = useState(0)
  const [startBlock, setStartBlock] = useState(0)
  const [currentBlock, setCurrentBlock] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const { account } = useWeb3React()

  useEffect(() => {
    const getTotalSupply = async () => {
      const web3 = new Web3(Web3.givenProvider)
      const nfpContract = new web3.eth.Contract(NonFungiblePlayer.abi as AbiItem[], getNonFungiblePlayerAddress())
      const amount = await nfpContract.methods.totalSupply().call()

      setMintedAmount(parseInt(amount))

      const currentBlockNumber = await web3.eth.getBlockNumber()
      setCurrentBlock(currentBlockNumber)

      const blockNumber = await nfpContract.methods.blockNumber().call()
      setStartBlock(blockNumber)

      if (blockNumber > currentBlockNumber) {
        const current = new Date()
        const temp = new Date(current.getTime() + (blockNumber - currentBlockNumber) * 3 * 1000)
        const timespan = temp.getTime()

        setStartTime(timespan)
      }
    }

    getTotalSupply()
  }, [account])

  return (
    <MainContainer>
      {/* {currentBlock !== 0 && startBlock !== 0 && currentBlock < startBlock && <StartTime countdown={startTime} />}
      <div
        style={{
          paddingTop: '10px',
          fontSize: '20px',
          marginTop: 'auto',
          fontWeight: 700,
          color: 1000 - mintedAmount === 0 ? 'red' : 'lightgreen',
        }}
      >
        {currentBlock < startBlock && 'Not started'}
        {currentBlock > startBlock && (mintedAmount === 1000 ? 'Mint is finished' : 'Live now')}
      </div> */}
    </MainContainer>
  )
}

export default ItemMainContainer
