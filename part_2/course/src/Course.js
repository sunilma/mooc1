import React from 'react';



const Header = ({header}) => <h1>{ header }</h1>



const Content = ({ parts }) => (
    <div>
      {parts.map(part => (
        <p key={part.id}>
          {part.name} {part.exercises}
        </p>
      ))}
    </div>
  );


  const Total = ({ parts }) => (
    <p>
      Total of{" "}
      {
          parts.reduce((total, part) => total + part.exercises, 0)
      }{" "}exercises
    </p>
  );



const Course = ({ course }) => {
    return (
        <div>
            <Header header={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </div>
    )
}

export default Course;