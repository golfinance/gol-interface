import React from 'react'
import styled from 'styled-components'
import { Button } from '@pancakeswap-libs/uikit'
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

const FusionContainer = () => {
  return (
    <FusionControlContainer>
      <StakeItemEach>
        <NewItem index={1} />
      </StakeItemEach>
      <Button style={{ width: '25%' }}>Fusion</Button>
      <StakeItemEach>
        <NewItem index={2} />
      </StakeItemEach>
    </FusionControlContainer>
  )
}

export default FusionContainer
