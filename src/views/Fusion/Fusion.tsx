import React from 'react'
import { Heading } from '@pancakeswap-libs/uikit'
import Page from '../../components/Layout/Page'
import { StatisticsInfo, FusionContainer } from './components'

const Fusion = () => {
  return (
    <Page>
      <Heading as="h1" size="lg" color="primary" mb="25px" style={{ textAlign: 'center' }}>
        <StatisticsInfo />
      </Heading>
      <FusionContainer />
    </Page>
  )
}

export default Fusion
