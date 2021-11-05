import React from 'react'
import { Box, Flex } from 'gol-uikit'
import styled from 'styled-components'
import HarvestCard from './HarvestCard'
import UserDetail from './UserDetail'

const StyledCard = styled(Box)`
  border-bottom: 1px ${({ theme }) => theme.colors.secondary} solid;
  border-left: 1px ${({ theme }) => theme.colors.secondary} solid;
  border-right: 1px ${({ theme }) => theme.colors.secondary} solid;
  border-radius: ${({ theme }) => `0 0 ${theme.radii.card} ${theme.radii.card}`};
  background: ${({ theme }) =>
    theme.isDark
      ? 'linear-gradient(180deg, #353097 0%, rgba(61, 42, 84, 0.9) 100%)'
      : 'linear-gradient(360deg, #353097 0%, rgba(61, 42, 84, 0.9) 100%)'};
`

const UserBanner = () => {
  return (
    <StyledCard p={['16px', null, null, '24px']}>
      <Flex alignItems="center" justifyContent="center" flexDirection={['column', null, null, 'row']}>
        <Flex flex="1" mr={[null, null, null, '32px']}>
          <UserDetail />
        </Flex>
        <Flex flex="1" width={['100%', null, 'auto']}>
          <HarvestCard />
        </Flex>
      </Flex>
    </StyledCard>
  )
}

export default UserBanner
