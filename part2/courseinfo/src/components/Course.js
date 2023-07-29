const Header = ({ courseName }) => <h2>{courseName}</h2>;

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

  const partSum = parts.reduce((sum, part) => sum + part.exercises, 0);

  return (
    <section>
      <Header courseName={name} />
      <Content parts={parts} />
      <Total sum={partSum} />
    </section>
  );
};

export default Course;
