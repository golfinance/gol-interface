import React from 'react'
import { Flex, Image, Text } from '@pancakeswap-libs/uikit'

const TotalStaked = ({ totalStakedCount }) => {
  return (
    <Flex flexDirection="column">
      <Text style={{ textAlign: 'left' }}>My Staked</Text>
      <Flex mt="12px">
        <Text color="secondary" fontSize="24px" pr="3px" ml="6px">
          {totalStakedCount}
        </Text>
        {/* <Text textTransform="uppercase" color="textSubtle" fontSize="18px" style={{lineHeight: 2}}>
          {`≈ $${getNumberSuffix(494543, 2)}`}
        </Text> */}
      </Flex>
    </Flex>
  )
}

export default TotalStaked
