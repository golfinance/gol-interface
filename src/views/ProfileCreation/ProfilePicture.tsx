import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import { AutoRenewIcon, Button, Card, CardBody, Heading, Text } from 'gol-uikit'
import { useWeb3React } from '@web3-react/core'
import { Link as RouterLink } from 'react-router-dom'
import { getPancakeProfileAddress } from 'utils/addressHelpers'
import { getErc721Contract } from 'utils/contractHelpers'
import { useTranslation } from 'contexts/Localization'
import { useUserNfts } from 'state/nftMarket/hooks'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useFetchUserNfts from 'views/Nft/market/Profile/hooks/useFetchUserNfts'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import { UserNftInitializationState } from 'state/nftMarket/types'
import { golProfilePictures } from 'config/constants/nftsCollections/golProfilePictures'
import SelectionCard from './SelectionCard'
import NextStepButton from './NextStepButton'
import { ProfileCreationContext } from './contexts/ProfileCreationProvider'

const Link = styled(RouterLink)`
  color: ${({ theme }) => theme.colors.primary};
`

const NftWrapper = styled.div`
  margin-bottom: 24px;
`

const ProfilePicture: React.FC = () => {
  const { library, account } = useWeb3React()
  const [isApproved, setIsApproved] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const { selectedNft, actions } = useContext(ProfileCreationContext)

  // const { nfts, userNftsInitializationState } = useUserNfts()

  // const nfts = [
  //   {
  //     "tokenId": "0",
  //     "name": "Tiger Warriors: 7",
  //     "description": "Tiger Warriors are Planet ZUUD's first limited edition 2222 count fully hand-drawn collection on the BNB Chain.",
  //     "collectionName": "Bitpunks",
  //     "collectionAddress": "0x742466914848c6AB0e7AD36Acd1e4fbf4ee773b1",
  //     "image": {
  //       "original": "https://static-nft.pancakeswap.com/mainnet/0xa61da6E5B8F61285d46C2ED65eBE0E7c2FA27044/tiger-warriors-7.png",
  //       "thumbnail": "https://static-nft.pancakeswap.com/mainnet/0xa61da6E5B8F61285d46C2ED65eBE0E7c2FA27044/tiger-warriors-7-1000.png",
  //       "mp4": null,
  //       "webm": null,
  //       "gif": null
  //     },
  //     "attributes": [
  //       {
  //         "traitType": "Weapon",
  //         "value": "None"
  //       },
  //       {
  //         "traitType": "Necklace",
  //         "value": "None"
  //       },
  //       {
  //         "traitType": "Mouth",
  //         "value": "None"
  //       },
  //       {
  //         "traitType": "Eye",
  //         "value": "Green"
  //       },
  //       {
  //         "traitType": "Head",
  //         "value": "None"
  //       },
  //       {
  //         "traitType": "Earing",
  //         "value": "None"
  //       },
  //       {
  //         "traitType": "Background",
  //         "value": "Cider"
  //       },
  //       {
  //         "traitType": "Body",
  //         "value": "Magma"
  //       },
  //       {
  //         "traitType": "Cloth",
  //         "value": "Gladiator"
  //       }
  //     ],
  //     "collection": {
  //       "name": "Planet ZUUD: Tiger Warriors"
  //     }
  //   },
  // ];

  const nfts = golProfilePictures;

  const userNftsInitializationState = 'INITIALIZED';

  useFetchUserNfts(account)

  console.log('fetching nfts ', nfts)

  const { t } = useTranslation()
  const { toastError, toastSuccess } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()

  const handleApprove = async () => {
    console.log('Approving')
    console.log('selectedNft: ', selectedNft)
    console.log('signer: ', library.getSigner())
    
    const contract = getErc721Contract(selectedNft.collectionAddress, library.getSigner())
    // const contract = selectedNft.collectionAddress;

    console.log('Contract: ', contract)

    const tx = await callWithGasPrice(contract, 'approve', [getPancakeProfileAddress(), selectedNft.tokenId])
    setIsApproving(true)
    const receipt = await tx.wait()
    if (receipt.status) {
      toastSuccess(t('Enabled'), t('Please progress to the next step.'))
      setIsApproving(false)
      setIsApproved(true)
    } else {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      setIsApproving(false)
    }
  }

  if (nfts.length === 0 && userNftsInitializationState === UserNftInitializationState.INITIALIZED) {
    return (
      <>
        <Heading scale="xl" mb="24px">
          {t('Oops!')}
        </Heading>
        <Text bold fontSize="20px" mb="24px">
          {t('We couldn’t find any Pancake Collectibles in your wallet.')}
        </Text>
        <Text as="p">
          {t(
            'You need a Pancake Collectible to finish setting up your profile. If you sold or transferred your starter collectible to another wallet, you’ll need to get it back or acquire a new one somehow. You can’t make a new starter with this wallet address.',
          )}
        </Text>
      </>
    )
  }

  return (
    <>
      <Text fontSize="20px" color="textSubtle" bold>
        {t('Step %num%', { num: 2 })}
      </Text>
      <Heading as="h3" scale="xl" mb="24px">
        {t('Set Profile Picture')}
      </Heading>
      <Card mb="24px">
        <CardBody>
          <Heading as="h4" scale="lg" mb="8px">
            {t('Choose collectible')}
          </Heading>
          <Text as="p" color="textSubtle">
            {t('Choose a profile picture from the eligible collectibles (NFT) in your wallet, shown below.')}
          </Text>
          <Text as="p" color="textSubtle" mb="24px">
            {t('Only approved Pancake Collectibles can be used.')}
            <Link to={`${nftsBaseUrl}/collections`} style={{ marginLeft: '4px' }}>
              {t('See the list >')}
            </Link>
          </Text>
          <NftWrapper>
            {nfts.map((walletNft) => {
              const firstTokenId = nfts[0].tokenId
              return (
                <SelectionCard
                  name="profilePicture"
                  key={walletNft.tokenId}
                  value={firstTokenId}
                  image={walletNft.image.thumbnail}
                  isChecked={firstTokenId === selectedNft.tokenId}
                  onChange={(value: string) => actions.setSelectedNft(value, walletNft.collectionAddress)}
                // onChange={(value: string) => console.log('picked: ', value)}
                >
                  <Text bold>{walletNft.name}</Text>
                </SelectionCard>
              )
            })}
          </NftWrapper>
          <Heading as="h4" scale="lg" mb="8px">
            {t('Allow collectible to be locked')}
          </Heading>
          <Text as="p" color="textSubtle" mb="16px">
            {t(
              "The collectible you've chosen will be locked in a smart contract while it’s being used as your profile picture. Don't worry - you'll be able to get it back at any time.",
            )}
          </Text>
          <Button
            isLoading={isApproving}
            disabled={isApproved || isApproving || selectedNft.tokenId === null}
            onClick={handleApprove}
            endIcon={isApproving ? <AutoRenewIcon spin color="currentColor" /> : undefined}
            id="approveStarterCollectible"
          >
            {t('Enable')}
          </Button>
        </CardBody>
      </Card>
      <NextStepButton onClick={actions.nextStep} disabled={selectedNft.tokenId === null || !isApproved || isApproving}>
        {t('Next Step')}
      </NextStepButton>
    </>
  )
}

export default ProfilePicture
