import React from 'react'
import { Flex, Image, Text } from '@pancakeswap-libs/uikit'
import { getNumberSuffix } from 'utils/formatBalance'

const RatePer = ({ dailyGolRate }) => {
  return (
    <Flex flexDirection="column">
      <Text style={{ textAlign: 'left' }}>Daily Gol / 100 GolPower</Text>
      <Flex mt="12px">
        <Image src="/images/favicon-32x32.png" alt="GolToken" width={32} height={32} />
        <Text color="secondary" fontSize="24px" pr="3px" ml="6px">
          {getNumberSuffix(dailyGolRate / 1000000, 0)}
        </Text>
        <Text textTransform="uppercase" color="textSubtle" fontSize="18px" style={{ lineHeight: 2 }}>
          ≈ $0
        </Text>
      </Flex>
    </Flex>
  )
}

export default RatePer
