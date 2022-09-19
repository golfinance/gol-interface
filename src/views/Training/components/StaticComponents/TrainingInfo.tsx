import React from 'react'
import { Flex, Image, Text } from '@pancakeswap-libs/uikit'
import { getNumberSuffix } from 'utils/formatBalance'

const TrainingInfo = ({ updateTrainingLevelFee, updateHour }) => {
  return (
    <Flex flexDirection="column">
      <Text style={{ textAlign: 'center', fontSize: '20px' }}>Training Information</Text>
      <Text fontSize="15px" pr="3px" pt="6px" ml="6px">
        - Training Level represents the amount of NFPs you can train simultaneously.
      </Text>
      <Text fontSize="15px" pr="3px" ml="6px">
        {`- Training Level upgrade price is ${updateTrainingLevelFee} $GOL.`}
      </Text>
      <Text fontSize="15px" pr="3px" ml="6px">
        {`- Skill Points will increase by 1 every ${getNumberSuffix(updateHour, 1)} hs`}
      </Text>
      {/* <Text textTransform="uppercase" color="textSubtle" fontSize="18px" style={{lineHeight: 2}}>
          {`≈ $${getNumberSuffix(494543, 2)}`}
        </Text> */}
    </Flex>
  )
}

export default TrainingInfo
