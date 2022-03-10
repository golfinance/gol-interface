import React from 'react'
import { Flex, Image, Text } from '@pancakeswap-libs/uikit'
import { getNumberSuffix } from 'utils/formatBalance'

export interface TotalStackedInferface {
  totalStakedCount?: any
}

const TotalStaked = ({ totalStakedCount }: TotalStackedInferface) => {
  return (
    <Flex flexDirection="column" justifyContent="flex-start">
      <Text style={{ textAlign: 'left' }}>Total Staked</Text>
      <Flex mt="12px">
        <Text color="secondary" fontSize="24px" pr="3px" ml="6px">
          {getNumberSuffix(totalStakedCount, 0)}
        </Text>
        {/* <Text textTransform="uppercase" color="textSubtle" fontSize="18px" style={{lineHeight: 2}}>
          {`≈ $${getNumberSuffix(8045043, 2)}`}
        </Text> */}
      </Flex>
    </Flex>
  )
}

export default TotalStaked
