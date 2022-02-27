import React from 'react';
import { Col, Container, Row, Card } from 'react-bootstrap'
import { motion } from 'framer-motion'
import styled, { keyframes } from 'styled-components'
import { Flex, Heading, Button } from 'gol-uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import { SlideSvgDark, SlideSvgLight } from './SlideSvg'


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
const ImagePath = '/images/home/lunar-bunny/'

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
    <div style={{ justifyContent: "center" }}>
      <BgWrapper>
        <InnerWrapper>{theme.isDark ? <SlideSvgDark width="100%" /> : <SlideSvgLight width="100%" />}</InnerWrapper>
      </BgWrapper>
      <Flex        
        alignItems={['flex-end', null, null, 'center']}      
        style={{ height: '800px' }}
      >
        <Container fluid >
          <Row >
            {CardsImages.map((props) => {
              return (
                <a href={props.linkTo} target="_blank" rel="noopener noreferrer" >
                  <motion.img
                    whileHover={{
                      scale: 0.9
                    }}
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
    </div>
  )
}

export default GolCards
