import {
  Button,
  ExpandIcon,
  Flex,
  IconButton,
  ShrinkIcon,
  SyncAltIcon,
  Text,
  // ListViewIcon,
  // CardViewIcon,
  useMatchBreakpoints,
} from 'gol-uikit'
import { CurrencyLogo, DoubleCurrencyLogo } from 'components/Logo'
import { TradingViewLabel } from 'components/TradingView'
import { useTranslation } from 'contexts/Localization'
import React, { useCallback, useState } from 'react'
import { ChartViewMode } from 'state/user/actions'
import { useExchangeChartViewManager } from 'state/user/hooks'
import styled from 'styled-components'
import BasicChart from './BasicChart'
import { StyledPriceChart } from './styles'
import TradingViewChart from './TradingViewChart'
import TokenDisplay from './TokenDisplay'

const ChartButton = styled(Button)`
  background-color: ${({ $active, theme }) => $active && `${theme.colors.primary}0f`};
  padding: 4px 8px;
  border-radius: 6px;
`

const PriceChart = ({
  inputCurrency,
  outputCurrency,
  onSwitchTokens,
  isDark,
  isChartExpanded,
  setIsChartExpanded,
  isMobile,
  token0Address,
  token1Address,
  currentSwapPrice,
}) => {
  const { isDesktop } = useMatchBreakpoints()
  const toggleExpanded = () => setIsChartExpanded((currentIsExpanded) => !currentIsExpanded)
  const [chartView, setChartView] = useExchangeChartViewManager()
  const [twChartSymbol, setTwChartSymbol] = useState('')
  const { t } = useTranslation()

  const handleTwChartSymbol = useCallback((symbol) => {
    setTwChartSymbol(symbol)
  }, [])

  return (
    <StyledPriceChart
      height={chartView === ChartViewMode.TRADING_VIEW ? '100%' : '70%'}
      overflow={chartView === ChartViewMode.TRADING_VIEW ? 'hidden' : 'unset'}
      $isDark={isDark}
      $isExpanded={isChartExpanded}
    >
      <Flex justifyContent="space-between" px="24px">
        <Flex alignItems="center">
          {outputCurrency ? (
            <DoubleCurrencyLogo currency0={inputCurrency} currency1={outputCurrency} size={24} margin />
          ) : (
            inputCurrency && <CurrencyLogo currency={inputCurrency} size="24px" style={{ marginRight: '8px' }} />
          )}
          {inputCurrency && (
            <Text color="text" bold>
              {outputCurrency ? `${inputCurrency.symbol}/${outputCurrency.symbol}` : inputCurrency.symbol}
            </Text>
          )}
          <IconButton variant="text" onClick={onSwitchTokens}>
            <SyncAltIcon ml="6px" color="primary" />
          </IconButton>
          <Flex>
            <ChartButton
              aria-label={t('Basic')}
              title={t('Basic')}
              $active={chartView === ChartViewMode.BASIC}
              scale="sm"
              variant="text"
              color="primary"
              onClick={() => setChartView(ChartViewMode.BASIC)}
              mr="8px"
            >
              {isDesktop ? t('Basic') : 
                <svg viewBox="0 0 23 21" color="primary" width="20px" xmlns="http://www.w3.org/2000/svg" style={{ alignSelf: "center", fill: "#f7941d", flexShrink: 0 }}>
                  <path d="M17.553 3.091v.001c0 .55.19 1.081.541 1.502l-3.68 7.364a2.346 2.346 0 00-.827.108L10.833 8.97c.14-.3.217-.63.22-.967h0v-.003a2.35 2.35 0 00-2.35-2.35 2.35 2.35 0 00-2.35 2.35V8c.004.499.165.984.465 1.384l-3.477 6.082A2.35 2.35 0 00.75 17.803a2.35 2.35 0 002.35 2.35 2.35 2.35 0 002.35-2.35V17.8a2.338 2.338 0 00-.464-1.384l3.472-6.081c.322.037.65.004.957-.098l2.751 3.096a2.38 2.38 0 00-.216.967v.002a2.352 2.352 0 002.34 2.36 2.352 2.352 0 002.36-2.342v0c0-.55-.19-1.086-.54-1.51l3.68-7.365A2.35 2.35 0 0022.25 3.1a2.347 2.347 0 00-4.697-.01z" stroke="currentColor" strokeWidth="0.5" />
                </svg>
              }
            </ChartButton>
            <ChartButton
              aria-label="TradingView"
              title="TradingView"
              $active={chartView === ChartViewMode.TRADING_VIEW}
              scale="sm"
              variant="text"
              onClick={() => setChartView(ChartViewMode.TRADING_VIEW)}
            >
              {isDesktop ? 'TradingView' : 
                <svg viewBox="0 0 21 11" color="primary" width="20px" xmlns="http://www.w3.org/2000/svg" style={{ alignSelf: "center", fill: "#f7941d", flexShrink: 0 }}>
                  <path d="M.504.591l8.09.002.043 10.19-4.09-.03-.001-6.113L.5 4.633.504.591zM11.652 4.535a2.042 2.042 0 100-4.083 2.042 2.042 0 000 4.083zM15.787.598L20.5.603l-4.27 10.105-4.663-.01L15.754.606l.033-.008z" />
                </svg>
              }
            </ChartButton>
          </Flex>
        </Flex>
        {!isMobile && (
          <Flex>
            <IconButton variant="text" onClick={toggleExpanded}>
              {isChartExpanded ? <ShrinkIcon color="text" /> : <ExpandIcon color="text" />}
            </IconButton>
          </Flex>
        )}
      </Flex>
      {chartView === ChartViewMode.BASIC && (
        <BasicChart
          token0Address={token0Address}
          token1Address={token1Address}
          isChartExpanded={isChartExpanded}
          inputCurrency={inputCurrency}
          outputCurrency={outputCurrency}
          isMobile={isMobile}
          currentSwapPrice={currentSwapPrice}
        />
      )}
      {chartView === ChartViewMode.TRADING_VIEW && (
        <Flex
          flexDirection="column"
          justifyContent="space-between"
          height={isMobile ? '100%' : isChartExpanded ? 'calc(100% - 48px)' : '458px'}
          pt="12px"
        >
          <Flex justifyContent="space-between" alignItems="baseline" flexWrap="wrap">
            <TokenDisplay
              value={currentSwapPrice?.[token0Address]}
              inputSymbol={inputCurrency?.symbol}
              outputSymbol={outputCurrency?.symbol}
              mx="24px"
            />
            {twChartSymbol && <TradingViewLabel symbol={twChartSymbol} />}
          </Flex>
          <TradingViewChart
            // unmount the whole component when symbols is changed
            key={`${inputCurrency?.symbol}-${outputCurrency?.symbol}`}
            inputSymbol={inputCurrency?.symbol}
            outputSymbol={outputCurrency?.symbol}
            isDark={isDark}
            onTwChartSymbol={handleTwChartSymbol}
          />
        </Flex>
      )}
    </StyledPriceChart>
  )
}

export default PriceChart
