import React, { useState, useEffect, useMemo } from 'react'
import { formatUnits } from '@ethersproject/units'
import { Card, CardBody, Heading, Text } from 'gol-uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCake, useBunnyFactory, useGolNfp } from 'hooks/useContract'
import { FetchStatus, useGetCakeBalance } from 'hooks/useTokenBalance'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import ApproveConfirmButtons from 'components/ApproveConfirmButtons'
import useToast from 'hooks/useToast'
import { useAppDispatch } from 'state'
import { fetchUserNfts } from 'state/nftMarket/reducer'
import { useGetCollections } from 'state/nftMarket/hooks'
import { getNftsFromCollectionApi } from 'state/nftMarket/helpers'
import { ApiSingleTokenData } from 'state/nftMarket/types'
import { pancakeBunniesAddress } from 'views/Nft/market/constants'
import { golStarterTeams } from 'config/constants/nftsCollections/golStarterTeams'
import Web3 from 'web3'
import NonFungiblePlayer from 'config/abi/NonFungiblePlayer.json'
import { AbiItem } from 'web3-utils'
import { getPancakeProfileAddress, getNonFungiblePlayerAddress } from 'utils/addressHelpers'
import SelectionCard from './SelectionCard'
import NextStepButton from './NextStepButton'
import useProfileCreation from './contexts/hook'
import { MINT_COST, STARTER_NFT_BUNNY_IDS } from './config'

interface MintNftData extends ApiSingleTokenData {
  bunnyId?: string
}

const web3 = new Web3(Web3.givenProvider)

