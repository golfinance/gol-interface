export const GRAPH_API_PROFILE = process.env.REACT_APP_GRAPH_API_PROFILE
export const GRAPH_API_PREDICTION = process.env.REACT_APP_GRAPH_API_PREDICTION
export const GRAPH_API_LOTTERY = process.env.REACT_APP_GRAPH_API_LOTTERY
export const SNAPSHOT_VOTING_API = process.env.REACT_APP_SNAPSHOT_VOTING_API
export const SNAPSHOT_BASE_URL = process.env.REACT_APP_SNAPSHOT_BASE_URL
// export const API_PROFILE = process.env.REACT_APP_API_PROFILE
// export const API_NFT = process.env.REACT_APP_API_NFT

export const SNAPSHOT_API = `${SNAPSHOT_BASE_URL}/graphql`
export const SNAPSHOT_HUB_API = `${SNAPSHOT_BASE_URL}/api/message`
export const BITQUERY_API = 'https://graphql.bitquery.io'

// Profile Related 2022 - Testing
// export const API_PROFILE = 'https://api.thegraph.com/subgraphs/name/pancakeswap/profile'
// export const API_PROFILE = 'https://profile.pancakeswap.com'
export const API_PROFILE = 'https://gol-profile-api.vercel.app'

export const API_NFT = 'https://nft.pancakeswap.com/api/v1'
export const GRAPH_API_NFTMARKET = 'https://api.thegraph.com/subgraphs/name/pancakeswap/nft-market'

/**
 * V1 will be deprecated but is still used to claim old rounds
 */
export const GRAPH_API_PREDICTION_V1 = 'https://api.thegraph.com/subgraphs/name/pancakeswap/prediction'

/**
 * subgrafico de pancake de volumen y liquidez
 * export const INFO_CLIENT = 'https://bsc.streamingfast.io/subgraphs/name/pancakeswap/exchange-v2'
*/

/**
 * subgrafico de gol finance de volumen y liquidez
 */
// export const INFO_CLIENT = 'https://api.thegraph.com/subgraphs/name/golfinance/gol-exchange'
export const INFO_CLIENT = 'https://api.thegraph.com/subgraphs/name/topospec/genesystest';
export const BLOCKS_CLIENT = 'https://api.thegraph.com/subgraphs/name/pancakeswap/blocks'
// export const GRAPH_API_NFTMARKET = process.env.REACT_APP_GRAPH_API_NFT_MARKET
