import React, { useCallback, useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Flex, BaseLayout, Text } from '@pancakeswap-libs/uikit'
import Web3 from 'web3'
import Fusion from 'config/abi/Fusion.json'
import { AbiItem } from 'web3-utils'
import { getFusionAddress } from 'utils/addressHelpers'

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
const fusionContract = new web3.eth.Contract(Fusion.abi as AbiItem[], getFusionAddress())

const StatisticsInfo = () => {
  const [fusionPrice, setFusionPrice] = useState('')

  const fetchInfo = useCallback(async () => {
    const tmpFusionFee = await fusionContract.methods.fusionFee().call()
    console.log(fusionPrice)
    setFusionPrice(tmpFusionFee.toString())
  }, [fusionPrice])

  useEffect(() => {
    fetchInfo()
  }, [fetchInfo])
  return (
    <BoxShadow style={{ borderRadius: '32px', padding: '24px' }}>
      <Flex flexDirection="column" alignItems="center">
        <BoxShadow style={{ borderRadius: '16px', padding: '24px' }}>Match</BoxShadow>
        <StaticInfoRuleCard>
          <InfoWrapper>
            <Flex flexDirection="column">
              <Text style={{ textAlign: 'center', fontSize: '20px' }}>Match Information</Text>
              <Text fontSize="15px" pr="3px" pt="6px" ml="6px">
                - User could play match with 4 NFPs (Positions must be different & Levels must be same)
              </Text>
              <Text fontSize="15px" pr="3px" ml="6px">
                - User could earn prize with GOL token when he/she won the match and the Prize will increase by levels
                of NFPs
              </Text>
              <Text fontSize="15px" pr="3px" ml="6px">
                - Winning Chance will be calculate by the GolPower & GolPower Booster
              </Text>
            </Flex>
          </InfoWrapper>
        </StaticInfoRuleCard>
      </Flex>
    </BoxShadow>
  )
}

export default StatisticsInfo
