import React from 'react'
import { ModalProvider, light, dark } from 'gol-uikit'
import { Web3ReactProvider } from '@web3-react/core'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import { useThemeManager } from 'state/user/hooks'
import { getLibrary } from 'utils/web3React'
import { LanguageProvider } from 'contexts/Localization'
import { RefreshContextProvider } from 'contexts/RefreshContext'
import { LoadingContextProvider } from 'contexts/LoadingContext'
import { StakeContextProvider } from 'contexts/StakeContext'
import { ToastsProvider } from 'contexts/ToastsContext'
import getRpcUrl from 'utils/getRpcUrl'
import store from 'state'

const ThemeProviderWrapper = (props) => {
  const [isDark] = useThemeManager()
  return <ThemeProvider theme={isDark ? dark : dark} {...props} />
}

const Providers: React.FC = ({ children }) => {
  const rpcUrl = getRpcUrl()
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Provider store={store}>
        <ToastsProvider>
          <HelmetProvider>
            <ThemeProviderWrapper>
              <LanguageProvider>
                <RefreshContextProvider>
                  <LoadingContextProvider>
                    <StakeContextProvider>
                      <ModalProvider>{children}</ModalProvider>
                    </StakeContextProvider>
                  </LoadingContextProvider>
                </RefreshContextProvider>
              </LanguageProvider>
            </ThemeProviderWrapper>
          </HelmetProvider>
        </ToastsProvider>
      </Provider>
    </Web3ReactProvider>
  )
}

export default Providers
