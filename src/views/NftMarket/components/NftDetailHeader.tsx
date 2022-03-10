import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import useTheme from 'hooks/useTheme'

const NftDetailHeaderContainer = styled.div`
  font-size: 15px;
  color: #694f4e;
`
const NftDetailPrevious = styled.div`
  display: inline;
`
export interface NftDetailHeaderInterface {
  collectionName?: string
}

const NftDetailHeader = ({ collectionName }: NftDetailHeaderInterface) => {
  const { isDark } = useTheme()

  return (
    <NftDetailHeaderContainer>
      <NftDetailPrevious>
        <Link to="/nft-marketplace" style={{ color: isDark ? 'white' : '#f4ae01' }}>
          NFT Market
        </Link>
        <span style={{ padding: '0 8px', color: isDark ? 'white' : '#f4ae01' }}>{'>'}</span>
      </NftDetailPrevious>
      <NftDetailPrevious>
        <span style={{ fontSize: '15px', color: isDark ? 'white' : '#f4ae01' }}>{collectionName}</span>
      </NftDetailPrevious>
    </NftDetailHeaderContainer>
  )
}

export default NftDetailHeader
