const Header = ({ course }) => <h2>{course}</h2>;

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

const Content = ({ parts }) => (
  <>
    {parts.map(part => <Part part={part} key={part.id} />)}
  </>
);

const Course = ({ course }) => (
  <div>
    <Header course={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </div>
);

const Total = ({ parts }) => {
  let total = parts.reduce((total, part) => total + part.exercises, 0);

  return (
    <>
      <p style={{ fontWeight: 'bold' }}>Number of exercises {total}</p>
    </>
  )
};

export default Course;