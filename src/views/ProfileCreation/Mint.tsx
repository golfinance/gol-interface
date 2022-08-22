import React, { useState, useEffect } from 'react'
import { formatUnits } from '@ethersproject/units'
import { Card, CardBody, Heading, Text } from 'gol-uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCake, useBunnyFactory } from 'hooks/useContract'
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
import SelectionCard from './SelectionCard'
import NextStepButton from './NextStepButton'
import useProfileCreation from './contexts/hook'
import { MINT_COST, STARTER_NFT_BUNNY_IDS } from './config'

interface MintNftData extends ApiSingleTokenData {
  bunnyId?: string
}

const Mint: React.FC = () => {
  const [selectedBunnyId, setSelectedBunnyId] = useState<string>('')
  const [starterNfts, setStarterNfts] = useState<MintNftData[]>([])
  const { actions, minimumCakeRequired, allowance } = useProfileCreation()
  const collections = useGetCollections()
  const { toastSuccess } = useToast()
  const dispatch = useAppDispatch()

  const { account } = useWeb3React()
  // FIXME: Hooks para llamar al contrato de Cake (GOL) y bunnyFactory (GolTeams)
  const cakeContract = useCake()
  const bunnyFactoryContract = useBunnyFactory()
  // END FIXME
  const { t } = useTranslation()
  const { balance: cakeBalance, fetchStatus } = useGetCakeBalance()
  // FIXME: Put HasMiniumCakeRequired on True
  // const hasMinimumCakeRequired = fetchStatus === FetchStatus.SUCCESS && cakeBalance.gte(MINT_COST)
  // console.log('hasMiniumCakeRequired: ', hasMinimumCakeRequired)
  const hasMinimumCakeRequired = true;
  // END FIXME
  const { callWithGasPrice } = useCallWithGasPrice()

  useEffect(() => {
    // FIXME: Simulo la respuesta de la API
    // const getStarterNfts = async () => {
    //   const { data: allPbTokens } = await getNftsFromCollectionApi(pancakeBunniesAddress)

    //   console.log('allPbTokens', allPbTokens);

    //   const nfts = STARTER_NFT_BUNNY_IDS.map((bunnyId) => {
    //     if (allPbTokens && allPbTokens[bunnyId]) {
    //       return { ...allPbTokens[bunnyId], bunnyId }
    //     }
    //     return undefined
    //   })

    //   console.log('filtered nfts', nfts)
    //   setStarterNfts(nfts)
    // }

    // if (starterNfts.length === 0) {
    //   getStarterNfts()
    // }

    setStarterNfts(golStarterTeams);

  }, [])

  const { isApproving, isApproved, isConfirmed, isConfirming, handleApprove, handleConfirm } =
    useApproveConfirmTransaction({
      onRequiresApproval: async () => {
        // TODO: Move this to a helper, this check will be probably be used many times
        try {
          // FIXME: Logging Approval Request
          console.log('Approving Cake Spend')
          const response = await cakeContract.allowance(account, bunnyFactoryContract.address)
          console.log('response: ', response)
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
        {t('Get Starter Collectible')}
      </Heading>
      <Text as="p">{t('Every profile starts by making a “starter” collectible (NFT).')}</Text>
      <Text as="p">{t('This starter will also become your first profile picture.')}</Text>
      <Text as="p" mb="24px">
        {t('You can change your profile pic later if you get another approved Pancake Collectible.')}
      </Text>
      <Card mb="24px">
        <CardBody>
          <Heading as="h4" scale="lg" mb="8px">
            {t('Choose your Starter!')}
          </Heading>
          <Text as="p" color="textSubtle">
            {t('Choose wisely: you can only ever make one starter collectible!')}
          </Text>
          <Text as="p" mb="24px" color="textSubtle">
            {t('Cost: %num% GOL', { num: formatUnits(MINT_COST) })}
          </Text>
          {starterNfts.map((nft) => {
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
          })}
          {!hasMinimumCakeRequired && (
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
        </CardBody>
      </Card>
      <NextStepButton onClick={actions.nextStep} disabled={!isConfirmed}>
        {t('Next Step')}
      </NextStepButton>
    </>
  )
}

export default Mint