const Mint: React.FC = () => {
  const [selectedBunnyId, setSelectedBunnyId] = useState<string>('')
  const [starterNfts, setStarterNfts] = useState<MintNftData[]>([])
  const { actions, minimumCakeRequired, allowance } = useProfileCreation()
  const collections = useGetCollections()
  const { toastSuccess } = useToast()
  const dispatch = useAppDispatch()

  // Variables to check if user has Gol NFPs
  const [hasNfp, setHasNfp] = useState(null);
  const [nfpBalance, setNfpBalance] = useState(null);
  const [isLoadingNfps, setIsLoadingNfps] = useState(true);
  // Save the user account
  const { account } = useWeb3React()
  // Hooks para llamar al contrato de Cake (GOL) y bunnyFactory (GolTeams)
  const cakeContract = useCake()
  const bunnyFactoryContract = useBunnyFactory()
  // Translations
  const { t } = useTranslation()
  // Hooks to check if user has enough GOL
  const { balance: cakeBalance, fetchStatus } = useGetCakeBalance()
  const hasMinimumCakeRequired = true;
  
  const { callWithGasPrice } = useCallWithGasPrice()

  useEffect(() => {
    // Setting starter NFTs
    setStarterNfts(golStarterTeams);
  }, [])

  // Hook to use GolNfps Contract
  const customContract = useGolNfp();
  const nfpContract = useMemo(() => {
    return new web3.eth.Contract(NonFungiblePlayer.abi as AbiItem[], getNonFungiblePlayerAddress())
  }, [])

  // To get balance of GolNfp and allow user to mint profile:
  const getBalanceOfCustomNft = async () => {
    // Function to replace the original PCS useUserNft hook
    const balanceOfResponse = await customContract.balanceOf(account);
    const balanceOf = await balanceOfResponse.toNumber();
    const nfpTokens = await nfpContract.methods.fetchMyNfts().call({ from: account })
    // console.log('my nfp tokens: ', nfpTokens)
    console.log('GolNfpBalance: ', balanceOf)
    if (balanceOf === 0) {
      setHasNfp(false);
      setIsLoadingNfps(false);
    } else {
      setNfpBalance(balanceOf);
      setHasNfp(true);
      setIsLoadingNfps(false);
    }
  }

  // Calling the method to check is able to mint profile depening on GOL NFPs
  getBalanceOfCustomNft();

  const { isApproving, isApproved, isConfirmed, isConfirming, handleApprove, handleConfirm } =
    useApproveConfirmTransaction({
      onRequiresApproval: async () => {
        // TODO: Move this to a helper, this check will be probably be used many times
        try {
          // FIXME: Logging Approval Request
          const response = await cakeContract.allowance(account, bunnyFactoryContract.address)
          // console.log('response: ', response)
          return response.gte(minimumCakeRequired)
        } catch (error) {
          return false
        }
      },
      onApprove: () => {
        return callWithGasPrice(cakeContract, 'approve', [bunnyFactoryContract.address, allowance.toString()])
      },
      onConfirm: () => {
        return callWithGasPrice(bunnyFactoryContract, 'mintNFT', [selectedBunnyId])
      },
      onApproveSuccess: () => {
        toastSuccess('Enabled', "Press 'confirm' to mint this NFT")
      },
      onSuccess: () => {
        toastSuccess('Success', 'You have minted your starter NFT')
        dispatch(fetchUserNfts({ account, collections }))
        actions.nextStep()
      },
    })

  return (
    <>
      <Text fontSize="20px" color="textSubtle" bold>
        {t('Step %num%', { num: 1 })}
      </Text>
      <Heading as="h3" scale="xl" mb="24px">
        {/* {t('Get Starter Collectible')} */}
        Get your Non Fungible Player
      </Heading>
      {/* <Text as="p">{t('Every profile starts by making a “starter” collectible (NFT).')}</Text> */}
      <Text as="p">Every profile starts by buying a Non Fungible Player (NFP).</Text>
      {/* <Text as="p">{t('This starter will also become your first profile picture.')}</Text> */}
      <Text as="p">This NFP will also become your first profile picture.</Text>
      {/* <Text as="p" mb="24px">
        {t('You can change your profile pic later if you get another approved Pancake Collectible.')}
      </Text> */}
      <Text as="p" mb="24px">
        You can change your profile pic later if you get another approved Gol NFP Collectible.
      </Text>
      <Card mb="24px">
        <CardBody>
          <Heading as="h4" scale="lg" mb="8px">
            Your NFP status:
            {/* {t('Choose your Starter!')} */}
          </Heading>

          {hasNfp ? <>
            <Text as="p" color="textSubtle">
              Good news! You have {nfpBalance} valid NFPs in your wallet!
            </Text>
            <Text as="p" color="textSubtle">
              Click on &apos; Next Step &apos; button below to continue.
            </Text>
          </> : <>
            <Text as="p" color="textSubtle">
              You don&apos;t have any valid NFP in your wallet.
            </Text>
            <Text as="p" color="textSubtle">
              Please, go to the NFT Marketplace and buy a NFP Box to start!
            </Text>
          </>}
          {/* {t('Choose wisely: you can only ever make one starter collectible!')} */}
          <Text as="p" mb="24px" color="textSubtle">
            {/* {t('Cost: %num% GOL', { num: formatUnits(MINT_COST) })} */}
            Cost: 100 GOL
          </Text>

          {/* {starterNfts.map((nft) => {
            const handleChange = (value: string) => setSelectedBunnyId(value)

            return (
              <SelectionCard
                key={nft?.name}
                name="mintStarter"
                value={nft?.bunnyId}
                image={nft?.image.thumbnail}
                isChecked={selectedBunnyId === nft?.bunnyId}
                onChange={handleChange}
                disabled={isApproving || isConfirming || isConfirmed || !hasMinimumCakeRequired}
              >
                <Text bold>{nft?.name}</Text>
              </SelectionCard>
            )
          })} */}


          {/* {!hasMinimumCakeRequired && (
            <Text color="failure" mb="16px">
              {t('A minimum of %num% GOL is required', { num: formatUnits(MINT_COST) })}
            </Text>
          )}
          <ApproveConfirmButtons
            isApproveDisabled={selectedBunnyId === null || isConfirmed || isConfirming || isApproved}
            isApproving={isApproving}
            isConfirmDisabled={!isApproved || isConfirmed || !hasMinimumCakeRequired}
            isConfirming={isConfirming}
            onApprove={handleApprove}
            onConfirm={handleConfirm}
          />
           */}
        </CardBody>
      </Card>
      {/* Modified Next Step Button */}
      <NextStepButton 
        onClick={actions.nextStep} 
        // disabled={!isConfirmed}
        disabled={!hasNfp}
        >
        {t('Next Step')}
      </NextStepButton>
    </>
  )
}

export default Mint
