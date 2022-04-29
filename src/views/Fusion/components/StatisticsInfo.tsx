import React, { useCallback, useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Flex, BaseLayout } from '@pancakeswap-libs/uikit'
import Web3 from 'web3'
import Training from 'config/abi/Training.json'
import { AbiItem } from 'web3-utils'
import { useWeb3React } from '@web3-react/core'
import { StakeContext } from 'contexts/StakeContext'
import { getTrainingAddress } from 'utils/addressHelpers'

const StaticInfoCard = styled(BaseLayout)`
  ${({ theme }) => theme.mediaQueries.xs} {
    grid-template-columns: repeat(1, 1fr);
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(2, 1fr);
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    grid-template-columns: repeat(2, 1fr);
  }
  width: 100%;
`

const StaticInfoRuleCard = styled(BaseLayout)`
  padding-top: 15px;
  width: 80%;
  ${({ theme }) => theme.mediaQueries.xs} {
    grid-template-columns: repeat(1, 1fr);
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(1, 1fr);
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    grid-template-columns: repeat(1, 1fr);
  }
`

const BoxShadow = styled.div`
  background: #27262c;
  box-shadow: 0px 2px 12px -8px rgba(203, 203, 203, 0.7), 0px 1px 1px rgba(203, 203, 203, 0.05);
  position: relative;
  width: 100%;
`
const InfoWrapper = styled.div`
  box-shadow: 0px 2px 12px -8px rgba(203, 203, 203, 0.7), 0px 1px 1px rgba(203, 203, 203, 0.05);
  width: 100%;
  border-radius: 16px;
  padding: 24px;
`
const web3 = new Web3(Web3.givenProvider)
const trainingContract = new web3.eth.Contract(Training.abi as AbiItem[], getTrainingAddress())

const StatisticsInfo = () => {
  const { account } = useWeb3React()

  const { selectedNFTS } = useContext(StakeContext)

  const [poolInfo, setPoolInfo] = useState({
    trainingLevel: 0,
    totalStakedCount: 0,
    updateTrainingLevelFee: 0,
    updateHour: 0,
  })

  const fetchInfo = useCallback(async () => {
    const tmpTrainingLevel = await trainingContract.methods.trainingLevel(account).call()
    const tmpUpdateTrainingLevelFee = await trainingContract.methods.updateTrainingLevelFee().call()
    const maxStakedBlock = await trainingContract.methods.maxStakedBlock().call()

    const hour = (parseInt(maxStakedBlock.toString()) * 3) / 999 / 3600
    const feeToString = tmpUpdateTrainingLevelFee.toString()
    setPoolInfo({
      trainingLevel: tmpTrainingLevel,
      totalStakedCount: selectedNFTS.length,
      updateTrainingLevelFee: feeToString,
      updateHour: hour,
    })
  }, [account, selectedNFTS])

  useEffect(() => {
    fetchInfo()
  }, [fetchInfo])
  return (
    <BoxShadow style={{ borderRadius: '32px', padding: '24px' }}>
      <Flex flexDirection="column" alignItems="center">
        <BoxShadow style={{ borderRadius: '16px', padding: '24px' }}>NFP Fusion</BoxShadow>
      </Flex>
    </BoxShadow>
  )
}

export default StatisticsInfo
