import { useState } from "react";

const Header = ({ text }) => <h1>{text}</h1>;

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

const Statistics = ({ feedbackCounts }) => {
  return (
    <>
      <h2>Statistics</h2>
      <Feedback description={"good"} count={feedbackCounts.good} />
      <Feedback description={"neutral"} count={feedbackCounts.neutral} />
      <Feedback description={"bad"} count={feedbackCounts.bad} />
    </>
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
      <Header text="Give feedback" />
      <Button text="good" handleClick={handleGoodFeedback} />
      <Button text="neutral" handleClick={handleNeutralFeedback} />
      <Button text="bad" handleClick={handleBadFeedback} />
      <Statistics feedbackCounts={{ good, neutral, bad }} />
    </div>
  );
};

export default App;
