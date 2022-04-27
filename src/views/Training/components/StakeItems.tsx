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
const StakeItems = () => {
  const { selectedNFTS } = useContext(StakeContext)
  return (
    <StakeItemContainer>
      {selectedNFTS.map((itm) => (
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
