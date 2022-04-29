import React from 'react'
import styled from 'styled-components'
import { Button } from '@pancakeswap-libs/uikit'
import NewItem from './ItemComponents/NewItem'

const FusionControlContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const GapAdjust = styled.div``

const StakeItemEach = styled.div`
  width: 25%;
  @media (max-width: 500px) {
    width: 100%;
  }
`

const FusionContainer = () => {
  return (
    <FusionControlContainer>
      <StakeItemEach>
        <NewItem />
      </StakeItemEach>
      <Button style={{ width: '25%' }}>{`<=  Fusion  =>`}</Button>
      <StakeItemEach>
        <NewItem />
      </StakeItemEach>
    </FusionControlContainer>
  )
}

export default FusionContainer
