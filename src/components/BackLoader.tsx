import React from 'react'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { Spinner } from 'gol-uikit'

const BackLoader: React.FC = () => {
  const { isDark } = useTheme()

  const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    position: absolute;
    background: ${isDark ? '#00000090' : '#ffffff80'};
    top: 0;
    left: 0;
    backdrop-filter: blur(2px);
    z-index: 50;

    svg {
      filter: drop-shadow(2px 4px 6px ${isDark ? '#ffffff80' : '#00000090'});
    }
  `

  const SpinnerContainer = styled.div`
    display: flex;
    justify-content: center;
    height: calc(var(--windowHeight));
    top: 50%;
    height: 50%;
    width: 100%;
  `

  return (
    <Wrapper>
      <SpinnerContainer>
        <Spinner />
      </SpinnerContainer>
    </Wrapper>
  )
}

export default BackLoader
