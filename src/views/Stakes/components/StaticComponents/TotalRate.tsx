import React from 'react'
import { Flex, Text } from '@pancakeswap-libs/uikit'
import { getNumberSuffix } from 'utils/formatBalance'

const TotalRate = ({ totalGolPower }) => {
  return (
    <Flex flexDirection="column">
      <Text style={{ textAlign: 'left' }}>Total GolPower</Text>
      <Flex mt="12px">
        <Text color="secondary" fontSize="24px" pr="3px" ml="6px">
          {getNumberSuffix(totalGolPower, 0)}
        </Text>
      </Flex>
    </Flex>
  )
}

export default TotalRate
