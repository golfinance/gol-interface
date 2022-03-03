import React from 'react'
import styled from 'styled-components'

const BoxContainer = styled.div`
  width: calc(100% - 24px);
  display: flex;
  margin: 12px;
  cursor: pointer;
`

const BoxImageFlur = styled.div`
  background-size: 600%;
  filter: blur(30px);
  background-position: 70% 50%;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
`

const BoxImageContainer = styled.div`
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  padding-bottom: 100%;
  width: 100%;
  height: 100%;
`

const BoxImage = styled.div`
  background-size: cover;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: 50%;
  transition: transform 0.3s ease, -webkit-transform 0.3s ease;
  &:hover {
    transform: scale(1.02);
  }
`
const BoxTitle = styled.div`
  position: absolute;
  bottom: 12px;
  background: rgba(0, 0, 0, 0.16);
  border-radius: 6px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 14px;
  font-weight: 700;
  color: white;
  padding: 3px 6px;
`

export interface BoxContainerComponentInterface {
  boxTitle?: string
  boxImage?: string
}

const BoxContainerComponent = ({ boxTitle, boxImage }: BoxContainerComponentInterface) => {
  return (
    <BoxContainer>
      <BoxImageContainer>
        <BoxImageFlur style={{ backgroundImage: `url(../images/${boxImage})` }} />
        <BoxImage style={{ backgroundImage: `url(../images/${boxImage})` }} />
        <BoxTitle>{boxTitle}</BoxTitle>
      </BoxImageContainer>
    </BoxContainer>
  )
}

export default BoxContainerComponent
