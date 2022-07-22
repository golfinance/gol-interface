import React, { useEffect, useState, useContext } from 'react'
import { Flex, Text, Tag } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import NonFungiblePlayer from 'config/abi/NonFungiblePlayer.json'
import Web3 from 'web3'
import { PINATA_BASE_URI } from 'config/constants/nfts'
import { AbiItem } from 'web3-utils'
import { getNonFungiblePlayerAddress, getMatchAddress } from 'utils/addressHelpers'
import Match from 'config/abi/Match.json'
import { LoadingContext } from 'contexts/LoadingContext'
import { StakeContext } from 'contexts/StakeContext'
import { useWeb3React } from '@web3-react/core'
import { secondsToHours, secondsToMinutes } from 'date-fns/esm'
import SelectNFT from './SelectNFT'

const ImageContainer = styled.div`
  position: relative;
  padding-bottom: 100%;
  height: 0;
  border-top-right-radius: 16px;
  border-top-left-radius: 16px;
  background-color: #101820;
  cursor: pointer;
  color: white;
`

const NftImage = styled.div`
  transition: transform 0.3s ease, -webkit-transform 0.3s ease;
  transform-origin: center;
  background-size: auto 100%;
  background-position: 50%;
  background-repeat: no-repeat;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  border-top-right-radius: 16px;
  border-top-left-radius: 16px;
  top: 0;
`

const AddImage = styled.div`
  transition: transform 0.3s ease, -webkit-transform 0.3s ease;
  transform-origin: center;
  background-size: auto 100%;
  background-position: 50%;
  background-repeat: no-repeat;
  background-image: url('/images/add.svg');
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  &:hover {
    transform: scale(1.04);
  }
`

const Divider = styled.div`
  height: 1px;
  min-width: unset;
  background-image: url(../images/line.jpg);
  background-repeat: repeat-x;
  position: relative;
  background-size: contain;
  background-position: 50%;
`
const ItemContainer = styled.div`
  margin-right: 30px;
  margin-left: 30px;
  margin-bottom: 15px;
  border-radius: 16px;
  background: #27262c;
  box-shadow: 0px 2px 12px -8px rgba(203, 203, 203, 0.7), 0px 1px 1px rgba(203, 203, 203, 0.05);
  position: relative;
`

const web3 = new Web3(Web3.givenProvider)
const nfpContract = new web3.eth.Contract(NonFungiblePlayer.abi as AbiItem[], getNonFungiblePlayerAddress())
const matchContract = new web3.eth.Contract(Match.abi as AbiItem[], getMatchAddress())

