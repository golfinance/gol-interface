import React from 'react'
import { Flex, Image, Text } from '@pancakeswap-libs/uikit'

const TrainingInfo = () => {
  return (
    <Flex flexDirection="column">
      <Text style={{ textAlign: 'center', fontSize: '20px' }}>Training Information</Text>
      <Text fontSize="15px" pr="3px" pt="6px" ml="6px">
        - Training Level represents the amount of NFPs you can train simultaneously.
      </Text>
      <Text fontSize="15px" pr="3px" ml="6px">
        - Training Level upgrade price is 200 $GOL.
      </Text>
      <Text fontSize="15px" pr="3px" ml="6px">
        - Skill Points will increase by 1 every XX hs
      </Text>
      {/* <Text textTransform="uppercase" color="textSubtle" fontSize="18px" style={{lineHeight: 2}}>
          {`≈ $${getNumberSuffix(494543, 2)}`}
        </Text> */}
    </Flex>
  )
}

export default TrainingInfo
