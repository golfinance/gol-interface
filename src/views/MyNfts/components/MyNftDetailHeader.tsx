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
    collectionName?: string;
}

const MyNftDetailHeader = ({collectionName} : NftDetailHeaderInterface) => {
    const { isDark } = useTheme()
    return (
        <NftDetailHeaderContainer>
            <NftDetailPrevious>
                <Link to="/myNFTs" style={{color: isDark ? 'white' : '#431216'}}>
                    My NFTs
                </Link>
                <span style={{padding: '0 8px', color: isDark ? 'white' : ''}}>{'>'}</span>
            </NftDetailPrevious>
            <NftDetailPrevious>
                <span style={{fontSize: '15px', color: isDark ? 'white' : '#694f4e'}}>
                    {collectionName}
                </span>
            </NftDetailPrevious>
        </NftDetailHeaderContainer>
    )
}

export default MyNftDetailHeader