const NewItem = ({ index }) => {
  const { account } = useWeb3React()
  const [isOpen, setModalOpen] = useState(false)
  const { setLoading } = useContext(LoadingContext)
  const { selectedMatchNfts } = useContext(StakeContext)
  const [canPlayMatch, setCanPlayMatch] = useState(false)
  const [remainTime, setRemainTime] = useState({ hr: 0, min: 0, sec: 0 })
  const [remainTimeSecs, setRemainTimeSecs] = useState(0)
  const [nftInfo, setNftInfo] = useState({
    tokenId: 0,
    tokenName: '',
    imageUrl: '',
    skillPoint: 0,
    level: 0,
    gen: 0,
    position: '',
    class: '',
  })

  useEffect(() => {
    const fetchNft = async () => {
      setLoading(true)

      if (selectedMatchNfts[index] === 0) {
        setLoading(false)
        setNftInfo({
          tokenId: selectedMatchNfts[index],
          tokenName: '',
          imageUrl: '',
          skillPoint: 0,
          level: 0,
          gen: 0,
          position: '',
          class: 'tmpClass',
        })
        return
      }
      let tokenUri = ''
      let tmpSkillPoint = 0
      let tmpLevel = 0
      let tmpGen = 0
      let tmpClass = ''
      let tmpPosition = ''

      tokenUri = await nfpContract.methods.tokenURI(selectedMatchNfts[index]).call()
      tmpSkillPoint = await nfpContract.methods.getSkillPoint(selectedMatchNfts[index]).call()
      tmpLevel = await nfpContract.methods.getLevel(selectedMatchNfts[index]).call()
      tmpGen = await nfpContract.methods.getGeneration(selectedMatchNfts[index]).call()
      tmpClass = await nfpContract.methods.getClass(selectedMatchNfts[index]).call()
      tmpPosition = await nfpContract.methods.getPosition(selectedMatchNfts[index]).call()

      const passedBlocks = parseInt(await matchContract.methods.getPassedBlocks(account).call())
      const flgPlayedMatch = await matchContract.methods.isPlayedMatch(account).call()
      const matchPeriod = parseInt(await matchContract.methods.matchPeriod().call())

      if (!flgPlayedMatch) setCanPlayMatch(true)
      else if (passedBlocks >= matchPeriod) setCanPlayMatch(true)
      else {
        const remainSec = (matchPeriod - passedBlocks) * 3
        // const tmpHr = Math.round(remainSec / 3600)
        // remainSec -= tmpHr * 3600
        // const tmpMin = Math.round(remainSec / 60)
        // remainSec -= tmpMin * 60
        // const tmpSec = remainSec

        // setRemainTime({ hr: tmpHr, min: tmpMin, sec: tmpSec })
        console.log(matchPeriod, passedBlocks, remainSec)
        const tmpHr = Math.round(remainSec / (60 * 60))
        const tmpMin = Math.round((remainSec % (60 * 60)) / 60)
        const tmpSecs = remainSec % 60

        setRemainTime({ hr: tmpHr, min: tmpMin, sec: tmpSecs })
      }
      const res = await fetch(tokenUri)
      const json = await res.json()
      let tmpImageUrl = json.image
      tmpImageUrl = tmpImageUrl.slice(7)
      tmpImageUrl = `${PINATA_BASE_URI}${tmpImageUrl}`

      setNftInfo({
        tokenId: selectedMatchNfts[index],
        tokenName: json.name,
        imageUrl: tmpImageUrl,
        skillPoint: tmpSkillPoint,
        level: tmpLevel,
        gen: tmpGen,
        position: tmpPosition,
        class: tmpClass,
      })
      setLoading(false)
    }
    fetchNft()
    // eslint-disable-next-line
  }, [selectedMatchNfts, index])

  useEffect(() => {
    const interval = setInterval(() => {
      if (remainTime.hr > 0 || remainTime.min > 0 || remainTime.sec > 0) {
        let tmpSec = remainTime.sec
        let tmpMin = remainTime.min
        let tmpHr = remainTime.hr
        tmpSec--
        if (tmpSec < 0) {
          tmpMin--
          tmpSec = 59
          if (tmpMin < 0) {
            tmpHr--
            tmpMin = 59
          }
        }

        setRemainTime({ hr: tmpHr, min: tmpMin, sec: tmpSec })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [remainTime])
  const closeDialog = () => {
    setModalOpen(false)
  }

  const Completionist = () => <span>You are good to go!</span>

  return (
    <ItemContainer style={{ background: '#27262c' }}>
      {nftInfo.tokenId === 0 ? (
        <Flex flexDirection="column">
          <ImageContainer style={{ background: '#101820' }} onClick={(e) => setModalOpen(true)}>
            <AddImage />
          </ImageContainer>
          <Divider />
          <Flex flexDirection="column" style={{ padding: '24px' }}>
            <Text fontSize="24px" style={{ textAlign: 'center' }}>
              Add NFT
            </Text>
          </Flex>
        </Flex>
      ) : (
        <Flex flexDirection="column">
          <ImageContainer onClick={(e) => setModalOpen(true)}>
            <NftImage
              style={{ backgroundImage: `url('${nftInfo.imageUrl}')`, filter: !canPlayMatch ? 'blur(10px)' : '' }}
            />
            {!canPlayMatch ? (
              <div
                style={{ fontSize: '28px', position: 'absolute', left: '10px', top: '10px' }}
              >{`${remainTime.hr} : ${remainTime.min} : ${remainTime.sec}`}</div>
            ) : (
              ''
            )}
          </ImageContainer>
          <Divider />
          <Flex flexDirection="column" style={{ padding: '24px' }}>
            <Text fontSize="20px" style={{ textAlign: 'center', marginBottom: '15px' }}>
              {nftInfo.tokenName}
            </Text>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '5px' }}>
              <Text>Skill Point: </Text> &nbsp;&nbsp;
              <Text fontSize="15px">{nftInfo.skillPoint}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '5px' }}>
              <Text>Level: </Text> &nbsp;&nbsp;
              <Text fontSize="15px">{nftInfo.level}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '5px' }}>
              <Text>Generation: </Text> &nbsp;&nbsp;
              <Text fontSize="15px">{nftInfo.gen}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '5px' }}>
              <Text>Position: </Text> &nbsp;&nbsp;
              <Text fontSize="15px">{nftInfo.position}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
              <Text>Class: </Text> &nbsp;&nbsp;
              <Text fontSize="15px">{nftInfo.class}</Text>
            </div>
          </Flex>
        </Flex>
      )}
      <SelectNFT isOpen={isOpen} closeDialog={closeDialog} index={index} />
    </ItemContainer>
  )
}

export default NewItem
