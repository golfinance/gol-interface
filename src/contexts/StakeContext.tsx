import React, { useState, useEffect, useRef } from 'react'

const StakeContext = React.createContext({
  selectedNFTS: [],
  myNFTS: [],
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
  initSelectedNFTs: (datas) => undefined,
  initSelectedFirstNft: (data) => undefined,
  initSelectedSecondNft: (data) => undefined,
  initSelectedMatchNfts: (datas) => undefined,
})

const StakeContextProvider = ({ children }) => {
  const [selectedNFTS, setSelectedNFTS] = useState([])
  const [myNFTS, setMyNFTS] = useState([])
  const [selectedFirstNft, setSelectFirstNft] = useState({ tokenId: 0, isAIR: false })
  const [selectedSecondNft, setSelectSecondNft] = useState({ tokenId: 0, isAIR: false })
  const [selectedMatchNfts, setSelectedMatchNfts] = useState([0, 0, 0, 0])

  const initSelectedNFTs = (datas) => {
    setSelectedNFTS(datas)
  }

  const initMyNFTS = (datas) => {
    setMyNFTS([...datas])
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
        selectedFirstNft,
        selectedSecondNft,
        selectedMatchNfts,
        initMyNFTS,
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
