const Header = ({ courseName }) => <h1>{courseName}</h1>;

const Part = ({ name, exercises }) => (
  <p>
    {name} {exercises}
  </p>
);

const Content = ({ parts }) => (
  <>
    {parts.map((part) => {
      return <Part key={part.id} name={part.name} exercises={part.exercises} />;
    })}
  </>
);

const Total = ({ sum }) => (
  <p>
    <b>Total of {sum} exercises</b>
  </p>
);

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
