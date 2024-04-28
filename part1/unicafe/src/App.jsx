import { useState } from 'react'

const Button = ({label, handleClick}) => {
  return <button onClick={handleClick}>{label}</button>
}

const StatisticLine = ({label, value}) => {
  return (
    <tr>
      <td>{label}</td><td>{value}</td>
    </tr>
  )
}

const Statistics = ({good, bad, neutral, total}) => {
  if(total === 0) {
    return (
      <div>No feedback given</div>
    )
  } 
  
  return (
    <table>
      <tbody>
        <StatisticLine label="good" value={good} />
        <StatisticLine label="neutral" value={neutral} />
        <StatisticLine label="bad" value={bad} />
        <StatisticLine label="all" value={total} />
        <StatisticLine label="average" value={(good - bad) / total} />
        <StatisticLine label="positive" value={(good / total * 100) + '%'} />
      </tbody>
    </table>
  )
}

function App() {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const onClick = (label) => {
    switch (label) {
      case "good": setGood(good + 1); break;
      case "neutral": setNeutral(neutral + 1); break;
      case "bad": setBad(bad + 1); break;
    }
  }

  const getTotal = () => good + neutral + bad

  return (
    <div>
      <h1>give feedback</h1>
      <Button label="good" handleClick={() => onClick("good")} />
      <Button label="neutral" handleClick={() => onClick("neutral")} />
      <Button label="bad" handleClick={() => onClick("bad")} />

      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} total={getTotal()} />
    </div>
  )
}

export default App
