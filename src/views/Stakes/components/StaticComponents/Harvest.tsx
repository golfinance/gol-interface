import _ from 'lodash'
import React, { useContext } from 'react'
import { Flex, Image, Text, Button } from '@pancakeswap-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import { getNonFungiblePlayerAddress, getStakingAddress, getAirNftAddress } from 'utils/addressHelpers'
import NonFungiblePlayer from 'config/abi/NonFungiblePlayer.json'
import Staking from 'config/abi/Staking.json'
import AirNfts from 'config/abi/Genesis.json'
import toast from 'react-hot-toast'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { LoadingContext } from 'contexts/LoadingContext'
import { StakeContext } from 'contexts/StakeContext'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import airNFTs from 'config/constants/airnfts'
import { getNumberSuffix } from 'utils/formatBalance'

const web3 = new Web3(Web3.givenProvider)

const nfpContract = new web3.eth.Contract(NonFungiblePlayer.abi as AbiItem[], getNonFungiblePlayerAddress())
const airnftContract = new web3.eth.Contract(AirNfts.abi as AbiItem[], getAirNftAddress())
const stakingContract = new web3.eth.Contract(Staking.abi as AbiItem[], getStakingAddress())

const Harvet = ({ rewardAllGol, index }) => {
  const { account } = useWeb3React()
  const { setLoading } = useContext(LoadingContext)
  const { initMyNFTS, initSelectedNFTs } = useContext(StakeContext)
  const cakePriceUsd = usePriceCakeBusd()

  const harvestHandler = async () => {
    setLoading(true)

    let poolId;

    if (index === "1") {
      poolId = await stakingContract.methods.poolIdOfContract(getNonFungiblePlayerAddress()).call();
    } else if (index === "2") {
      poolId = await stakingContract.methods.poolIdOfContract(getAirNftAddress()).call();
    }

    try {
      await stakingContract.methods.harvest(poolId).send({ from: account })
      toast.success('Successfully Harvest For All NFT.')
    } catch (error) {
      const { message } = error as Error
      toast.error(message)
    }

    const tmpStakingItems = await stakingContract.methods.getStakedItems(account).call()
    const stakingItems = []
    for (let i = 0; i < tmpStakingItems.length; i++) {
      if (index === '1' && tmpStakingItems[i].contractAddress === getNonFungiblePlayerAddress())
        stakingItems.push(tmpStakingItems[i])
      else if (index === '2' && tmpStakingItems[i].contractAddress === getAirNftAddress())
        stakingItems.push(tmpStakingItems[i])
    }

    initSelectedNFTs(stakingItems)

    // Init My NFTs again

    const tokenIds = []
    const tmpMyTokens = []
    if (index === '1') {
      const nfpTokens = await nfpContract.methods.fetchMyNfts().call({ from: account })

      _.map(nfpTokens, (itm) => {
        tokenIds.push({ tokenId: itm, isAIR: false })
      })
    }

    // retrieve my nft from air
    else {
      const airNftOwners = []
      _.map(airNFTs, (nft) => {
        airNftOwners.push(airnftContract.methods.ownerOf(nft).call())
      })
      const owners = await Promise.all(airNftOwners)
      _.map(owners, (owner, idx) => {
        if (owner.toLowerCase() !== account.toLowerCase()) return
        tokenIds.push({ tokenId: airNFTs[idx], isAIR: true })
      })
    }

    const myTokenHashes = []
    for (let i = 0; i < tokenIds.length; i++) {
      if (!tokenIds[i].isAIR) myTokenHashes.push(nfpContract.methods.tokenURI(tokenIds[i].tokenId).call())
      else myTokenHashes.push(airnftContract.methods.tokenURI(tokenIds[i].tokenId).call())
    }
    const result = await Promise.all(myTokenHashes)

    for (let i = 0; i < tokenIds.length; i++) {
      if (!tmpMyTokens[i]) tmpMyTokens[i] = {}
      tmpMyTokens[i].tokenId = tokenIds[i].tokenId
      tmpMyTokens[i].tokenHash = result[i]
      tmpMyTokens[i].isAIR = tokenIds[i].isAIR
      if (!tokenIds[i].isAIR) tmpMyTokens[i].contractAddress = getNonFungiblePlayerAddress()
      else tmpMyTokens[i].contractAddress = getAirNftAddress()
    }

    initMyNFTS(tmpMyTokens)

    setLoading(false)
  }
  return (
    <Flex flexDirection="column">
      <Flex justifyContent="space-between">
        <Text>Gol Earned</Text>
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
            width: '80px',
          }}
        >
          Harvest
        </Button>
      </Flex>
      <Flex mt="12px">
        <Image src="/images/favicon-32x32.png" alt="GolToken" width={32} height={32} />
        <Text color="secondary" fontSize="24px" pr="3px" ml="6px">
          {getNumberSuffix(rewardAllGol / 1000000, 3)}
        </Text>
        <Text textTransform="uppercase" color="textSubtle" fontSize="18px" style={{ lineHeight: 2 }}>
          {`≈ $${getNumberSuffix((cakePriceUsd.toNumber() * rewardAllGol) / 1000000, 3)}`}
        </Text>
      </Flex>
    </Flex>
  )
}

export default Harvet
