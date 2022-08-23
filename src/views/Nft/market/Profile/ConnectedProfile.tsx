import React from 'react'
import styled from 'styled-components'
import { useProfile } from 'state/profile/hooks'
import { useWeb3React } from '@web3-react/core'
import { Box } from 'gol-uikit'
import Page from 'components/Layout/Page'
import { Route } from 'react-router'
import { useUserNfts } from 'state/nftMarket/hooks'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import { useAchievements, useFetchAchievements } from 'state/achievements/hooks'
import useFetchUserNfts from './hooks/useFetchUserNfts'
import MarketPageHeader from '../components/MarketPageHeader'
import ProfileHeader from './components/ProfileHeader'
import TabMenu from './components/TabMenu'
import Achievements from './components/Achievements'
import ActivityHistory from './components/ActivityHistory'
import SubMenu from './components/SubMenu'
import UserNfts from './components/UserNfts'
// FIXME
import {profileResponse} from './simulatedResponses';

const TabMenuWrapper = styled(Box)`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0%);

  ${({ theme }) => theme.mediaQueries.sm} {
    left: auto;
    transform: none;
  }
`

const ConnectedProfile = () => {
  const { profile } = useProfile()
  // const { profile } = profileResponse;
  const achievements = useAchievements()
  const { account } = useWeb3React()
  const { nfts: userNfts } = useUserNfts()


  useFetchAchievements()
  useFetchUserNfts(account)

  // FIXME: Connected Profile View
  console.log('Inside ConnectedProfile')
  console.log('PROFILE: ', profile)

  return (
    <>
      <MarketPageHeader position="relative">
        <ProfileHeader
          accountPath={account}
          profile={profile}
          achievements={achievements}
          nftCollected={userNfts.length}
        />
        <TabMenuWrapper>
          <TabMenu />
        </TabMenuWrapper>
      </MarketPageHeader>
      <Page style={{ minHeight: 'auto' }}>
        <Route path={`${nftsBaseUrl}/profile/:accountAddress/achievements`}>
          <Achievements achievements={achievements} points={profile?.points} />
        </Route>
        <Route path={`${nftsBaseUrl}/profile/:accountAddress/activity`}>
          <SubMenu />
          <ActivityHistory />
        </Route>
        <Route exact path={`${nftsBaseUrl}/profile/:accountAddress`}>
          <SubMenu />
          <UserNfts />
        </Route>
      </Page>
    </>
  )
}

export default ConnectedProfile
