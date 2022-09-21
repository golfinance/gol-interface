import _ from 'lodash'
import React, { useContext, useState, useEffect } from 'react'
import styled from 'styled-components'
import { StakeContext } from 'contexts/StakeContext'
import { Heading } from '@pancakeswap-libs/uikit'
import { Text } from 'gol-uikit'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import NonFungiblePlayer from 'config/abi/NonFungiblePlayer.json'
import { getNonFungiblePlayerAddress } from 'utils/addressHelpers'
import Modal from 'react-modal'
import FusionCandidate from './FusionCandidate'
import Select from '../../../../components/Select/Select'

const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
`

const BoxShadow = styled.div`
  background: #27262c;
  box-shadow: 0px 2px 12px -8px rgba(203, 203, 203, 0.7), 0px 1px 1px rgba(203, 203, 203, 0.05);
  position: relative;
  width: 100%;
`

const SelectNFT = ({ isOpen, closeDialog, index }) => {
  const { myNFTS } = useContext(StakeContext)
  const [filteredMyNfts, setFilteredMyNfts] = useState(myNFTS)

  const [positionVal, setPositionVal] = useState('All')
  const [genVal, setGenVal] = useState('All')
  const [sortLevel, setSortLevel] = useState(true)

  const closeModal = () => {
    setPositionVal('All')
    setGenVal('All')
    setSortLevel(true)
    closeDialog()
  }

  const web3 = new Web3(Web3.givenProvider)
  const nfpContract = new web3.eth.Contract(NonFungiblePlayer.abi as AbiItem[], getNonFungiblePlayerAddress())
  const filterByPosition = [
    { label: 'All', value: 'All' },
    { label: 'Striker', value: 'Striker' },
    { label: 'Midfielder', value: 'Midfielder' },
    { label: 'Defender', value: 'Defender' },
    { label: 'Goalie', value: 'Goalie' },
  ]
  const filterByGen = [
    { label: 'All', value: 'All' },
    { label: 'Gen 0', value: '0' },
    { label: 'Gen 1', value: '1' },
    { label: 'Gen 2', value: '2' },
    { label: 'Gen 3', value: '3' },
    { label: 'Gen 4', value: '4' },
    { label: 'Gen 5', value: '5' },
    { label: 'Gen 6', value: '6' },
    { label: 'Gen 7', value: '7' },
    { label: 'Gen 8', value: '8' },
    { label: 'Gen 9', value: '9' },
  ]

  const sortByLevel = [
    { label: 'Lowest to Highest', value: true },
    { label: 'Highest to Lowest', value: false },
  ]

  const getNFTPostion = async (tokenId) => {
    const retValue = await nfpContract.methods.getPosition(tokenId).call()
    return retValue.toString()
  }

  const getNFTGen = async (tokenId) => {
    const retValue = await nfpContract.methods.getGeneration(tokenId).call()
    return retValue.toString()
  }

  const getNFTLevel = async (tokenId) => {
    const retValue = await nfpContract.methods.getLevel(tokenId).call()
    return parseInt(retValue.toString())
  }

  const filterNFT = async (option, val) => {
    let tmpNfts = []
    let filteredNfts = []
    const positions = []
    const gens = []
    const levels = []

    if (option === 'Position') {
      if (val === 'All') {
        tmpNfts = myNFTS
      } else {
        for (let i = 0; i < myNFTS.length; i++) {
          positions.push(getNFTPostion(myNFTS[i].tokenId))
        }
        const result = await Promise.all(positions)
        for (let i = 0; i < result.length; i++) {
          if (result[i] === val) {
            tmpNfts.push(myNFTS[i])
          }
        }
      }

      if (genVal === 'All') {
        filteredNfts = tmpNfts
      } else {
        for (let i = 0; i < tmpNfts.length; i++) {
          gens.push(getNFTGen(tmpNfts[i].tokenId))
        }
        const result = await Promise.all(gens)
        for (let i = 0; i < result.length; i++) {
          if (result[i] === genVal) {
            filteredNfts.push(tmpNfts[i])
          }
        }
      }
    } else if (option === 'Generation') {
      if (positionVal === 'All') {
        tmpNfts = myNFTS
      } else {
        for (let i = 0; i < myNFTS.length; i++) {
          positions.push(getNFTPostion(myNFTS[i].tokenId))
        }
        const result = await Promise.all(positions)
        for (let i = 0; i < result.length; i++) {
          if (result[i] === positionVal) {
            tmpNfts.push(myNFTS[i])
          }
        }
      }

      if (val === 'All') {
        filteredNfts = tmpNfts
      } else {
        for (let i = 0; i < tmpNfts.length; i++) {
          gens.push(getNFTGen(tmpNfts[i].tokenId))
        }
        const result = await Promise.all(gens)
        for (let i = 0; i < result.length; i++) {
          if (result[i] === val) {
            filteredNfts.push(tmpNfts[i])
          }
        }
      }
    }

    for (let i = 0; i < filteredNfts.length; i++) {
      levels.push(getNFTLevel(filteredNfts[i].tokenId))
    }
    const result = await Promise.all(levels)
    if (sortLevel) {
      for (let i = 0; i < result.length; i++) {
        for (let j = 0; j < result.length - i - 1; j++) {
          if (result[j + 1] < result[j]) {
            const tmpResult = result[j + 1]
            result[j + 1] = result[j]
            result[j] = tmpResult

            const tmpNft = filteredNfts[j + 1]
            filteredNfts[j + 1] = filteredNfts[j]
            filteredNfts[j] = tmpNft
          }
        }
      }
    } else {
      for (let i = 0; i < result.length; i++) {
        for (let j = 0; j < result.length - i - 1; j++) {
          if (result[j + 1] > result[j]) {
            const tmpResult = result[j + 1]
            result[j + 1] = result[j]
            result[j] = tmpResult

            const tmpNft = filteredNfts[j + 1]
            filteredNfts[j + 1] = filteredNfts[j]
            filteredNfts[j] = tmpNft
          }
        }
      }
    }

    setFilteredMyNfts(filteredNfts)
  }

  const filterPositionChanged = async (option) => {
    setPositionVal(option.value)
    filterNFT('Position', option.value)
  }

  const filterGenChanged = async (option) => {
    setGenVal(option.value)
    filterNFT('Generation', option.value)
  }

  const sortLevelChanged = async (option) => {
    console.log(option.value)

    const tmpFilteredMyNfts = filteredMyNfts
    const levels = []

    for (let i = 0; i < tmpFilteredMyNfts.length; i++) {
      levels.push(getNFTLevel(tmpFilteredMyNfts[i].tokenId))
    }
    const result = await Promise.all(levels)

    if (option.value) {
      for (let i = 0; i < result.length; i++) {
        for (let j = 0; j < result.length - i - 1; j++) {
          if (result[j + 1] < result[j]) {
            const tmpResult = result[j + 1]
            result[j + 1] = result[j]
            result[j] = tmpResult

            const tmpNft = tmpFilteredMyNfts[j + 1]
            tmpFilteredMyNfts[j + 1] = tmpFilteredMyNfts[j]
            tmpFilteredMyNfts[j] = tmpNft
          }
        }
      }
    } else {
      for (let i = 0; i < result.length; i++) {
        for (let j = 0; j < result.length - i - 1; j++) {
          if (result[j + 1] > result[j]) {
            const tmpResult = result[j + 1]
            result[j + 1] = result[j]
            result[j] = tmpResult

            const tmpNft = tmpFilteredMyNfts[j + 1]
            tmpFilteredMyNfts[j + 1] = tmpFilteredMyNfts[j]
            tmpFilteredMyNfts[j] = tmpNft
          }
        }
      }
    }

    setFilteredMyNfts(tmpFilteredMyNfts)
    setSortLevel(option.value)
  }

  useEffect(() => {
    console.log('SelectNFT Call!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    const initNFTs = async () => {
      let tmpNfts = []
      let filteredNfts = []
      const positions = []
      const gens = []
      const levels = []

      if (positionVal === 'All') {
        tmpNfts = myNFTS
      } else {
        for (let i = 0; i < myNFTS.length; i++) {
          positions.push(getNFTPostion(myNFTS[i].tokenId))
        }
        const result = await Promise.all(positions)
        for (let i = 0; i < result.length; i++) {
          if (result[i] === positionVal) {
            tmpNfts.push(myNFTS[i])
          }
        }
      }

      if (genVal === 'All') {
        filteredNfts = tmpNfts
      } else {
        for (let i = 0; i < tmpNfts.length; i++) {
          gens.push(getNFTGen(tmpNfts[i].tokenId))
        }
        const result = await Promise.all(gens)
        for (let i = 0; i < result.length; i++) {
          if (result[i] === genVal) {
            filteredNfts.push(tmpNfts[i])
          }
        }
        filteredNfts = tmpNfts
      }

      for (let i = 0; i < filteredNfts.length; i++) {
        levels.push(getNFTLevel(filteredNfts[i].tokenId))
      }
      const result = await Promise.all(levels)
      if (sortLevel) {
        for (let i = 0; i < result.length; i++) {
          for (let j = 0; j < result.length - i - 1; j++) {
            if (result[j + 1] < result[j]) {
              const tmpResult = result[j + 1]
              result[j + 1] = result[j]
              result[j] = tmpResult

              const tmpNft = filteredNfts[j + 1]
              filteredNfts[j + 1] = filteredNfts[j]
              filteredNfts[j] = tmpNft
            }
          }
        }
      } else {
        for (let i = 0; i < result.length; i++) {
          for (let j = 0; j < result.length - i - 1; j++) {
            if (result[j + 1] > result[j]) {
              const tmpResult = result[j + 1]
              result[j + 1] = result[j]
              result[j] = tmpResult

              const tmpNft = filteredNfts[j + 1]
              filteredNfts[j + 1] = filteredNfts[j]
              filteredNfts[j] = tmpNft
            }
          }
        }
      }

      setFilteredMyNfts(filteredNfts)
    }
    initNFTs()
    // eslint-disable-next-line
  }, [myNFTS])

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '70vw',
          maxWidth: '70vw',
          minWidth: '70vw',
          maxHeight: '85vh',
          borderRadius: '15px',
          background: '#27262c',
          zindex: 15,
        },
      }}
      contentLabel="Example Modal"
    >
      <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
        <Heading as="h1" size="lg" color="primary" mb="25px" style={{ textAlign: 'center', width: '600px' }}>
          <BoxShadow style={{ borderRadius: '16px', padding: '24px' }}>NFT Candidates</BoxShadow>
        </Heading>
        <div
          style={{ cursor: 'pointer', position: 'absolute', right: 0 }}
          onClick={closeModal}
          onKeyDown={closeModal}
          role="button"
          tabIndex={0}
        >
          <img src="/images/close.png" style={{ width: '25px', height: '25px', cursor: 'pointer' }} alt="close" />
        </div>
      </div>

      <div style={{ display: 'flex', float: 'left' }}>
        <LabelWrapper style={{ marginLeft: 16 }}>
          <Text textTransform="uppercase">Filter By Generation</Text>
          <Select
            options={filterByGen}
            onOptionChange={filterGenChanged}
            style={{ marginRight: '15px', background: '#27262c' }}
          />
        </LabelWrapper>
        <LabelWrapper style={{ marginLeft: 16 }}>
          <Text textTransform="uppercase">Filter By Position</Text>
          <Select
            options={filterByPosition}
            onOptionChange={filterPositionChanged}
            style={{ marginRight: '15px', background: '#27262c' }}
          />
        </LabelWrapper>
        <LabelWrapper style={{ marginLeft: 16 }}>
          <Text textTransform="uppercase">Sort By Level</Text>
          <Select
            options={sortByLevel}
            onOptionChange={sortLevelChanged}
            style={{ marginRight: '15px', background: '#27262c' }}
          />
        </LabelWrapper>
      </div>

      <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap', justifyContent: 'center' }}>
        {_.map(filteredMyNfts, (nft) => (
          <FusionCandidate data={nft} closeRequest={closeDialog} index={index} />
        ))}
      </div>
    </Modal>
  )
}

export default SelectNFT
