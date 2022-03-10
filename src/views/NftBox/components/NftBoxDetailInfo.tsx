import React from 'react'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'

const BoxInfo = styled.div`
  border-radius: 16px;
  box-shadow: 0 6px 12px 0 rgb(0 0 0 / 6%), 0 -1px 2px 0 rgb(0 0 0 / 2%);
  padding: 16px;
  margin-top: 50px;
`
const BoxInfoContainer = styled.div`
  overflow: auto;
`
const BoxInfoRulesContainer = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #431216;
  display: flex;
  justify-content: space-between;
`
const BoxInfoMainContainer = styled.div`
  font-size: 13px;
  color: #694f4e;
  margin-top: 20px;
`

const BlindBoxDetailInfo = () => {
  const { isDark } = useTheme()

  return (
    <BoxInfo
      style={{
        background: isDark ? '#16151a' : '',
        boxShadow: isDark ? '0 6px 12px 0 rgb(255 255 255 / 6%), 0 -1px 2px 0 rgb(255 255 255 / 2%)' : '',
      }}
    >
      <BoxInfoContainer>
        <BoxInfoRulesContainer style={{ color: isDark ? 'white' : '' }}>Blind Box Rules</BoxInfoRulesContainer>
        <BoxInfoMainContainer style={{ color: isDark ? 'white' : '' }}>
          <p style={{ lineHeight: 1.2, margin: '7px 0' }}>
            1. You can mint CashCow NFTs only with $GOL, and get a randomly generated NFT after purchase.
          </p>
          <p style={{ lineHeight: 1.2, margin: '7px 0' }}>
            2. HappyCows Collectibles NFT will make the owner a CashCow Community Rare Member, and be traded freely on
            the NFT Market.
          </p>
        </BoxInfoMainContainer>
      </BoxInfoContainer>
    </BoxInfo>
  )
}

export default BlindBoxDetailInfo
