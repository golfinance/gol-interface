import { MenuItemsType, DropdownMenuItemType } from 'gol-uikit'
import { ContextApi } from 'contexts/Localization/types'
// import { nftsBaseUrl } from 'views/Nft/market/constants'

export type ConfigMenuItemsType = MenuItemsType & { hideSubNav?: boolean }

const config: (t: ContextApi['t']) => ConfigMenuItemsType[] = (t) => [
  {
    label: t('GolSwap'),
    icon: 'Swap',
    href: '/swap',
    showItemsOnMobile: false,
    items: [
      {
        label: t('Exchange'),
        href: '/swap',
      },
      {
        label: t('Liquidity'),
        href: '/liquidity',
      },
    ],
  },
  {
    label: t('GolFarm'),
    href: '/farms',
    icon: 'Earn',
    items: [
      {
        label: t('Fields'),
        href: '/farms',
      },
      {
        label: t('Pools'),
        href: '/pools',
      }
    ],
  },
  {
    label: t('Marketplace'),
    href: '/nft-marketplace',
    icon: 'Earn',
    showItemsOnMobile: false,
    showOnMobile: true,
    items: [],
  },
  {
    label: t('NFT Staking'),
    href: '/nft-staking/2',
    icon: 'Earn',
    showItemsOnMobile: false,
    showOnMobile: true,
    items:[]
    // items: [
    //   {
    //     label: t('NonFungiblePlayer'),
    //     href: '/nft-staking/1'
    //   },
    //   {
    //     label: t('Genesis'),
    //     href: '/nft-staking/2'
    //   },
    // ]
  },
  {
    label: t('Analytics'),
    icon: 'Info',
    href: '/info',
    showItemsOnMobile: false,
    showOnMobile: true,
    items: [],
  },
  // {
  //   label: t('Win'),
  //   href: '/prediction',
  //   icon: 'Trophy',
  //   items: [
  //     {
  //       label: t('Prediction (BETA)'),
  //       href: '/prediction',
  //     },
  //     {
  //       label: t('Lottery'),
  //       href: '/lottery',
  //     },
  //   ],
  // },
  // {
  //   label: t('NFT'),
  //   href: `${nftsBaseUrl}`,
  //   icon: 'Nft',
  //   items: [
  //     {
  //       label: t('Overview'),
  //       href: `${nftsBaseUrl}`,
  //       status: {
  //         text: t('Live'),
  //         color: 'failure',
  //       },
  //     },
  //     {
  //       label: t('Collections'),
  //       href: `${nftsBaseUrl}/collections`,
  //     },
  //   ],
  // },
  {
    label: '',
    href: '',
    icon: 'More',
    hideSubNav: true,
    items: [
      // {
      //   label: t('Info'),
      //   href: '/info',
      // },
      // {
      //   label: t('IFO'),
      //   href: '/ifo',
      // },
      // {
      //   label: t('Voting'),
      //   href: '/voting',
      // },
      // {
      //   type: DropdownMenuItemType.DIVIDER,
      // },
      // {
      //   label: t('Leaderboard'),
      //   href: '/teams',
      // },
      // {
      //   type: DropdownMenuItemType.DIVIDER,
      // },
      {
        label: t('Blog'),
        href: 'https://medium.com/@gol.finance',
        type: DropdownMenuItemType.EXTERNAL_LINK,
      },
      {
        label: t('Docs'),
        href: 'https://golfinance.gitbook.io/',
        type: DropdownMenuItemType.EXTERNAL_LINK,
      },
    ],
  },
]

export default config
