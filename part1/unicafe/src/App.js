import { useState } from "react";

const Header = ({ text }) => <h1>{text}</h1>;

const Button = ({ text, handleClick }) => (
  <button onClick={handleClick}>{text}</button>
);

const StatisticLine = ({ description, count }) => {
  return (
    <p>
      {description} {count}
    </p>
  );
};

const StatisticInfos = ({ feedbackCounts }) => {
  const { good, bad, feedback_sum: sum } = feedbackCounts;

  const averageFeedback = (good - bad) / sum;

  return (
    <>
      <p>all {sum}</p>
      <p>average value {averageFeedback}</p>
      <p>positive {good / sum} %</p>
    </>
  );
};

const Statistics = ({ feedbackCounts }) => {
  const { good, neutral, bad, feedback_sum: sum } = feedbackCounts;

  if (sum === 0) {
    return (
      <>
        <h2>Statistics</h2>
        <p>No feedback given. Try adding a new one!</p>
      </>
    );
  }

  return (
    <>
      <h2>Statistics</h2>
      <StatisticLine description={"good"} count={good} />
      <StatisticLine description={"neutral"} count={neutral} />
      <StatisticLine description={"bad"} count={bad} />
      <StatisticInfos feedbackCounts={feedbackCounts} />
    </>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const feedback_sum = good + neutral+bad;

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
      <Statistics feedbackCounts={{ good, neutral, bad, feedback_sum }} />
    </div>
  );
};

export default App;
