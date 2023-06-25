import { useState } from "react";

const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const anecdotesLastPosition = anecdotes.length - 1;
  const initialVotesState = { 0: 0 };
  anecdotes.forEach((_value, i) => {
    initialVotesState[i] = 0;
  });

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(initialVotesState);

  console.log(initialVotesState);

  return (
    <>
      <div>
        <p>{anecdotes[selected]}</p>
        <p>this has {votes[selected]} votes</p>
      </div>
      <div>
        <button
          onClick={() => {
            const newVotesState = {
              ...votes,
              [selected]: votes[selected] + 1,
            };
            setVotes(newVotesState);
          }}>
          vote
        </button>
        <button
          onClick={() =>
            setSelected(getRandomIntInclusive(0, anecdotesLastPosition))
          }>
          next anecdote
        </button>
      </div>
    </>
  );
};

export default App;
