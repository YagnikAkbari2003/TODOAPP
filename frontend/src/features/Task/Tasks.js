import React from "react";
import Task from "./Task";

const Tasks = ({ tasks, onEdit, setTask }) => {
  if (!tasks.length) {
    return <p className="loader-no-content">No Task Found!</p>;
  }

  return (
    <>
      <div className="sub-heading">
        <i className="fas fa-home my-home"></i>Tasks
      </div>
      {tasks.map((task) => {
        return <Task task={task} onEdit={onEdit} key={task.id} />;
      })}
    </>
  );
};

export default Tasks;
