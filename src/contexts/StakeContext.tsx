import React, { useState, useEffect, useRef } from 'react'

const StakeContext = React.createContext({
  selectedNFTS: [],
  myNFTS: [],
  trainingNfts: [],
  trainingSelectedNfts: [],
  selectedFirstNft: {
    tokenId: 0,
    isAIR: false,
  },
  selectedSecondNft: {
    tokenId: 0,
    isAIR: false,
  },
  selectedMatchNfts: [],
  initMyNFTS: (datas) => undefined,
  initTrainingNfts: (datas) => undefined,
  initTrainingSelectedNfts: (datas) => undefined,
  initSelectedNFTs: (datas) => undefined,
  initSelectedFirstNft: (data) => undefined,
  initSelectedSecondNft: (data) => undefined,
  initSelectedMatchNfts: (datas) => undefined,
})

const StakeContextProvider = ({ children }) => {
  const [selectedNFTS, setSelectedNFTS] = useState([])
  const [myNFTS, setMyNFTS] = useState([])
  const [trainingNfts, setTrainingNfts] = useState([])
  const [trainingSelectedNfts, setTrainingSelectedNfts] = useState([])
  const [selectedFirstNft, setSelectFirstNft] = useState({ tokenId: 0, isAIR: false })
  const [selectedSecondNft, setSelectSecondNft] = useState({ tokenId: 0, isAIR: false })
  const [selectedMatchNfts, setSelectedMatchNfts] = useState([0, 0, 0, 0])

  const initSelectedNFTs = (datas) => {
    console.log('initSelecftedNFT', datas)
    setSelectedNFTS(datas)
  }

  const initMyNFTS = (datas) => {
    console.log('initMyNFTS', datas)
    setMyNFTS([...datas])
  }

  const initTrainingNfts = (datas) => {
    console.log('initTrainingNFTS', datas)
    setTrainingNfts([...datas])
  }

  const initTrainingSelectedNfts = (datas) => {
    setTrainingSelectedNfts([...datas])
  }

  const initSelectedFirstNft = (data) => {
    setSelectFirstNft(data)
  }

  const initSelectedSecondNft = (data) => {
    setSelectSecondNft(data)
  }

  const initSelectedMatchNfts = (datas) => {
    setSelectedMatchNfts([...datas])
  }

  return (
    <StakeContext.Provider
      value={{
        selectedNFTS,
        myNFTS,
        trainingNfts,
        trainingSelectedNfts,
        selectedFirstNft,
        selectedSecondNft,
        selectedMatchNfts,
        initMyNFTS,
        initTrainingNfts,
        initTrainingSelectedNfts,
        initSelectedNFTs,
        initSelectedFirstNft,
        initSelectedSecondNft,
        initSelectedMatchNfts,
      }}
    >
      {children}
    </StakeContext.Provider>
  )
}

export { StakeContext, StakeContextProvider }
