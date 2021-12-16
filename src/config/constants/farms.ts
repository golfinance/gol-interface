import { serializeTokens } from './tokens'
import { SerializedFarmConfig } from './types'

const serializedTokens = serializeTokens()

const farms: SerializedFarmConfig[] = [
  /**
   * These 3 farms (PID 0, 251, 252) should always be at the top of the file.
   */
   {
    pid: 11,
    lpSymbol: 'GOL', // CAKE = PID 0
    lpAddresses: {
      97: '',
      56: '0x52f6a03a53840c01470f33a0b016e4c3e3dfe796',
    },
    token: serializedTokens.gol,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 0,
    lpSymbol: 'GOL-BNB LP', // CAKE-BNB = (251)
    lpAddresses: {
      97: '',
      56: '0x813f158efa2f375e1d82c92208c8727b03f05d62',
    },
    token: serializedTokens.gol,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 3,
    lpSymbol: 'BUSD-BNB LP', // BUSD-BNB = (252)
    lpAddresses: {
      97: '',
      56: '0xc5b252caf7435080d0ba04df2683d710a4d994a0',
    },
    token: serializedTokens.busd,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 2,
    lpSymbol: 'GOL-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xef1d3deceb43d85d84842032d404ade23eb31b1d', 
    },
    token: serializedTokens.gol,
    quoteToken: serializedTokens.busd,
  },
  {
    pid: 1,
    lpSymbol: 'GOL-USDT LP',
    lpAddresses: {
      97: '',
      56: '0xed32931ed14c971de14c596c79e38683a03efdbc', 
    },
    token: serializedTokens.gol,
    quoteToken: serializedTokens.usdt,
  },
  {
    pid: 4,
    lpSymbol: 'USDT-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xea3664f0c34645908b2669e3e84defc55d086d2b',
    },
    token: serializedTokens.usdt,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 5,
    lpSymbol: 'USDT-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x8afd4b199e25a8f19a814a8379aca3137ce691de',
    },
    token: serializedTokens.usdt,
    quoteToken: serializedTokens.busd,
  },
  {
    pid: 6,
    lpSymbol: 'ETH-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x88121b54d701910e0c8b79898399b037eb82e480',
    },
    token: serializedTokens.eth,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 7,
    lpSymbol: 'BTCB-ETH LP',
    lpAddresses: {
      97: '',
      56: '0x8c552845e58d608af7f792f73efea0333b7a6f0e',
    },
    token: serializedTokens.btcb,
    quoteToken: serializedTokens.eth,
  },
  {
    pid: 8,
    lpSymbol: 'BTCB-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x6ff29b32caeab5800e30134a001b08c212433c63',
    },
    token: serializedTokens.btcb,
    quoteToken: serializedTokens.busd,
  },
  {
    pid: 9,
    lpSymbol: 'CAKE-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xe6d911fe0059d0be11cda2dbf46e92ccc3309f0e',
    },
    token: serializedTokens.cake,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 10,
    lpSymbol: 'bCFX-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x4a444ea8a23fe97fa8c74b8053e7ae92cb698693',
    },
    token: serializedTokens.bcfx,
    quoteToken: serializedTokens.wbnb,
  },
  { 
    pid: 12,
    lpSymbol: 'GOL-MILK LP',
    lpAddresses: {
      97: '',
      56: '0xc24f9a0c79b9418410eb9b67a7a4706c5d42e4ec',
    },
    token: serializedTokens.gol,
    quoteToken: serializedTokens.milk,
    isCommunity: true,
},
{
    pid: 13,
    lpSymbol: 'MILK-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x246cbb99d05e48102370770cef165c7bb2cb6d7e',
    },
    token: serializedTokens.milk,
    quoteToken: serializedTokens.busd,
    isCommunity: true,
  },
  {
    pid: 14,
    lpSymbol: 'GOL-bFLUX LP',
    lpAddresses: {
      97: '',
      56: '0x41bbb75618e94e22b66fa45fdee196de058b3fe5',
    },
    token: serializedTokens.gol,
    quoteToken: serializedTokens.bflux,
    isCommunity: true,
  },
  {
    pid: 15,
    lpSymbol: 'bFLUX-USDT LP',
    lpAddresses: {
      97: '',
      56: '0xf0044d21a0d29692fbdb67e14ff4dcc5bbed86f2',
    },
    token: serializedTokens.bflux,
    quoteToken: serializedTokens.usdt,
    isCommunity: true,
  },

  {
    pid: 16,
    lpSymbol: 'MILK-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xc3f91f5958d874cd1ce46a98c54088cbdd8d9188',
    },
    token: serializedTokens.milk,
    quoteToken: serializedTokens.wbnb,
    isCommunity: true,
  },

]

export default farms
