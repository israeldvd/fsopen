import { useState } from "react";

const Header = ({ text }) => <h1>{text}</h1>;

const Button = ({ text, handleClick }) => (
  <button onClick={handleClick}>{text}</button>
);

const StatisticLine = ({ description, value }) => {
  return (
    <>
      <td>{description}</td><td>{value}</td>
    </>
  );
};

const Statistics = ({ feedbackCounts }) => {
  const { good, neutral, bad, feedback_sum: sum } = feedbackCounts;
  const averageFeedback = (good - bad) / sum;

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
      <table>
        <thead>
          <tr>
            <td>
              description
            </td>
            <td>
              value
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <StatisticLine description={"good"} value={good} />
          </tr>
          <tr>
            <StatisticLine description={"neutral"} value={neutral} />
          </tr>
          <tr>
            <StatisticLine description={"bad"} value={bad} />
          </tr>
          <tr>
            <StatisticLine description="all" value={sum} />
          </tr>
          <tr>
            <StatisticLine description="average value" value={averageFeedback} />
          </tr>
          <tr>
            <StatisticLine description="positive" value={`${good / sum} %`} />
          </tr>
        </tbody>
      </table >
    </>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const feedback_sum = good + neutral + bad;

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
