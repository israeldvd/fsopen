const Header = (props) => <h1>{props.course}</h1>;

const Part = (props) => (
  <p>
    {props.name} {props.exercisesCount}
  </p>
);

const Content = (props) => (
  <>
    <Part
      name={props.parts[0].name}
      exercisesCount={props.parts[0].exercises}
    />
    <Part
      name={props.parts[1].name}
      exercisesCount={props.parts[1].exercises}
    />
    <Part
      name={props.parts[2].name}
      exercisesCount={props.parts[2].exercises}
    />
  </>
);

const Total = (props) => (
  <p>
    Number of exercises{" "}
    {props.parts[0].exercises +
      props.parts[1].exercises +
      props.parts[2].exercises}
  </p>
);

const App = () => {
  const course = {
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
      },
      {
        name: "State of a component",
        exercises: 14,
      },
    ],
  };

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

export default App;
