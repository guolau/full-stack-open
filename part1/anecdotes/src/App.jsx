import { useState } from 'react'

const Button = ({label, onClick}) => <button onClick={onClick}>{label}</button>

const MostVoted = ({anecdotes, votes}) => {
  let index = 0
  let max = votes[0]
  for(let i = 0; i < anecdotes.length; i++) {
    if(votes[i] > max) {
      max = votes[i]
      index = i
    }
  }

  return (
    <>
      <div>
        {anecdotes[index]}
      </div>
      <div>
        has {votes[index]} votes
      </div>
    </>
  )
}

function App() {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ] 
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))
  
  const getRandomAnecdoteIndex = () => Math.floor(Math.random() * anecdotes.length)

  const onVote = (anecdoteIndex) => {
    let copy = [...votes]
    copy[anecdoteIndex] += 1
    setVotes(copy)
  }

  return (
    <>
      <h1>Anecdote of the Day</h1>
      <div>
        {anecdotes[selected]}
      </div>
      <div>
        has {votes[selected]} votes
      </div>
      
      <Button label="vote" onClick={() => onVote(selected)} />
      <Button label="next anecdote" onClick={() => setSelected(getRandomAnecdoteIndex())} />

      <h1>Anecdote with Most Votes</h1>
      <MostVoted anecdotes={anecdotes} votes={votes} />
    </>
  )
}

export default App
