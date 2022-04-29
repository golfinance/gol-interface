import React from 'react'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import MyNftDataLeftComponent from './MyNftDataLeftComponent'
import MyNftDataRightComponent from './MyNftDataRightComponent'

const NftDataContainer = styled.div`
    position: relative;
    display: flex;
    background: #fff;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 3%), 0 4px 6px -2px rgb(0 0 0 / 1%);
    border-radius: 32px;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`

const NftDataSeperation = styled.div`
    min-width: 2px;
    position: relative;
    background-image: url(../images/line.jpg);
    background-repeat: repeat-y;
    background-size: contain;
    background-position: 50%;
`
const GradientBack = styled.div`
    background: linear-gradient( 45deg, rgba(255,0,0,1) 0%, rgba(255,154,0,1) 10%, rgba(208,222,33,1) 20%, rgba(79,220,74,1) 30%, rgba(63,218,216,1) 40%, rgba(47,201,226,1) 50%, rgba(28,127,238,1) 60%, rgba(95,21,242,1) 70%, rgba(186,12,248,1) 80%, rgba(251,7,217,1) 90%, rgba(255,0,0,1) 100% );
    background-size: 300% 300%;
    animation: ilqnTz 2s linear infinite;
    filter: blur(10px);
    position: absolute;
    top:-2px;
    right:-2px;
    bottom:-2px;
    left:-2px;
    z-index: -1;
`

export interface NftDataInterface {
    myToken?: any;
  }

const MyNftData = ({myToken}: NftDataInterface) => {
    const { isDark } = useTheme()
    return (
        <NftDataContainer style={{background: isDark ? "#27262c" : ''}}>
            <GradientBack />
            <MyNftDataLeftComponent myToken={myToken}/>
            <NftDataSeperation />
            <MyNftDataRightComponent myToken={myToken} />
        </NftDataContainer>
    )
}

export default MyNftData
