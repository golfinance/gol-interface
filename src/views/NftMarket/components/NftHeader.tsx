/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { setSortOrder, setCollectionType } from 'state/markets'
import Select from '../../../components/Select/Select'

const NftHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`
const LeftContainer = styled.div`
  flex: left;
  align-items: center;
`

const RightContainer = styled.div`
  display: flex;
  flex: right;
  align-items: center;

  @media (max-width: 768px) {
    margin-top: 10px;
    flex-wrap: wrap;

    > div {
      width: 40%;
      margin-top: 10px;
    }
  }
`

const SearchBox = styled.div`
  display: flex;
  position: relative;
`

const InputTag = styled.input`
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  height: 44px;
  line-height: 44px;
  box-sizing: border-box;
  font-size: 16px;
  padding: 0 68px 0 16px;
  display: flex;
  outline: none;
  width: 230px;
  color: #431216;
  background: transparent;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

const LinkTag = styled.a`
  position: absolute;
  right: 4px;
  top: 4px;
  bottom: 4px;
  height: auto;
  padding: 0 20px;
  transform: translateY(0) !important;
  border: 0 none;
  background: #00d86c;
  border-radius: 12px;
  display: flex;
  align-items: center;
`

const sortByItems = [
  { label: 'Recently listed', value: { field: 'RecentlyListed', direction: 'desc' } },
  { label: 'Lowest price', value: { field: 'LowestPrice', direction: 'asc' } },
  { label: 'Highest price', value: { field: 'HighestPrice', direction: 'desc' } },
]

const filterByCollection = [
  { label: 'All NFTs', value: { field: 'All', direction: 'asc' } },
  { label: 'HappyCows', value: { field: 'HappyCows', direction: 'desc' } },
  { label: 'Genesis', value: { field: 'AirNFT', direction: 'asc' } },
]

const NftHeader = () => {
  const dispatch = useDispatch()
  const { isDark } = useTheme()

  return (
    <NftHeaderContainer>
      <LeftContainer style={{ color: isDark ? 'white' : '' }}>Nft Marketplace</LeftContainer>
      <RightContainer>
        <Select
          options={sortByItems}
          onOptionChange={(option) => dispatch(setSortOrder(option.value))}
          style={{ marginRight: '15px', background: isDark ? '#27262c' : '' }}
        />
        <Select
          options={filterByCollection}
          onOptionChange={(option) => dispatch(setCollectionType(option.value))}
          style={{ marginRight: '15px' }}
        />
        {/* <SearchBox>
          <InputTag placeholder="Please enter keywords to search" />
          <LinkTag>
            <img alt="search icon" style={{ width: 30, height: 30 }} src="https://img.icons8.com/FFFFFF/search" />
          </LinkTag>
        </SearchBox> */}
      </RightContainer>
    </NftHeaderContainer>
  )
}

export default NftHeader
