import { useState } from "react";

const Button = ({ text, handleClick }) => (
  <button onClick={handleClick}>{text}</button>
);

const Feedback = ({ description, count }) => {
  return (
    <p>
      {description} {count}
    </p>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleGoodFeedback = () => {
    setGood(good + 1);
  };
  const handleNeutralFeedback = () => {
    setNeutral(neutral + 1);
  };
  const handleBadFeedback = () => {
    setBad(bad + 1);
  };

  return (
    <div>
      <h1>Give feedback</h1>
      <Button text="good" handleClick={handleGoodFeedback} />
      <Button text="neutral" handleClick={handleNeutralFeedback} />
      <Button text="bad" handleClick={handleBadFeedback} />

      <h2>Statistics</h2>
      <Feedback description={"good"} count={good} />
      <Feedback description={"neutral"} count={neutral} />
      <Feedback description={"bad"} count={bad} />
    </div>
  );
};

export default App;
