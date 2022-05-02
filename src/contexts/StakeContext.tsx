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
  initMyNFTS: (datas) => undefined,
  initSelectedNFTs: (datas) => undefined,
  initSelectedFirstNft: (data) => undefined,
  initSelectedSecondNft: (data) => undefined,
})

const StakeContextProvider = ({ children }) => {
  const [selectedNFTS, setSelectedNFTS] = useState([])
  const [myNFTS, setMyNFTS] = useState([])
  const [selectedFirstNft, setSelectFirstNft] = useState({ tokenId: 0, isAIR: false })
  const [selectedSecondNft, setSelectSecondNft] = useState({ tokenId: 0, isAIR: false })

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

  return (
    <StakeContext.Provider
      value={{
        selectedNFTS,
        myNFTS,
        selectedFirstNft,
        selectedSecondNft,
        initMyNFTS,
        initSelectedNFTs,
        initSelectedFirstNft,
        initSelectedSecondNft,
      }}
    >
      {children}
    </StakeContext.Provider>
  )
}

export { StakeContext, StakeContextProvider }
