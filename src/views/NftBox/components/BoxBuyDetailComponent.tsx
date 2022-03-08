import React, { useEffect, useState, useContext } from 'react'
import styled from 'styled-components'
import toast from 'react-hot-toast'
import { Button } from '@pancakeswap-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import NonFungiblePlayer from 'config/abi/NonFungiblePlayer.json'
import GolToken from 'config/abi/GolToken.json'
import { toWei, AbiItem, toBN } from 'web3-utils'
import { LoadingContext } from 'contexts/LoadingContext'
import { getNonFungiblePlayerAddress, getGolTokenAddress } from 'utils/addressHelpers'
import Web3 from 'web3'
import useTheme from 'hooks/useTheme'

const BoxTitle = styled.div`
  font-size: 28px;
  font-weight: 600;
  color: #431216;
  word-break: break-word;
`
const RemainingAmount = styled.div`
  font-size: 16px;
  color: #694f4e;
  margin-top: 24px;
  word-break: break-word;
`

const BoxPrice = styled.div`
  margin-top: 32px;
  border-radius: 16px;
  box-shadow: 0 6px 12px 0 rgb(0 0 0 / 6%), 0 -1px 2px 0 rgb(0 0 0 / 2%);
  display: flex;
`

const BoxPriceContainer = styled.div`
  padding: 16px;
  flex: 1;
`

const PriceDetailContainer = styled.div`
  font-size: 28px;
  color: #431216;
  font-weight: 700;
  margin-top: 6px;
  display: flex;
  align-items: center;
`

const BuyNowBtnContainer = styled.div`
  margin-top: 40px;
`

const BoxBuyDetailComponent = () => {
  const { setLoading } = useContext(LoadingContext)
  const { isDark } = useTheme()
  const { account } = useWeb3React()
  const [mintingState, setMintingState] = useState(true)
  const [mintedAmount, setMintedAmount] = useState(0)
  const [price, setPrice] = useState('0')

  /** Styles Div */

  /** Calling Smart Contract Function */

  useEffect(() => {
    const getTotalSupply = async () => {
      const web3 = new Web3(Web3.givenProvider)
      const nfpContract = new web3.eth.Contract(NonFungiblePlayer.abi as AbiItem[], getNonFungiblePlayerAddress())
      const amount = await nfpContract.methods.totalSupply().call()
      const tmpPrice = await nfpContract.methods.price().call()
      setPrice(tmpPrice)
      setMintedAmount(parseInt(amount))

      if (amount === 0) {
        setMintingState(false)
      }

      const currentBlockNumber = await web3.eth.getBlockNumber()
      const blockNumber = await nfpContract.methods.blockNumber().call()

      // if (currentBlockNumber < blockNumber) {
      //     setMintingState(false);
      // }
    }
    getTotalSupply()
  }, [account])

  const buyButtonHandler = async () => {
    setMintingState(false)
    setLoading(true)
    console.log('set loading')
    const priceWei = toWei(toBN('10000000000000000000000000000000000000000'), 'ether')
    const web3 = new Web3(Web3.givenProvider)
    const nfpContract = new web3.eth.Contract(NonFungiblePlayer.abi as AbiItem[], getNonFungiblePlayerAddress())
    const golTokenContract = new web3.eth.Contract(GolToken.abi as AbiItem[], getGolTokenAddress())
    const allowance = await golTokenContract.methods.allowance(account, getNonFungiblePlayerAddress()).call()
    if (parseInt(allowance.toString()) < parseInt(price))
      await golTokenContract.methods.approve(getNonFungiblePlayerAddress(), priceWei).send({ from: account })

    try {
      await nfpContract.methods
        .buyNFPBox()
        .send({ from: account })
        .on('transactionHash', function () {
          toast.success('Transaction submitted')
        })
        .on('receipt', function (receipt) {
          setMintedAmount((prev) => prev + 1)
          setMintingState(true)
          setLoading(false)
          toast.success('Mint succeed')
        })
    } catch (err: unknown) {
      setMintingState(true)
      setLoading(false)

      const { message } = err as Error
      toast.error(message)
    }
    // setMintingState(true);
  }

  return (
    <div>
      <BoxTitle style={{ color: isDark ? 'white' : '' }}>NonFungiblePlayer Box</BoxTitle>
      <RemainingAmount style={{ color: isDark ? 'white' : '' }}>
        Remaining Amount:{' '}
        <span style={{ fontSize: '18px', color: isDark ? 'white' : '#431216', fontWeight: 700 }}>
          {1000 - mintedAmount}
        </span>
      </RemainingAmount>
      <BoxPrice
        style={{
          background: isDark ? '#16151a' : '',
          boxShadow: isDark ? '0 6px 12px 0 rgb(255 255 255 / 6%), 0 -1px 2px 0 rgb(255 255 255 / 2%)' : '',
        }}
      >
        <BoxPriceContainer style={{ color: isDark ? 'white' : '' }}>
          Price
          <PriceDetailContainer style={{ color: isDark ? 'white' : '' }}>
            <img src="/images/farms/milk.png" alt="" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
            {price}
            <span
              style={{ fontSize: '14px', color: isDark ? 'white' : '#694f4e', fontWeight: 400, marginLeft: '4px' }}
            >{` ≈ $${Math.round(0 * parseInt(price) * 100) / 100}`}</span>
          </PriceDetailContainer>
        </BoxPriceContainer>
      </BoxPrice>
      <BuyNowBtnContainer>
        {account && mintingState === true ? (
          <div>
            <Button onClick={buyButtonHandler} style={{ width: 'calc(100% - 10px)', marginRight: '10px' }}>
              Mint
            </Button>
          </div>
        ) : (
          <Button style={{ width: '100%' }} disabled>
            Mint
          </Button>
        )}
      </BuyNowBtnContainer>
    </div>
  )
}

export default BoxBuyDetailComponent
