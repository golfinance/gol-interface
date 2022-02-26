import React from 'react'
import styled from 'styled-components'
import { Cards, Flex } from 'gol-uikit'
import PageSection from 'components/PageSection'
import { useWeb3React } from '@web3-react/core'
import useTheme from 'hooks/useTheme'
import Container from 'components/Layout/Container'
import { PageMeta } from 'components/Layout/Page'
import Hero from './components/Hero'
import GolCards from './components/GolCards'
import { swapSectionData, earnSectionData, cakeSectionData } from './components/SalesSection/data'
import MetricsSection from './components/MetricsSection'
import SalesSection from './components/SalesSection'
import WinSection from './components/WinSection'
import FarmsPoolsRow from './components/FarmsPoolsRow'
import Footer from './components/Footer'
import CakeDataRow from './components/CakeDataRow'
import { WedgeTopLeft, InnerWedgeWrapper, OuterWedgeWrapper, WedgeTopRight } from './components/WedgeSvgs'
import UserBanner from './components/UserBanner'
import PancakeSquadBanner from './components/Banners/PancakeSquadBanner'


const StyledHeroSection = styled(PageSection)`
  padding-top: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 48px;
  }
`

const UserBannerWrapper = styled(Container)`
  z-index: 1;
  position: absolute;
  width: 100%;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);
  padding-left: 0px;
  padding-right: 0px;

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-left: 24px;
    padding-right: 24px;
  }
`
const ImagePath = '/images/home/lunar-bunny/'
const backgroundImageSrc1 = 'GOL-PLAYER'
const backgroundImageSrc2 = 'GOOOL TEXT'

const Home: React.FC = () => {
  const { theme } = useTheme()
  const { account } = useWeb3React()

  const HomeSectionContainerStyles = { margin: '0', width: '100%', maxWidth: '968px' }

  return (
    <>
      <PageMeta />
      <StyledHeroSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        background={
          theme.isDark
            ? 'radial-gradient(180% 50% at 50% 50%, #373357 0%, #27262c 100%)'
            : 'linear-gradient(180deg, #373357 0%, #27262c 100%)'
        }
        index={2}
        hasCurvedDivider={false}
      >
        {account && (
          <UserBannerWrapper>
            <UserBanner />
          </UserBannerWrapper>
        )}

        <Hero />

      </StyledHeroSection>

      <PageSection
        
        background={theme.colors.background}
        index={3}
        hasCurvedDivider={false}
        style={{
          backgroundImage: `url(${ImagePath}${backgroundImageSrc1}.png)`,
          backgroundPosition: 'center',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat'
        }}
        
      >
        <GolCards/>

      </PageSection>

      {/* <PageSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        background={theme.colors.background}
        index={4}
        hasCurvedDivider={false}
      >
        <GolCarousel />

      </PageSection> */}



      {/* <StyledHeroSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        background={
          theme.isDark
            ? 'radial-gradient(180% 50% at 50% 50%, #373357 0%, #27262c 100%)'
            : 'linear-gradient(180deg, #373357 0%, #27262c 100%)'
        }
        index={2}
        hasCurvedDivider={false}
      >
        {account && (
          <UserBannerWrapper>
            <UserBanner />
          </UserBannerWrapper>
        )}

        <Hero />

      </StyledHeroSection> */}

    


      <PageSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        background={
          theme.isDark
            ? 'linear-gradient(180deg, #27262C 22%, #36319b 100%)'
            : 'linear-gradient(180deg, #b0b0b0 22%, ##f4ae01 100%)'
        }
        index={2}
        hasCurvedDivider={false}
      >

        {/* <MetricsSection /> */}

      {/* </PageSection>
      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background={theme.colors.background}
        index={2}
        hasCurvedDivider={false}
      > */}
        <OuterWedgeWrapper>
          <InnerWedgeWrapper top fill={theme.isDark ? '#201335' : '#D8CBED'}>
            <WedgeTopLeft />
          </InnerWedgeWrapper>
        </OuterWedgeWrapper>

        {/* Invest in $GOL to win */}
        <SalesSection {...swapSectionData} />

      </PageSection>
      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background={theme.colors.gradients.cardHeader}
        index={2}
        hasCurvedDivider={false}
      >
        <OuterWedgeWrapper>
          <InnerWedgeWrapper width="150%" top fill={theme.colors.background}>
            <WedgeTopRight />
          </InnerWedgeWrapper>
        </OuterWedgeWrapper>

        {/* Earn passive income with crypto... */}
        <SalesSection {...earnSectionData} />

        {/* <FarmsPoolsRow /> */}
        {/* </PageSection>
      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background={
          theme.isDark
            ? 'linear-gradient(180deg, #0B4576 0%, #091115 100%)'
            : 'linear-gradient(180deg, #6FB6F1 0%, #EAF2F6 100%)'
        }
        index={2}
        hasCurvedDivider={false}
      > */}
        {/* <WinSection /> */}
      </PageSection>
      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background={theme.colors.background}
        index={2}
        hasCurvedDivider={false}
      >
        {/* GOL makes your world go around...  */}
        <SalesSection {...cakeSectionData} />
        <CakeDataRow />
      </PageSection>

      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background="linear-gradient(180deg, #373357 0%, #27262c 100%)"
        index={2}
        hasCurvedDivider={false}
      >
        <Footer />
      </PageSection>

    </>
  )
}

export default Home
