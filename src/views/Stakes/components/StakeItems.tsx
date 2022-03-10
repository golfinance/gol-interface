import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import { StakeContext } from 'contexts/StakeContext'
import { StakeItem, NewItem } from './ItemComponents'

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
const StakeItems = ({ index }) => {
  const { selectedNFTS } = useContext(StakeContext)
  return (
    <StakeItemContainer>
      {selectedNFTS.map((itm) => (
        <StakeItemEach>
          <StakeItem key={itm.tokenId} data={itm} index={index} />
        </StakeItemEach>
      ))}
      <StakeItemEach>
        <NewItem index={index} />
      </StakeItemEach>
    </StakeItemContainer>
  )
}

export default StakeItems
