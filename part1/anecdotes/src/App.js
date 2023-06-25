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
  let mostVotedPosition = 0;
  const initialVotesState = { 0: 0 };

  anecdotes.forEach((_value, i) => {
    initialVotesState[i] = 0;
  });

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(initialVotesState);
  const [mostVoted, setMostVoted] = useState(0);

  const updateVoteCount = (currentPosition) => {
    const currentVoteCount = votes[currentPosition];
    const newVoteCount = currentVoteCount + 1;

    const newVotesState = {
      ...votes,
      [currentPosition]: newVoteCount,
    };

    if (currentVoteCount > votes[mostVoted]) {
      mostVotedPosition = currentPosition;
      setMostVoted(mostVotedPosition);
      console.log(`new most voted quote position: ${mostVotedPosition}`);
    }

    setVotes(newVotesState);
  };

  return (
    <>
      <div>
        <h2>Anecdote of the moment</h2>
        <p>{anecdotes[selected]}</p>
        <p>this has {votes[selected]} votes</p>
        <button onClick={() => updateVoteCount(selected)}>vote</button>
        <button
          onClick={() =>
            setSelected(getRandomIntInclusive(0, anecdotesLastPosition))
          }>
          next anecdote
        </button>
      </div>
      <div>
        <h2>Quote with the most votes</h2>
        <p>{anecdotes[mostVoted]}</p>
        <p>this has {votes[mostVoted]} votes</p>
      </div>
    </>
  );
};

export default App;
