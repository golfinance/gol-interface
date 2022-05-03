import _ from 'lodash'
import React, { useContext, useEffect } from 'react'
import { AbiItem } from 'web3-utils'
import { Heading } from '@pancakeswap-libs/uikit'
import { StakeContext } from 'contexts/StakeContext'
import { LoadingContext } from 'contexts/LoadingContext'
import { useWeb3React } from '@web3-react/core'
import Web3 from 'web3'
import NonFungiblePlayer from 'config/abi/NonFungiblePlayer.json'
import { getNonFungiblePlayerAddress, getAirNftAddress, getTrainingAddress } from 'utils/addressHelpers'
import Page from '../../components/Layout/Page'
import { StatisticsInfo, FusionContainer } from './components'

const web3 = new Web3(Web3.givenProvider)
const nfpContract = new web3.eth.Contract(NonFungiblePlayer.abi as AbiItem[], getNonFungiblePlayerAddress())

const Fusion = () => {
  const { setLoading } = useContext(LoadingContext)
  const { account } = useWeb3React()
  const { initMyNFTS, initSelectedFirstNft, initSelectedSecondNft } = useContext(StakeContext)

  useEffect(() => {
    const fetchMyNfts = async () => {
      setLoading(true)
      const tokenIds = []
      const tmpMyTokens = []
      const nfpTokens = await nfpContract.methods.fetchMyNfts().call({ from: account })
      console.log('NFP Tokens: ', nfpTokens)
      _.map(nfpTokens, (itm) => {
        tokenIds.push({ tokenId: itm, isAIR: false })
      })

      const myTokenHashes = []
      for (let i = 0; i < tokenIds.length; i++) {
        myTokenHashes.push(nfpContract.methods.tokenURI(tokenIds[i].tokenId).call())
      }

      const result = await Promise.all(myTokenHashes)
      for (let i = 0; i < tokenIds.length; i++) {
        if (!tmpMyTokens[i]) tmpMyTokens[i] = {}
        tmpMyTokens[i].tokenId = tokenIds[i].tokenId
        tmpMyTokens[i].tokenHash = result[i]
        tmpMyTokens[i].isAIR = tokenIds[i].isAIR
        if (!tokenIds[i].isAIR) tmpMyTokens[i].contractAddress = getNonFungiblePlayerAddress()
        else tmpMyTokens[i].contractAddress = getAirNftAddress()
      }
      initMyNFTS(tmpMyTokens)

      initSelectedFirstNft({ tokenId: 0, isAIR: false })
      initSelectedSecondNft({ tokenId: 0, isAIR: false })

      setLoading(false)
    }
    fetchMyNfts()
    // eslint-disable-next-line
  }, [account])
  return (
    <Page>
      <Heading as="h1" size="lg" color="primary" mb="25px" style={{ textAlign: 'center' }}>
        <StatisticsInfo />
      </Heading>
      <FusionContainer />
    </Page>
  )
}

export default Fusion
