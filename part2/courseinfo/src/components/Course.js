const Header = ({ courseName }) => <h1>{courseName}</h1>;

const Part = ({ name, exercisesCount }) => (
  <p>
    {name} {exercisesCount}
  </p>
);

const Content = ({ parts }) => (
  <>
    <Part name={parts[0].name} exercisesCount={parts[0].exercises} />
    <Part name={parts[1].name} exercisesCount={parts[1].exercises} />
    <Part name={parts[2].name} exercisesCount={parts[2].exercises} />
  </>
);

const Total = ({ sum }) => <p>Number of exercises {sum}</p>;

const Course = ({ course }) => {
  const { name, parts } = course;

  return (
    <>
      <Header courseName={name} />
      <Content parts={parts} />
      <Total
        sum={parts[0].exercises + parts[1].exercises + parts[2].exercises}
      />
    </>
  );
};

export default Course;
