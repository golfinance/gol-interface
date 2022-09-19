import React, { useState, useEffect, useRef } from 'react'
import { Flex, Text, Tag } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import SelectNFT from './SelectNFT'

const ImageContainer = styled.div`
  position: relative;
  padding-bottom: 100%;
  height: 0;
  border-top-right-radius: 16px;
  border-top-left-radius: 16px;
  background-color: rgb(249, 244, 211);
  cursor: pointer;
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

const NewItem = () => {
  const [isOpen, setModalOpen] = useState(false)

  const ItemContainer = styled.div`
    margin-right: 15px;
    margin-bottom: 15px;
    border-radius: 16px;
    background: #27262c;
    box-shadow: 0px 2px 12px -8px rgba(203, 203, 203, 0.7), 0px 1px 1px rgba(203, 203, 203, 0.05);
    position: relative;
  `
  const StakeBtn = styled(Tag)`
    border-color: '#101820';
    background-color: '#101820';
    color: 'white';
    cursor: pointer;
    display: flex;
    justify-content: center;
    padding: 16px 12px;
    font-size: 18px;
    margin-bottom: 12px;
    border-radius: 12px;
  `

  const UpgradeBtn = styled(Tag)`
    border-color: '#101820';
    background-color:'rgba(16,24,32,.2);
    color: 'white';
    cursor: pointer;
    display: flex;
    justify-content: center;
    padding: 16px 12px;
    font-size: 18px;
    border-radius: 12px;
  `

  const closeDialog = () => {
    setModalOpen(false)
  }

  const addNFT2Stake = (val) => {
    return false
  }
  const modalRef = useRef(undefined)

  return (
    <ItemContainer style={{ background: '#27262c' }}>
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
      <div ref={modalRef}>
        <SelectNFT isOpen={isOpen} closeDialog={closeDialog} />
      </div>
    </ItemContainer>
  )
}

export default NewItem
