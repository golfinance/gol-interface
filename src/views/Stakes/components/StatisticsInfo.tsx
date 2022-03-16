import React, { useCallback, useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Flex, BaseLayout } from '@pancakeswap-libs/uikit'
import Staking from 'config/abi/Staking.json'
import { getStakingAddress } from 'utils/addressHelpers'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import { useWeb3React } from '@web3-react/core'
import { StakeContext } from 'contexts/StakeContext'
import { Harvest, TotalStaked, MyStaked, TotalRate, MyRate, RatePer } from './StaticComponents'

const StaticInfoCard = styled(BaseLayout)`
  ${({ theme }) => theme.mediaQueries.xs} {
    grid-template-columns: repeat(1, 1fr);
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(2, 1fr);
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    grid-template-columns: repeat(3, 1fr);
  }
  width: 100%;
`
const web3 = new Web3(Web3.givenProvider)
const stakingContract = new web3.eth.Contract(Staking.abi as AbiItem[], getStakingAddress())

const StatisticsInfo = ({ index }) => {
  const { account } = useWeb3React()

  const { selectedNFTS } = useContext(StakeContext)

  const [poolInfo, setPoolInfo] = useState({
    rewardAllGol: 0,
    totalStakedCount: 0,
    myStakedCount: 0,
    totalGolPower: 0,
    myGolPower: 0,
    dailyGolRate: 0,
  })

  const fetchInfo = useCallback(async () => {
    const pendingGol = await stakingContract.methods.getPendingGol(index, account).call()
    const pool = await stakingContract.methods.pools(index).call()
    const totalStkCount = pool.stakedCount
    const tmpTotalGolToken = await stakingContract.methods.getTotalGolPower(index).call()
    const tmpMyGolPower = await stakingContract.methods.getMyGolPower(index, account).call()
    const tmpDailyGolRate = await stakingContract.methods.getDailyGolRate(index).call()
    setPoolInfo({
      rewardAllGol: pendingGol,
      totalStakedCount: totalStkCount,
      myStakedCount: selectedNFTS.length,
      totalGolPower: tmpTotalGolToken,
      myGolPower: tmpMyGolPower,
      dailyGolRate: tmpDailyGolRate,
    })
  }, [account, selectedNFTS, index])

  useEffect(() => {
    fetchInfo()
  }, [fetchInfo])
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

  return (
    <BoxShadow style={{ borderRadius: '32px', padding: '24px' }}>
      <Flex flexDirection="column" alignItems="center">
        <BoxShadow style={{ borderRadius: '16px', padding: '24px' }}>
          {index === '1' ? 'NFT Staking Pool (NonFungiblePlayer)' : 'NFT Staking Pool (Genesis)'}
        </BoxShadow>
        <StaticInfoCard style={{ marginTop: '25px' }}>
          <InfoWrapper>
            <Harvest rewardAllGol={poolInfo.rewardAllGol} index={index} />
          </InfoWrapper>
          <InfoWrapper>
            <TotalStaked totalStakedCount={poolInfo.totalStakedCount} />
          </InfoWrapper>
          <InfoWrapper>
            <MyStaked myStakedCount={poolInfo.myStakedCount} />
          </InfoWrapper>
          <InfoWrapper>
            <TotalRate totalGolPower={poolInfo.totalGolPower} />
          </InfoWrapper>
          <InfoWrapper>
            <MyRate myGolPower={poolInfo.myGolPower} />
          </InfoWrapper>
          <InfoWrapper>
            <RatePer dailyGolRate={poolInfo.dailyGolRate} />
          </InfoWrapper>
        </StaticInfoCard>
      </Flex>
    </BoxShadow>
  )
}

export default StatisticsInfo
