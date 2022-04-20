import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { Heading } from '@pancakeswap-libs/uikit'
import useTheme from 'hooks/useTheme'
import breeds from 'config/constants/breed'
import { PINATA_BASE_URI } from 'config/constants/nfts'
import Page from '../../components/Layout/Page'
import BoxContainerComponent from './components/BoxContainerComponent'
import BoxBuyDetailComponent from './components/BoxBuyDetailComponent'
import NftBoxDetailInfo from './components/NftBoxDetailInfo'

const NftBoxDetail = () => {
  const { isDark } = useTheme()
  const [breedsList, setBreedsList] = useState<Array<any>>([])

  const fetchBreeds = useCallback(async () => {
    const promises = breeds.map(async (item) => {
      try {
        const res = await fetch(item)
        const json = await res.json()

        return {
          image: `${PINATA_BASE_URI}${json.image.slice(7)}`,
          breed: json.attributes[1].value,
        }
      } catch (e) {
        console.log(e)
      }

      return {}
    })

    setBreedsList(await Promise.all(promises))
  }, [setBreedsList])

  useEffect(() => {
    fetchBreeds()
  }, [fetchBreeds])

  const StyledHero = styled.div`
    border-bottom: 1px solid #e8e8e8;
    margin-bottom: 20px;
  `

  const StyledWrapper = styled(Page)`
    position: relative;
  `

  const BoxDetailContainer = styled.div`
    background: ${isDark ? '#27262c' : 'white'};
    ${isDark ? 'box-shadow: 0px 2px 12px -8px rgb(25 19 38 / 10%), 0px 1px 1px rgb(25 19 38 / 5%)' : ''};
    position: relative;
    border-radius: 32px;
    padding-bottom: 20px;
    display: flex;

    @media (max-width: 768px) {
      flex-wrap: wrap;
      justify-content: center;
    }
  `

  const BoxContainerLeft = styled.div`
    width: calc(50% - 12px);
    display: flex;
    flex-wrap: wrap;
    margin: 12px;

    @media (max-width: 768px) {
      width: 100%;
    }
  `
  const BoxContainerRight = styled.div`
    width: 50%;
    height: 100%;
    margin: 24px;

    @media (max-width: 768px) {
      width: 100%;
    }
  `
  const ItemContainer = styled.div`
    display: flex;
    width: 100%;

    @media (max-width: 768px) {
      flex-wrap: wrap;
    }
  `
  const GradientBack = styled.div`
    background: linear-gradient(
      45deg,
      rgba(255, 0, 0, 1) 0%,
      rgba(255, 154, 0, 1) 10%,
      rgba(208, 222, 33, 1) 20%,
      rgba(79, 220, 74, 1) 30%,
      rgba(63, 218, 216, 1) 40%,
      rgba(47, 201, 226, 1) 50%,
      rgba(28, 127, 238, 1) 60%,
      rgba(95, 21, 242, 1) 70%,
      rgba(186, 12, 248, 1) 80%,
      rgba(251, 7, 217, 1) 90%,
      rgba(255, 0, 0, 1) 100%
    );
    background-size: 300% 300%;
    animation: ilqnTz 2s linear infinite;
    filter: blur(10px);
    position: absolute;
    top: -2px;
    right: -2px;
    bottom: -2px;
    left: -2px;
    z-index: -1;
  `

  const ItemEachContainer = styled.div`
    margin: 10px;
    background: #fff;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 3%), 0 4px 6px -2px rgb(0 0 0 / 1%);
    border-radius: 24px;
    padding: 16px;
    width: calc(20% - 20px);
    box-sizing: border-box;
    display: flex;
    transition: transform 0.3s ease, -webkit-transform 0.3s ease;
    padding-top: calc(20% - 50px);
    position: relative;
    background-size: cover;
    color: white;

    @media (max-width: 768px) {
      width: calc(50% - 20px);
      padding-top: calc(50% - 50px);
    }

    &:before {
      position: absolute;
      z-index: 0;
      content: '';
      width: 100%;
      height: 40px;
      bottom: 0;
      left: 0;
      backdrop-filter: blur(5px);
      border-radius: 0 0 24px 24px;
    }

    span {
      z-index: 10;
      text-shadow: 2px 2px 2px black;
      text-transform: uppercase;
    }
  `
  return (
    <StyledWrapper>
      <Page>
        <StyledHero>
          <Heading as="h1" size="lg" color="secondary" mb="20px" style={{ color: isDark ? 'white' : '' }}>
            NFT Box
          </Heading>
        </StyledHero>
        <Heading as="h1" color="primary" mb="20px" style={{ color: isDark ? 'white' : '' }}>
          NonFungiblePlayer Box
        </Heading>
        <BoxDetailContainer>
          <GradientBack />
          <BoxContainerLeft>
            <BoxContainerComponent boxTitle="NonFungiblePlayer" boxImage="Player_box_3.gif" />
          </BoxContainerLeft>
          <BoxContainerRight>
            <BoxBuyDetailComponent />
            <NftBoxDetailInfo />
          </BoxContainerRight>
        </BoxDetailContainer>
        {/* <Heading
          as="h1"
          color="primary"
          mt="35px"
          mb="15px"
          style={{ textAlign: 'center', color: isDark ? 'white' : '' }}
        >
          NonFungiblePlayer Breeds
        </Heading>
        <ItemContainer>
          {breedsList.map((item) => {
            return (
              <ItemEachContainer key={item.image} style={{ backgroundImage: `url('${item.image}')` }}>
                <span>{item.breed}</span>
              </ItemEachContainer>
            )
          })}
        </ItemContainer> */}
      </Page>
    </StyledWrapper>
  )
}

export default NftBoxDetail
