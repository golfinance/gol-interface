import { serializeTokens } from './tokens'
import { SerializedPoolConfig, PoolCategory } from './types'

const serializedTokens = serializeTokens()

const pools: SerializedPoolConfig[] = [
  {
    sousId: 11,
    stakingToken: serializedTokens.gol,
    earningToken: serializedTokens.gol,
    contractAddress: {
      97: '',
      56: '0x2F1281A9f84CF6f551dB39156D32A5D6153F25a5', // masterchef gol
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '0.0326557580096', // (11x0.287/100)=0.0326
    sortOrder: 1,
    isFinished: false,
  },
]

export default pools
