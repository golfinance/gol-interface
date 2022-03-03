import React from 'react'
import styled from 'styled-components'
import ItemMainContainer from './ItemMainContainer'

export interface BlindBoxItemInterface {
  itemId?: number
  background?: string
  itemTitle?: string
}

const ItemBackgroundCover = styled.div`
  width: 100%;
  height: 250px;
  overflow: hidden;
  position: relative;
  margin-bottom: 25px;
  margin-top: 25px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 32px;
`

const BlindBoxItem = ({ itemId, background, itemTitle }: BlindBoxItemInterface) => {
  const ItemBackground = styled.div`
    width: 100%;
    height: 100%;
    background-image: url(images/${background});
    background-size: cover;
    background-position: 0;
    background-repeat: no-repeat;
    cursor: pointer;
    transition: all 1s;
    &:hover {
      transform: scale(1.02);
    }
    @media (max-width: 768px) {
      background-position: 30%;
    }
  `
  return (
    <ItemBackgroundCover>
      <ItemBackground>
        <ItemMainContainer itemId={itemId} itemTitle={itemTitle} />
      </ItemBackground>
    </ItemBackgroundCover>
  )
}

export default BlindBoxItem
