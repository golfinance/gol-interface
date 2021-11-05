import { FooterLinkType } from 'gol-uikit'
import { ContextApi } from 'contexts/Localization/types'

export const footerLinks: (t: ContextApi['t']) => FooterLinkType[] = (t) => [
  {
    label: t('About'),
    items: [
      {
        label: t('Contact'),
        href: 'https://golfinance.gitbook.io/golfinance/about-golfinance/contact-us',
      },
      {
        label: t('Blog'),
        href: 'https://medium.com/@gol.finance',
      },
      {
        label: t('Community'),
        href: 'https://golfinance.gitbook.io/golfinance/about-golfinance/contact-us/community-and-social-media',
      },
      {
        label: t('GolToken'),
        href: 'https://golfinance.gitbook.io/golfinance/protocol/golfinance-v1/goltoken/tokenomics',
      },
      // {
      //   label: '—',
      // },
      // {
      //   label: t('Online Store'),
      //   href: 'https://pancakeswap.creator-spring.com/',
      //   isHighlighted: true,
      // },
    ],
  },
  {
    label: t('Help'),
    items: [
      {
        label: t('Customer Support'),
        href: 'https://golfinance.gitbook.io/golfinance/about-golfinance/contact-us/customer-support',
      },
      {
        label: t('Troubleshooting'),
        href: 'https://golfinance.gitbook.io/golfinance/about-golfinance/help/troubleshooting',
      },
      {
        label: t('Guides'),
        href: 'https://golfinance.gitbook.io/golfinance/about-golfinance/get-started',
      },
    ],
  },
  {
    label: t('Developers'),
    items: [
      {
        label: 'Github',
        href: 'https://github.com/GolFinance',
      },
      {
        label: t('Documentation'),
        href: 'https://golfinance.gitbook.io/',
      },
      {
        label: t('Bug Bounty'),
        href: 'https://golfinance.gitbook.io/golfinance/developers/bug-bounty',
      },
      {
        label: t('Audits'),
        href: 'https://golfinance.gitbook.io/golfinance/about-golfinance/security-and-risks/audits',
      },
      {
        label: t('Careers'),
        href: 'https://golfinance.gitbook.io/golfinance/community/join-us',
      },
    ],
  },
]