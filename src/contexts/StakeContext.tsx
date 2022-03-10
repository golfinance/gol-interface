import React, { useState, useEffect, useRef } from 'react'

const StakeContext = React.createContext({
  selectedNFTS: [],
  myNFTS: [],
  appendCandidate: (data) => undefined,
  initMyNFTS: (datas) => undefined,
  initSelectedNFTs: (datas) => undefined,
})

const StakeContextProvider = ({ children }) => {
  const [selectedNFTS, setSelectedNFTS] = useState([])
  const [myNFTS, setMyNFTS] = useState([])

  const appendCandidate = (data) => {
    setSelectedNFTS([...selectedNFTS, data])
  }

  const initSelectedNFTs = (datas) => {
    setSelectedNFTS(datas)
  }

  const initMyNFTS = (datas) => {
    setMyNFTS([...datas])
  }

  return (
    <StakeContext.Provider value={{ selectedNFTS, myNFTS, appendCandidate, initMyNFTS, initSelectedNFTs }}>
      {children}
    </StakeContext.Provider>
  )
}

export { StakeContext, StakeContextProvider }
