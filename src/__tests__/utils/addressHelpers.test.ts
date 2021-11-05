import { getAddress } from 'utils/addressHelpers'

describe('getAddress', () => {
  const address = {
    56: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82', // CakeToken
    97: '0xf4073d05dbe7de995e7b4762c1645519b0f5d609', // Contract MockCake??
  }

  it(`get address for mainnet (chainId 56)`, () => {
    process.env.REACT_APP_CHAIN_ID = '56'
    const expected = address[56]
    expect(getAddress(address)).toEqual(expected)
  })
  it(`get address for testnet (chainId 97)`, () => {
    process.env.REACT_APP_CHAIN_ID = '97'
    const expected = address[97]
    expect(getAddress(address)).toEqual(expected)
  })
  it(`get address for any other network (chainId 31337)`, () => {
    process.env.REACT_APP_CHAIN_ID = '31337'
    const expected = address[56]
    expect(getAddress(address)).toEqual(expected)
  })
})
