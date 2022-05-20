import _ from 'lodash'
import React, { useContext, useEffect, useState } from 'react'
import { StakeContext } from 'contexts/StakeContext'
import { AbiItem } from 'web3-utils'
import styled from 'styled-components'
import { Heading, Button, Text, Tag } from '@pancakeswap-libs/uikit'
import Web3 from 'web3'
import NonFungiblePlayer from 'config/abi/NonFungiblePlayer.json'
import Match from 'config/abi/Match.json'
import { useWeb3React } from '@web3-react/core'
import Modal from 'react-modal'
import { getNonFungiblePlayerAddress, getMatchAddress } from 'utils/addressHelpers'
import { LoadingContext } from 'contexts/LoadingContext'
import NewItem from './ItemComponents/NewItem'

const FusionControlContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const StakeItemEach = styled.div`
  width: 25%;
  @media (max-width: 500px) {
    width: 100%;
  }
`

const BoxShadow = styled.div`
  background: #27262c;
  box-shadow: 0px 2px 12px -8px rgba(203, 203, 203, 0.7), 0px 1px 1px rgba(203, 203, 203, 0.05);
  position: relative;
  width: 100%;
`

const TypeTag = styled(Tag)`
  backdrop-filter: blur(10px);
`

const web3 = new Web3(Web3.givenProvider)
const nfpContract = new web3.eth.Contract(NonFungiblePlayer.abi as AbiItem[], getNonFungiblePlayerAddress())
const matchContract = new web3.eth.Contract(Match.abi as AbiItem[], getMatchAddress())

