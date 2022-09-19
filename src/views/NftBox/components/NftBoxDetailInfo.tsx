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
            1. You can mint Generation 0 Non-Fungible Players with BUSD and receive a unique randomly generated NFT.
          </p>
          <p style={{ lineHeight: 1.2, margin: '7px 0' }}>
            2. Each Player NFT can be utilized within the GOL ecosystem and can be openly traded on the NFT marketplace.
          </p>
          <p style={{ lineHeight: 1.2, margin: '7px 0' }}>
            2. Collect, Train and Level up players to build the Ultimate team!
          </p>
        </BoxInfoMainContainer>
      </BoxInfoContainer>
    </BoxInfo>
  )
}

export default BlindBoxDetailInfo
