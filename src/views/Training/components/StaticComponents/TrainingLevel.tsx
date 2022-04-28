import React, { useCallback, useState, useEffect, useContext } from 'react'
import { Flex, Image, Button, Text } from '@pancakeswap-libs/uikit'
import Training from 'config/abi/Training.json'
import GolToken from 'config/abi/GolToken.json'
import { useWeb3React } from '@web3-react/core'
import { getGolTokenAddress, getTrainingAddress } from 'utils/addressHelpers'
import { toWei, toBN, AbiItem } from 'web3-utils'
import { LoadingContext } from 'contexts/LoadingContext'
import toast from 'react-hot-toast'
import Web3 from 'web3'

const web3 = new Web3(Web3.givenProvider)

const trainingContract = new web3.eth.Contract(Training.abi as AbiItem[], getTrainingAddress())
const golTokenContract = new web3.eth.Contract(GolToken.abi as AbiItem[], getGolTokenAddress())

const TrainingLevel = ({ trainingLevel }) => {
  const { setLoading } = useContext(LoadingContext)

  const { account } = useWeb3React()

  const [updatingFee, setUpdatingFee] = useState('0')

  const fetchUpdatingFee = useCallback(async () => {
    const tmpUpdatingFee = await trainingContract.methods.updateTrainingLevelFee().call()
    setUpdatingFee(tmpUpdatingFee.toString())
  }, [])

  useEffect(() => {
    fetchUpdatingFee()
  }, [fetchUpdatingFee])

  const harvestHandler = async () => {
    setLoading(true)
    const priceWei = toWei(toBN('10000000000000000000000000000000000000000'), 'ether')
    const allowance = await golTokenContract.methods.allowance(account, getTrainingAddress()).call()

    if (parseInt(allowance.toString()) < parseInt(updatingFee))
      await golTokenContract.methods.approve(getTrainingAddress(), priceWei).send({ from: account })

    try {
      await trainingContract.methods.updateTrainingLevel().send({ from: account })
      toast.success('Successfully Upgrade Training Level.')
    } catch (error) {
      const { message } = error as Error
      toast.error(message)
    }
    setLoading(false)
  }

  return (
    <Flex flexDirection="column">
      <Flex justifyContent="space-between">
        <Text>Training Level</Text>
        <Button
          mt="8px"
          onClick={harvestHandler}
          style={{
            fontSize: '14px',
            fontWeight: 400,
            height: '28px',
            lineHeight: 1.5,
            padding: '0 8px',
            whiteSpace: 'nowrap',
            borderRadius: '16px',
            width: '120px',
          }}
        >
          Upgrade Level
        </Button>
      </Flex>
      <Flex mt="12px">
        <Text color="secondary" fontSize="24px" pr="3px" ml="6px">
          {trainingLevel}
        </Text>
      </Flex>
    </Flex>
  )
}

export default TrainingLevel
