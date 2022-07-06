import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { StakeContext } from 'contexts/StakeContext'
import NewItem from './ItemComponents/NewItem'
import StakeItem from './ItemComponents/StakeItem'
// import { StakeItem, NewItem } from './ItemComponents'

const StakeItemContainer = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
`

const StakeItemEach = styled.div`
  width: 25%;
  @media (max-width: 500px) {
    width: 100%;
  }
`
const StakeItems = () => {
  const { trainingSelectedNfts, initTrainingSelectedNfts } = useContext(StakeContext)
  useEffect(() => {
    console.log('Call Stake Candidate')
  }, [trainingSelectedNfts])
  return (
    <StakeItemContainer>
      {trainingSelectedNfts.map((itm) => (
        <StakeItemEach>
          <StakeItem key={itm.tokenId} data={itm} />
        </StakeItemEach>
      ))}
      <StakeItemEach>
        <NewItem />
      </StakeItemEach>
    </StakeItemContainer>
  )
}

export default StakeItems