const MatchContainer = () => {
  const { selectedMatchNfts, initSelectedMatchNfts } = useContext(StakeContext)
  const { setLoading } = useContext(LoadingContext)
  const { account } = useWeb3React()
  const [statusMatch, setStatusMatch] = useState(0)
  const [winningChance, setWinningChance] = useState(0)
  const [winningPrize, setWinningPrize] = useState(0)
  const [isOpen, setModalOpen] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [earnPrize, setEarnPrize] = useState(0)

  const closeDialog = () => {
    setModalOpen(false)
  }

  useEffect(() => {
    const fetchIsAvaialbeMatch = async () => {
      console.log('Selected: ', selectedMatchNfts)
      let isStatusMatch = 1
      for (let i = 0; i < 4; i++) {
        if (selectedMatchNfts[i] === 0) {
          isStatusMatch = 0
          break
        }
      }

      if (isStatusMatch === 1) {
        const tmpLevels = []
        for (let i = 0; i < 4; i++) tmpLevels[i] = nfpContract.methods.getLevel(parseInt(selectedMatchNfts[i])).call()
        const levels = await Promise.all(tmpLevels)

        if (
          parseInt(levels[0]) === parseInt(levels[1]) &&
          parseInt(levels[1]) === parseInt(levels[2]) &&
          parseInt(levels[2]) === parseInt(levels[3])
        )
          isStatusMatch = 2
      }

      if (isStatusMatch === 2) {
        const tmpPosition = []
        for (let i = 0; i < 4; i++)
          tmpPosition[i] = nfpContract.methods.getPosition(parseInt(selectedMatchNfts[i])).call()
        const positions = await Promise.all(tmpPosition)

        if (
          positions[0].toString() !== positions[1].toString() &&
          positions[0].toString() !== positions[2].toString() &&
          positions[0].toString() !== positions[3].toString() &&
          positions[1].toString() !== positions[2].toString() &&
          positions[1].toString() !== positions[3].toString() &&
          positions[2].toString() !== positions[3].toString()
        )
          isStatusMatch = 3

        if (isStatusMatch === 3) {
          const tmpWinningChance = await matchContract.methods.getWinningChance(selectedMatchNfts, account).call()

          setWinningChance(parseInt(tmpWinningChance) / 100)
          const level = await nfpContract.methods.getLevel(selectedMatchNfts[0]).call()
          const tmpWinningPrize = await matchContract.methods.getWinningPrize(parseInt(level)).call()
          setWinningPrize(parseInt(tmpWinningPrize) / 100000)
        }
      }
      setStatusMatch(isStatusMatch)
    }
    fetchIsAvaialbeMatch()
  }, [statusMatch, selectedMatchNfts, account])

  const startMatch = async () => {
    setLoading(true)
    try {
      await matchContract.methods
        .startMatch(selectedMatchNfts)
        .send({ from: account })
        .on('transactionHash', function () {
          console.log('transaction submitted!')
        })
        .on('receipt', function (receipt) {
          console.log(
            'Receipt0 =>',
            receipt.events.endMatch.returnValues.success,
            receipt.events.endMatch.returnValues.tokenPrize,
          )

          setIsSuccess(receipt.events.endMatch.returnValues.success)
          setEarnPrize(receipt.events.endMatch.returnValues.tokenPrize)

          setModalOpen(true)
        })
    } catch (err: unknown) {
      const { message } = err as Error
    }

    setModalOpen(true)

    initSelectedMatchNfts([0, 0, 0, 0])
    setLoading(false)
  }

  return (
    <div>
      <FusionControlContainer>
        <StakeItemEach>
          <NewItem index={0} />
        </StakeItemEach>
        <StakeItemEach>
          <NewItem index={1} />
        </StakeItemEach>
        <StakeItemEach>
          <NewItem index={2} />
        </StakeItemEach>
        <StakeItemEach>
          <NewItem index={3} />
        </StakeItemEach>
      </FusionControlContainer>
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '10px' }}>
        <div style={{ display: 'flex', marginRight: '15px' }}>
          <Text>Winning Chance: </Text> &nbsp;&nbsp;
          <Text fontSize="15px">{winningChance} %</Text>
        </div>
        <div style={{ display: 'flex' }}>
          <Text>Winning Prize: </Text> &nbsp;&nbsp;
          <Text fontSize="15px">{winningPrize} GOL</Text>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '10px' }}>
        {statusMatch === 0 ? (
          <Button style={{ width: '25%' }} disabled>
            Select NFTs
          </Button>
        ) : statusMatch === 1 ? (
          <Button style={{ width: '25%' }} disabled>
            Levels Must be Same
          </Button>
        ) : statusMatch === 2 ? (
          <Button style={{ width: '25%' }} disabled>
            Positions Must be Different
          </Button>
        ) : (
          <Button style={{ width: '25%' }} onClick={startMatch}>
            Start Match
          </Button>
        )}
      </div>

      <Modal
        isOpen={isOpen}
        onRequestClose={closeDialog}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '70vw',
            maxWidth: '70vw',
            minWidth: '70vw',
            borderRadius: '15px',
            background: '#27262c',
            zindex: 15,
          },
        }}
        contentLabel="Example Modal"
      >
        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <Heading as="h1" size="lg" color="primary" mb="25px" style={{ textAlign: 'center', width: '600px' }}>
            <BoxShadow style={{ borderRadius: '16px', padding: '24px' }}>
              {isSuccess ? 'Congratulations! You Won the Match!' : 'Sorry! You Lose the Match!'}
            </BoxShadow>
          </Heading>
          <div
            style={{ cursor: 'pointer', position: 'absolute', right: 0 }}
            onClick={closeDialog}
            onKeyDown={closeDialog}
            role="button"
            tabIndex={0}
          >
            <img src="/images/close.png" style={{ width: '25px', height: '25px', cursor: 'pointer' }} alt="close" />
          </div>
        </div>

        <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap', justifyContent: 'center' }}>
          {!isSuccess ? (
            <TypeTag variant="success" outline>
              Cheer up! Please try another Match!
            </TypeTag>
          ) : (
            <span style={{ color: '#f7941d', display: 'flex' }}>
              {`You earned ${earnPrize / 100000}`}
              <img
                style={{ width: '16px', height: '16px', marginLeft: '5px', transform: 'translateY(-.5px)' }}
                src="/images/favicon-32x32.png"
                alt="GolToken"
              />
              <div style={{ marginRight: '5px', color: '#00d86c' }}>Gol </div> for prize !
            </span>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default MatchContainer
