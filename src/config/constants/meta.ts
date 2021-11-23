import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'GolSwap',
  description:
    'The next generation AMM on BSC by user count! Earn GOL through yield farming or win it in the Lottery, then stake it in $gol Pools to earn more tokens!.',
  image: 'https://gol.finance/images/hero.png',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  let basePath
  if (path.startsWith('/swap')) {
    basePath = '/swap'
  } else if (path.startsWith('/add')) {
    basePath = '/add'
  } else if (path.startsWith('/remove')) {
    basePath = '/remove'
  } else if (path.startsWith('/teams')) {
    basePath = '/teams'
  } else if (path.startsWith('/voting/proposal') && path !== '/voting/proposal/create') {
    basePath = '/voting/proposal'
  } else if (path.startsWith('/nfts/collections')) {
    basePath = '/nfts/collections'
  } else if (path.startsWith('/nfts/profile')) {
    basePath = '/nfts/profile'
  } else {
    basePath = path
  }

  switch (basePath) {
    case '/':
      return {
        title: `${t('Home')} | ${t('GolSwap')}`,
      }
    case '/swap':
      return {
        title: `${t('Exchange')} | ${t('GolSwap')}`,
      }
    case '/add':
      return {
        title: `${t('Add Liquidity')} | ${t('GolSwap')}`,
      }
    case '/remove':
      return {
        title: `${t('Remove Liquidity')} | ${t('GolSwap')}`,
      }
    case '/liquidity':
      return {
        title: `${t('Liquidity')} | ${t('GolSwap')}`,
      }
    case '/find':
      return {
        title: `${t('Import Pool')} | ${t('GolSwap')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('GolSwap')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('GolSwap')}`,
      }
    case '/prediction/leaderboard':
      return {
        title: `${t('Leaderboard')} | ${t('GolSwap')}`,
      }
    case '/farms':
      return {
        title: `${t('Fields')} | ${t('GolSwap')}`,
      }
    case '/farms/auction':
      return {
        title: `${t('Farm Auctions')} | ${t('GolSwap')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('GolSwap')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('GolSwap')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('GolSwap')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('GolSwap')}`,
      }
    case '/voting':
      return {
        title: `${t('Voting')} | ${t('GolSwap')}`,
      }
    case '/voting/proposal':
      return {
        title: `${t('Proposals')} | ${t('GolSwap')}`,
      }
    case '/voting/proposal/create':
      return {
        title: `${t('Make a Proposal')} | ${t('GolSwap')}`,
      }
    case '/info':
      return {
        title: `${t('Overview')} | ${t('GolSwap Info & Analytics')}`,
        description: 'View statistics for Golswap exchanges.',
      }
    case '/info/pools':
      return {
        title: `${t('Pools')} | ${t('GolSwap Info & Analytics')}`,
        description: 'View statistics for Golswap exchanges.',
      }
    case '/info/tokens':
      return {
        title: `${t('Tokens')} | ${t('GolSwap Info & Analytics')}`,
        description: 'View statistics for Golswap exchanges.',
      }
    case '/nfts':
      return {
        title: `${t('Overview')} | ${t('GolSwap')}`,
      }
    case '/nfts/collections':
      return {
        title: `${t('Collections')} | ${t('GolSwap')}`,
      }
    case '/nfts/profile':
      return {
        title: `${t('Your Profile')} | ${t('GolSwap')}`,
      }
    default:
      return null
  }
}
