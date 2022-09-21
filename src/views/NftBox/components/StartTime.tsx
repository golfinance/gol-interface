import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const StartTimeContainer = styled.div`
  margin-top: 20px;
`

const StartTimeTitle = styled.div`
  font-size: 14px;
  color: hsla(0, 0%, 100%, 0.8);
`
const StartTimeItems = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
`

const StartTimeItem = styled.div`
  display: flex;
  align-items: center;
`

const Num = styled.div`
  box-sizing: border-box;
  padding: 0 6px;
  min-width: 40px;
  font-size: 18px;
  font-weight: 700;
  height: 40px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`
const Sep = styled.div`
  margin: 0 8px;
  font-size: 18px;
  font-weight: 700;
`

export interface StartTimeInterface {
  countdown?: number
}

const StartTime = ({ countdown }: StartTimeInterface) => {
  const [day, setDay] = useState(0)
  const [hour, setHour] = useState(0)
  const [minute, setMinute] = useState(0)
  const [second, setSecond] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const current = new Date()
      const range = (countdown - current.getTime()) / 1000

      if (range < 0) {
        setDay(0)
        setHour(0)
        setMinute(0)
        setSecond(0)
        return
      }

      setDay(Math.floor(range / 3600 / 24))
      setHour(Math.floor((range % (3600 * 24)) / 3600))
      setMinute(Math.floor((range % 3600) / 60))
      setSecond(Math.floor(range % 60))
    }, 1000)

    return () => clearInterval(interval)
  }, [countdown])

  return (
    <StartTimeContainer>
      <StartTimeTitle>Start Time</StartTimeTitle>
      <StartTimeItems>
        <StartTimeItem>
          <Num>{day}</Num>
        </StartTimeItem>
        <StartTimeItem>
          <Sep>:</Sep>
          <Num>{hour}</Num>
        </StartTimeItem>
        <StartTimeItem>
          <Sep>:</Sep>
          <Num>{minute}</Num>
        </StartTimeItem>
        <StartTimeItem>
          <Sep>:</Sep>
          <Num>{second}</Num>
        </StartTimeItem>
      </StartTimeItems>
    </StartTimeContainer>
  )
}

export default StartTime
