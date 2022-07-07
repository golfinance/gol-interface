import React from 'react'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'

const NftMarketRuleContainer = styled.div`
  margin-top: 40px;
`

const NftMarketRuleTitle = styled.div`
  font-weight: 700;
  color: #431216;
  font-size: 20px;
  padding-bottom: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f5f8fb;
`
const NftMarketRuleContent = styled.div`
  font-size: 15px;
  color: #694f4e;
  margin-top: 0;
`

const NftMarketRuleEach = styled.div`
  margin: 12px 0;
`

const NftMarketRule = () => {
  const { isDark } = useTheme()

  return (
    <NftMarketRuleContainer>
      <NftMarketRuleTitle style={{ color: 'white' }}>Market Rules</NftMarketRuleTitle>
      <NftMarketRuleContent style={{ color: 'white' }}>
        <NftMarketRuleEach>1. NFTs can be purchased in the NFT Market only by using $GOL.</NftMarketRuleEach>
        <NftMarketRuleEach>
          2. After NFT is listed in the trading market, operations such as transfer, auction and stake are not allowed.
        </NftMarketRuleEach>
        <NftMarketRuleEach>3. The market will charge 5% of the seller his revenue as a service fee.</NftMarketRuleEach>
      </NftMarketRuleContent>
    </NftMarketRuleContainer>
  )
}

export default NftMarketRule
