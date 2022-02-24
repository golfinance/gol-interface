import { SalesSectionProps } from '.'

export const swapSectionData: SalesSectionProps = {
  headingText: 'Invest in $GOL to win.',
  bodyText: 'Trade any token on Binance Smart Chain in seconds, just by connecting your wallet.',
  reverse: false,
  primaryButton: {
    to: '/swap',
    text: 'Trade Now',
    external: false,
  },
  secondaryButton: {
    to: 'https://https://golfinance.gitbook.io/golfinance/protocol/golfinance-v1/golswap',
    text: 'Learn',
    external: true,
  },
  images: {
    path: '/images/home/trade/',
    attributes: [
      // { src: 'BNB', alt: 'BNB token' },
      // { src: 'BTC', alt: 'BTC token' },
      { src: 'TOKENS', alt: 'GOL token' },
    ],
  },
}

export const earnSectionData: SalesSectionProps = {
  headingText: 'Earn passive income with crypto.',
  bodyText: 'GolToken is the core of the whole GolFinance ecosystem. Deflationary tokenomics, scarcity, buybacks (for redistribution and liquidity), burning are some of $GOL features, making it the core of the protocols incentive mechanisms..',
  reverse: true,
  primaryButton: {
    to: '/farms',
    text: 'Explore',
    external: false,
  },
  secondaryButton: {
    to: 'https://golfinance.gitbook.io/golfinance/protocol/goltoken',
    text: 'Learn',
    external: true,
  },
  images: {
    path: '/images/home/earn/',
    attributes: [
      // { src: 'pie', alt: 'Pie chart' },
      // { src: 'stonks', alt: 'Stocks chart' },
      { src: 'gol_token', alt: 'Gol Token' },
      // { src: 'folder', alt: 'Folder with cake token' },
    ],
  },
}

export const cakeSectionData: SalesSectionProps = {
  headingText: 'GOL makes our world go round.',
  bodyText:
    'GOL token is at the heart of the GolSwap ecosystem. Buy it, win it, farm it, spend it, stake it... heck, you can even vote with it!',
  reverse: false,
  primaryButton: {
    to: '/swap?outputCurrency=0x52f6a03a53840c01470f33a0b016e4c3e3dfe796',
    text: 'Buy GOL',
    external: false,
  },
  secondaryButton: {
    to: 'https://docs.pancakeswap.finance/tokenomics/cake',
    text: 'Learn',
    external: true,
  },

  images: {
    path: '/images/home/cake/',
    attributes: [
      { src: 'bottom-right', alt: 'Small 3d pancake' },
      { src: 'top-right', alt: 'Small 3d pancake' },
      { src: 'coin', alt: 'GOL token' },
      { src: 'top-left', alt: 'Small 3d pancake' },
    ],
  },
}
