import React from 'react';
import { Col, Container, Row, Card } from 'react-bootstrap'
import styled, { keyframes } from 'styled-components'
import { Flex, Heading, Button } from 'gol-uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'

import useTheme from 'hooks/useTheme'
import { SlideSvgDark, SlideSvgLight } from './SlideSvg'


const flyingAnim = () => keyframes`
  from {
    transform: translate(0,  0px);
  }
  50% {
    transform: translate(-5px, -5px);
  }
  to {
    transform: translate(0, 0px);
  }  
`

const fading = () => keyframes`
  from {
    opacity: 0.9;
  }
  50% {
    opacity: 0.1;
  }
  to {
    opacity: 0.9;
  }  
`

const BgWrapper = styled.div`
  z-index: -1;
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  bottom: 0px;
  left: 0px;
`

const InnerWrapper = styled.div`
  position: absolute;
  width: 100%;
  bottom: -3px;
`

const BunnyWrapper = styled.div`
  width: 100%;
  animation: ${flyingAnim} 3.5s ease-in-out infinite;
`

const StarsWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  & :nth-child(2) {
    animation: ${fading} 2s ease-in-out infinite;
    animation-delay: 1s;
  }

  & :nth-child(3) {
    animation: ${fading} 5s ease-in-out infinite;
    animation-delay: 0.66s;
  }

  & :nth-child(4) {
    animation: ${fading} 2.5s ease-in-out infinite;
    animation-delay: 0.33s;
  }
`

const ImagePath = '/images/home/lunar-bunny/'
const backgroundImageSrc1 = 'GOL-PLAYER'
const backgroundImageSrc2 = 'GOOOL TEXT'

// Array of card Images 
const CardsImages = [
  {
    imagePath: `${ImagePath}`,
    imageSrc: '01-Deflationary-BTT.png',
    linkTo: 'https://golfinance.gitbook.io/golfinance/protocol/goltoken/tokenomics'
  },
  {
    imagePath: `${ImagePath}`,
    imageSrc: '02-Auto-Compunding-BTT.png',
    linkTo: 'https://golfinance.gitbook.io/golfinance/protocol/golvaults'
  },
  {
    imagePath: `${ImagePath}`,
    imageSrc: '03-All-In-One-Solution-Btt.png',
    linkTo: 'https://golfinance.gitbook.io/golfinance/about-golfinance/intro'
  },
  {
    imagePath: `${ImagePath}`,
    imageSrc: '04-NFT-Game-Btt.png',
    linkTo: 'https://golfinance.gitbook.io/golfinance/protocol/golnfts/the-nft-game'
  }
]

const GolCards = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { theme } = useTheme()

  return (
    <>
      <BgWrapper>
        <InnerWrapper>{theme.isDark ? <SlideSvgDark width="100%" /> : <SlideSvgLight width="100%" />}</InnerWrapper>
      </BgWrapper>
      <Flex
        position="relative"
        flexDirection={['column-reverse', null, null, 'row']}
        alignItems={['flex-end', null, null, 'center']}
        justifyContent="center"
        mt={[account ? '380px' : '50px', null, 0]}
        id="homepage-hero"
      >
        <Container fluid>
          <Row className="justify-content-center"> 
            {CardsImages.map((props) => {
              return (
                <a href={props.linkTo} target="_blank" rel="noopener noreferrer" >
                  <Card.Img
                    variant="top"
                    src={`${props.imagePath}${props.imageSrc}`}
                    width={265}
                    height={325}
                  />
                </a>
              )
            })}            
          </Row>
        </Container>
      </Flex>     
    </>
  )
}

export default GolCards