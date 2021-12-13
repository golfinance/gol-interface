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
    label: t('Analytics'),
    icon: 'info',
    href: '/info',
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
